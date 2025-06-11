import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { GraphDataService } from '../../services/graph-data.service';
import Graph from 'graphology';
import Sigma from 'sigma';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Interfaces pour les modèles de données
interface Artiste {
  id: number;
  nom: string;
  prenom?: string;
  nationalite?: string;
  genre?: string;
  description?: string;
}

interface Oeuvre {
  id: number;
  nom: string;
  date_creation: number;
  mouvement?: string;
  genre?: string;
  description?: string;
  dimensions?: string;
  type?: string;
}

interface InfluenceRelation {
  path: Oeuvre[];
  direction: string;
  weight?: number;
}

interface CreationRelation {
  artiste: Artiste;
  oeuvre: Oeuvre;
  type: string;
}

interface NodeAttributes {
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  nodeType: 'oeuvre' | 'artiste';
  nodeData: Artiste | Oeuvre;
}

interface EdgeAttributes {
  color: string;
  size: number;
  label: string;
  type: string;
  relationType: 'influence' | 'a_cree' | 'relation';
  sourceId: string;
  targetId: string;
}

interface FilterConfig {
  type?: string;
  mouvement?: string;
  periode?: string;
  nationalite?: string;
  genre?: string;
  recherche?: string;
  showInfluence?: boolean;
  showRelations?: boolean;
  showCreation?: boolean;
}

interface GraphData {
  relations: InfluenceRelation[];
  artistes: Artiste[];
  oeuvres: Oeuvre[];
  creationRelations: CreationRelation[];
}

interface NodePosition {
  x: number;
  y: number;
}

interface SelectedElement {
  sourceId?: string;
  targetId?: string;
  edgeKey?: string;
  type?: string;
}

// Classe utilitaire pour la gestion des filtres
class FilterManager {
  private searchTerm: string;
  private filters: FilterConfig;

  constructor(filters: FilterConfig, searchTerm: string) {
    this.filters = filters;
    this.searchTerm = searchTerm;
  }

  oeuvrePassesFilters(oeuvre: Oeuvre): boolean {
    const { mouvement, periode, genre } = this.filters;
    
    // Si aucun filtre n'est appliqué, afficher toutes les œuvres
    const hasActiveFilters = (this.searchTerm && this.searchTerm.trim() !== '') ||
                            (mouvement && mouvement.trim() !== '') ||
                            (genre && genre.trim() !== '') ||
                            (periode && periode.trim() !== '');
    
    if (!hasActiveFilters) {
      return true;
    }
    
    // Filtre de recherche
    if (this.searchTerm && this.searchTerm.trim() !== '' && 
        !oeuvre.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtre de mouvement
    if (mouvement && mouvement.trim() !== '' && oeuvre.mouvement !== mouvement) {
      return false;
    }
    
    // Filtre de genre
    if (genre && genre.trim() !== '' && oeuvre.genre !== genre) {
      return false;
    }
    
    // Filtre de période
    if (periode && periode.trim() !== '') {
      const year = oeuvre.date_creation;
      if (
        (periode === '1800&1900' && (year < 1800 || year > 1900)) ||
        (periode === '1900&2000' && (year < 1900 || year > 2000)) ||
        (periode === 'Apres2000' && year <= 2000)
      ) {
        return false;
      }
    }
    
    return true;
  }

  artistePassesFilters(artiste: Artiste): boolean {
    const { nationalite, genre } = this.filters;
    const nom = artiste.nom || artiste.id.toString();
    
    // Filtre de recherche
    if (this.searchTerm && this.searchTerm.trim() !== '' && 
        !nom.toLowerCase().includes(this.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtre de nationalité
    if (nationalite && nationalite.trim() !== '' && 
        (!artiste.nationalite || artiste.nationalite.toLowerCase() !== nationalite.toLowerCase())) {
      return false;
    }
    
    // Filtre de genre
    if (genre && genre.trim() !== '' && 
        (!artiste.genre || artiste.genre.toLowerCase() !== genre.toLowerCase())) {
      return false;
    }
    
    return true;
  }
}

// Classe utilitaire pour la gestion des layouts
class LayoutManager {
  private static readonly OEUVRE_COLORS = {
    default: '#8b5cf6',
    selected: '#f59e42'
  };

  private static readonly ARTISTE_COLORS = {
    default: '#60a5fa',
    selected: '#f59e42'
  };

  private static readonly EDGE_COLORS = {
    influence: '#ef4444',
    creation: '#3b82f6',
    selected: '#f59e42'
  };

  static createOeuvreNode(oeuvre: Oeuvre, position: NodePosition, size: number = 12): NodeAttributes {
    return {
      label: `${oeuvre.nom} - ${oeuvre.date_creation}`,
      x: position.x,
      y: position.y,
      size: size,
      color: this.OEUVRE_COLORS.default,
      nodeType: 'oeuvre',
      nodeData: oeuvre
    };
  }

  static createArtisteNode(artiste: Artiste, position: NodePosition, size: number = 12): NodeAttributes {
    const nom = artiste.nom || artiste.id.toString();
    return {
      label: nom,
      x: position.x,
      y: position.y,
      size: size,
      color: this.ARTISTE_COLORS.default,
      nodeType: 'artiste',
      nodeData: artiste
    };
  }

  static createInfluenceEdge(sourceId: string, targetId: string, direction: string): EdgeAttributes {
    return {
      color: this.EDGE_COLORS.influence,
      size: 3,
      label: direction,
      type: 'arrow',
      relationType: 'influence',
      sourceId: sourceId,
      targetId: targetId
    };
  }

  static createCreationEdge(artisteNom: string, oeuvreId: string): EdgeAttributes {
    return {
      color: this.EDGE_COLORS.creation,
      size: 3,
      label: 'A_CREE',
      type: 'arrow',
      relationType: 'a_cree',
      sourceId: artisteNom,
      targetId: oeuvreId
    };
  }

  static calculateGridPosition(index: number, maxPerRow: number, xStep: number, yStep: number): NodePosition {
    const row = Math.floor(index / maxPerRow);
    const col = index % maxPerRow;
    return {
      x: col * xStep,
      y: row * yStep
    };
  }

  static calculateTreePosition(level: number, index: number, xStep: number, yStep: number): NodePosition {
    return {
      x: index * xStep,
      y: level * yStep
    };
  }
}

@Component({
  selector: 'app-genelogie',
  standalone: true,
  imports: [],
  templateUrl: './genelogie-component.html',
  styleUrl: './genelogie-component.scss'
})
export class GenelogieComponent implements OnInit, OnChanges {
  @Input() filtres: FilterConfig = {};
  @Input() recherche: string = '';
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private graph!: Graph;
  private renderer!: Sigma;
  private selectedNode: string | null = null;
  private draggingNode: string | null = null;
  private filterManager!: FilterManager;

  // Propriétés pour le panneau d'informations
  public selectedElement: Artiste | Oeuvre | SelectedElement | null = null;
  public selectedElementType: 'oeuvre' | 'artiste' | 'relation' | null = null;
  public showCrudPanel = false;

  // Getters typés pour accéder aux propriétés de manière sûre
  get selectedOeuvre(): Oeuvre | null {
    return this.selectedElementType === 'oeuvre' ? this.selectedElement as Oeuvre : null;
  }

  get selectedArtiste(): Artiste | null {
    return this.selectedElementType === 'artiste' ? this.selectedElement as Artiste : null;
  }

  get selectedRelation(): SelectedElement | null {
    return this.selectedElementType === 'relation' ? this.selectedElement as SelectedElement : null;
  }

  constructor(private graphService: GraphDataService, private router: Router) {}

  ngOnInit() {
    this.setupGraph();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['filtres'] || changes['recherche']) && this.graph) {
      this.loadGraphFromBackend();
    }
  }

  setupGraph() {
    this.graph = new Graph();
    this.renderer = new Sigma(this.graph, this.containerRef.nativeElement, {
      renderEdgeLabels: true,
      labelRenderedSizeThreshold: 8,
      edgeLabelSize: 12,
      defaultEdgeType: 'arrow',
    });
    this.loadGraphFromBackend();
    this.setupInteractions();
  }

  loadGraphFromBackend() {
    if (!this.graph) return;
    this.graph.clear();

    forkJoin({
      relations: this.graphService.getInfluencesByOeuvre(1),
      responseArtistes: this.graphService.getArtistes(),
      responseOeuvres: this.graphService.getOeuvres(),
      creationRelations: this.graphService.getAllCreationRelations()
    }).subscribe({
      next: (data) => {
        const graphData: GraphData = {
          relations: data.relations,
          artistes: data.responseArtistes.data || [],
          oeuvres: data.responseOeuvres.data || [],
          creationRelations: data.creationRelations
        };

        this.initializeFilterManager();
        this.buildGraph(graphData);
        this.logGraphStats();
        this.renderer.refresh();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du graphe:', error);
      }
    });
  }

  private initializeFilterManager() {
    const filtres = this.filtres || {};
    const searchTerm = filtres.recherche || this.recherche;
    this.filterManager = new FilterManager(filtres, searchTerm);
  }

  private buildGraph(data: GraphData) {
    const { type } = this.filtres || {};

    switch (type) {
      case 'oeuvres':
        this.buildOeuvresOnlyGraph(data);
        break;
      case 'artistes':
        this.buildArtistesOnlyGraph(data);
        break;
      default:
        this.buildMixedGraph(data);
        break;
    }

    this.addCreationRelations(data.creationRelations);
  }

  private buildOeuvresOnlyGraph(data: GraphData) {
    const { oeuvres, relations } = data;
    const allOeuvres = this.collectAllOeuvres(oeuvres, relations);
    const filteredOeuvres = allOeuvres.filter(oeuvre => this.filterManager.oeuvrePassesFilters(oeuvre));

    this.addOeuvreNodes(filteredOeuvres);
    this.addInfluenceEdges(relations);
    
    console.log(`Mode œuvres seulement: ${filteredOeuvres.length} œuvres affichées sur ${allOeuvres.length} total`);
  }

  private buildArtistesOnlyGraph(data: GraphData) {
    const { artistes } = data;
    const filteredArtistes = artistes.filter(artiste => this.filterManager.artistePassesFilters(artiste));

    this.addArtisteNodes(filteredArtistes);
    
    console.log(`Mode artistes seulement: ${filteredArtistes.length} artistes affichés sur ${artistes.length} total`);
  }

  private buildMixedGraph(data: GraphData) {
    const { artistes, relations } = data;
    const filteredArtistes = artistes.filter(artiste => this.filterManager.artistePassesFilters(artiste));

    this.addArtisteNodes(filteredArtistes);
    this.addInfluenceEdges(relations);
  }

  private collectAllOeuvres(oeuvres: Oeuvre[], relations: InfluenceRelation[]): Oeuvre[] {
    const toutesOeuvres = new Map<number, Oeuvre>();
    
    // Ajouter les œuvres de la liste directe
    oeuvres.forEach(oeuvre => toutesOeuvres.set(oeuvre.id, oeuvre));
    
    // Ajouter les œuvres des relations d'influence
    relations.forEach(relation => {
      relation.path.forEach((node: Oeuvre) => {
        if (node.id) {
          toutesOeuvres.set(node.id, node);
        }
      });
    });
    
    return Array.from(toutesOeuvres.values());
  }

  private addOeuvreNodes(oeuvres: Oeuvre[]) {
    const maxPerRow = 4;
    const xStep = 150;
    const yStep = 80;

    oeuvres.forEach((oeuvre, index) => {
      const position = LayoutManager.calculateGridPosition(index, maxPerRow, xStep, yStep);
      const nodeData = LayoutManager.createOeuvreNode(oeuvre, position);
      this.graph.addNode(oeuvre.id.toString(), nodeData);
    });
  }

  private addArtisteNodes(artistes: Artiste[]) {
    const maxPerRow = 4;
    const xStep = 200;
    const yStep = 150;

    artistes.forEach((artiste, index) => {
      const position = LayoutManager.calculateGridPosition(index, maxPerRow, xStep, yStep);
      const nodeData = LayoutManager.createArtisteNode(artiste, position);
      const nom = artiste.nom || artiste.id.toString();
      this.graph.addNode(nom, nodeData);
    });
  }

  private addInfluenceEdges(relations: InfluenceRelation[]) {
    const { showInfluence, showRelations } = this.filtres || {};
    const levelMap = new Map<number, number>();
    const yStep = 80;
    const xStep = 150;

    relations.forEach(relation => {
      const { path, direction } = relation;

      path.forEach((oeuvre: Oeuvre, i: number) => {
        if (!this.filterManager.oeuvrePassesFilters(oeuvre)) return;

        const nodeId = oeuvre.id.toString();
        if (!this.graph.hasNode(nodeId)) {
          const position = LayoutManager.calculateTreePosition(i, levelMap.get(i) || 0, xStep, yStep);
          const nodeData = LayoutManager.createOeuvreNode(oeuvre, position, 10);
          this.graph.addNode(nodeId, nodeData);
          levelMap.set(i, (levelMap.get(i) || 0) + 1);
        }

        this.addInfluenceEdgeIfValid(path, i, direction, showInfluence, showRelations);
      });
    });
  }

  private addInfluenceEdgeIfValid(path: Oeuvre[], index: number, direction: string, showInfluence?: boolean, showRelations?: boolean) {
    if (index <= 0) return;

    const sourceId = path[index - 1].id.toString();
    const targetId = path[index].id.toString();
    const edgeKey = `${sourceId}->${targetId}`;

    if (this.graph.hasNode(sourceId) && this.graph.hasNode(targetId) && !this.graph.hasEdge(edgeKey)) {
      const relationType = this.getRelationType(direction);
      
      if (this.shouldShowRelation(relationType, showInfluence, showRelations)) {
        const edgeData = LayoutManager.createInfluenceEdge(sourceId, targetId, direction);
        this.graph.addEdgeWithKey(edgeKey, sourceId, targetId, edgeData);
      }
    }
  }

  private addCreationRelations(creationRelations: CreationRelation[]) {
    const { type, showCreation } = this.filtres || {};
    
    if ((type === 'artistes' || type === 'oeuvres') || showCreation === false) return;

    creationRelations.forEach(relation => {
      const { artiste, oeuvre } = relation;
      
      if (!this.filterManager.artistePassesFilters(artiste) || 
          !this.filterManager.oeuvrePassesFilters(oeuvre)) return;

      this.addCreationRelationNodes(artiste, oeuvre);
      this.addCreationEdge(artiste, oeuvre);
    });
  }

  private addCreationRelationNodes(artiste: Artiste, oeuvre: Oeuvre) {
    const artisteNom = artiste.nom || artiste.id.toString();
    
    if (!this.graph.hasNode(artisteNom)) {
      const nodeData = LayoutManager.createArtisteNode(artiste, { x: 0, y: 0 });
      this.graph.addNode(artisteNom, nodeData);
    }
    
    if (!this.graph.hasNode(oeuvre.id.toString())) {
      const nodeData = LayoutManager.createOeuvreNode(oeuvre, { x: 0, y: 0 }, 10);
      this.graph.addNode(oeuvre.id.toString(), nodeData);
    }
  }

  private addCreationEdge(artiste: Artiste, oeuvre: Oeuvre) {
    const artisteNom = artiste.nom || artiste.id.toString();
    const edgeKey = `a_cree_${artisteNom}->${oeuvre.id}`;
    
    if (this.graph.hasNode(artisteNom) && this.graph.hasNode(oeuvre.id.toString()) && !this.graph.hasEdge(edgeKey)) {
      const edgeData = LayoutManager.createCreationEdge(artisteNom, oeuvre.id.toString());
      this.graph.addEdgeWithKey(edgeKey, artisteNom, oeuvre.id.toString(), edgeData);
    }
  }

  private shouldShowRelation(relationType: string, showInfluence?: boolean, showRelations?: boolean): boolean {
    if (relationType === 'influence' && showInfluence === false) return false;
    if (relationType === 'relation' && showRelations === false) return false;
    return true;
  }

  private logGraphStats() {
    console.log(`Graphe généré avec ${this.graph.order} nœuds et ${this.graph.size} arêtes`);
  }

  getRelationType(direction: string): string {
    if (!direction) return 'relation';
    const dir = direction.toLowerCase();
    if (dir.includes('influence') || dir.includes('descendance')) return 'influence';
    return 'relation';
  }

  setupInteractions() {
    this.setupDragInteractions();
    this.setupClickInteractions();
  }

  private setupDragInteractions() {
    this.renderer.on('downNode', ({ node }) => {
      this.draggingNode = node;
      this.renderer.getCamera().disable();
    });

    this.renderer.getMouseCaptor().on('mousemove', (e) => {
      if (!this.draggingNode) return;
      const pos = this.renderer.viewportToGraph({ x: e.x, y: e.y });
      this.graph.setNodeAttribute(this.draggingNode, 'x', pos.x);
      this.graph.setNodeAttribute(this.draggingNode, 'y', pos.y);
    });

    this.renderer.getMouseCaptor().on('mouseup', () => {
      this.draggingNode = null;
      this.renderer.getCamera().enable();
    });
  }

  private setupClickInteractions() {
    this.renderer.on('clickNode', ({ node }) => {
      this.handleNodeClick(node);
    });

    this.renderer.on('clickEdge', ({ edge }) => {
      this.handleEdgeClick(edge);
    });

    this.renderer.on('clickStage', () => {
      this.clearSelection();
    });
  }

  private handleNodeClick(node: string) {
    const nodeAttributes = this.graph.getNodeAttributes(node) as NodeAttributes;
    const nodeType = nodeAttributes.nodeType;
    const nodeData = nodeAttributes.nodeData;

    this.selectedElement = nodeData;
    this.selectedElementType = nodeType;
    this.showCrudPanel = true;

    this.highlightNode(node);
  }

  private handleEdgeClick(edge: string) {
    const edgeAttributes = this.graph.getEdgeAttributes(edge) as EdgeAttributes;
    const sourceId = edgeAttributes.sourceId;
    const targetId = edgeAttributes.targetId;

    this.selectedElement = {
      sourceId: sourceId,
      targetId: targetId,
      edgeKey: edge,
      type: edgeAttributes.relationType
    };
    this.selectedElementType = 'relation';
    this.showCrudPanel = true;

    this.highlightEdge(edge);
  }

  private highlightNode(node: string) {
    this.graph.setNodeAttribute(node, 'color', '#f59e42');
  }

  private highlightEdge(edge: string) {
    this.graph.setEdgeAttribute(edge, 'color', '#f59e42');
    this.graph.setEdgeAttribute(edge, 'size', 5);
  }

  public clearSelection() {
    this.restoreNodeColors();
    this.restoreEdgeColors();
    this.resetSelectionState();
  }

  private restoreNodeColors() {
    if (this.selectedElementType !== 'oeuvre' && this.selectedElementType !== 'artiste') return;

    this.graph.forEachNode((node, attributes) => {
      const nodeAttrs = attributes as NodeAttributes;
      if (nodeAttrs.nodeData === this.selectedElement) {
        const nodeType = nodeAttrs.nodeType;
        const color = nodeType === 'artiste' ? '#60a5fa' : '#8b5cf6';
        this.graph.setNodeAttribute(node, 'color', color);
      }
    });
  }

  private restoreEdgeColors() {
    if (this.selectedElementType !== 'relation') return;

    this.graph.forEachEdge((edge, attributes) => {
      const edgeAttrs = attributes as EdgeAttributes;
      const selectedElement = this.selectedElement as SelectedElement;
      if (edgeAttrs.sourceId === selectedElement?.sourceId && 
          edgeAttrs.targetId === selectedElement?.targetId) {
        this.graph.setEdgeAttribute(edge, 'color', '#ef4444');
        this.graph.setEdgeAttribute(edge, 'size', 3);
      }
    });
  }

  private resetSelectionState() {
    this.selectedElement = null;
    this.selectedElementType = null;
    this.showCrudPanel = false;
  }

  exportGraph() {
    const json = this.graph.export();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'graphe.json';
    a.click();
  }

  editGraph() {
    this.router.navigate(['/edition']);
  }
}
