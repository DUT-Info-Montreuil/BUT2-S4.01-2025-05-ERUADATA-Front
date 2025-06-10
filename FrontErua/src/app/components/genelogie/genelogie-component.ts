import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { GraphDataService } from '../../services/graph-data.service';
import Graph from 'graphology';
import Sigma from 'sigma';

@Component({
  selector: 'app-genelogie',
  standalone: true,
  imports: [],
  templateUrl: './genelogie-component.html',
  styleUrl: './genelogie-component.scss'
})
export class GenelogieComponent implements OnInit, OnChanges {
  @Input() filtres: any = {};
  @Input() recherche: string = '';
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private graph!: Graph;
  private renderer!: Sigma;
  private selectedNode: string | null = null;
  private draggingNode: string | null = null;

  // Propriétés pour le panneau d'informations
  public selectedElement: any = null;
  public selectedElementType: 'oeuvre' | 'artiste' | 'relation' | null = null;
  public showCrudPanel = false;

  constructor(private graphService: GraphDataService) {}

  async ngOnInit() {
    await this.setupGraph();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ((changes['filtres'] || changes['recherche']) && this.graph) {
      await this.loadGraphFromBackend();
    }
  }

  async setupGraph() {
    this.graph = new Graph();
    this.renderer = new Sigma(this.graph, this.containerRef.nativeElement, {
      renderEdgeLabels: true,
      labelRenderedSizeThreshold: 8,
      edgeLabelSize: 12,
      defaultEdgeType: 'arrow',
    });
    await this.loadGraphFromBackend();
    this.setupInteractions();
  }

  async loadGraphFromBackend() {
    if (!this.graph) return;
    this.graph.clear();

    // Récupérer les influences d'une œuvre spécifique (ici l'œuvre avec l'ID 1)
    const relations = await this.graphService.getInfluencesByOeuvre(1);
    const responseArtistes = await this.graphService.getArtistes();
    const responseOeuvres = await this.graphService.getOeuvres();
    const creationRelations = await this.graphService.getAllCreationRelations();

    const artistes = responseArtistes.data || [];
    const oeuvres = responseOeuvres.data || [];

    // S'assurer que les filtres existent
    const filtres = this.filtres || {};
    const { type, mouvement, periode, nationalite, genre, recherche, showInfluence, showRelations, showCreation } = filtres;
    
    // Utiliser la recherche du composant si elle n'est pas dans les filtres
    const searchTerm = recherche || this.recherche;

    console.log('Filtres appliqués:', { type, mouvement, periode, nationalite, genre, searchTerm });

    // Fonction  pour vérifier si une œuvre passe les filtres
    const oeuvrePassesFilters = (oeuvre: any): boolean => {
      // Si aucun filtre n'est appliqué, afficher toutes les œuvres
      const hasActiveFilters = (searchTerm && searchTerm.trim() !== '') ||
                              (mouvement && mouvement.trim() !== '') ||
                              (genre && genre.trim() !== '') ||
                              (periode && periode.trim() !== '');
      
      if (!hasActiveFilters) {
        return true;
      }
      
      // Filtre de recherche
      if (searchTerm && searchTerm.trim() !== '' && !oeuvre.nom.toLowerCase().includes(searchTerm.toLowerCase())) {
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
    };

    // Fonction pour vérifier si un artiste passe les filtres
    const artistePassesFilters = (artiste: any): boolean => {
      const nom = artiste.nom || artiste.id;
      // Filtre de recherche
      if (searchTerm && searchTerm.trim() !== '' && !nom.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Filtre de nationalité
      if (nationalite && nationalite.trim() !== '' && (!artiste.nationalite || artiste.nationalite.toLowerCase() !== nationalite.toLowerCase())) {
        return false;
      }
      return true;
    };

    // Si le type est "oeuvres", afficher seulement les œuvres avec relations
    if (type === 'oeuvres') {
      let xPos = 0;
      let yPos = 0;
      let yStep = 80;
      let xStep = 150;
      const maxPerRow = 4;
      let oeuvresCount = 0;


      // Collecter toutes les œuvres disponibles (depuis la liste directe et les relations)
      const toutesOeuvres = new Map();
      
      // Ajouter les œuvres de la liste directe
      for (const oeuvre of oeuvres) {
        toutesOeuvres.set(oeuvre.id, oeuvre);
      }
      
      // Ajouter les œuvres des relations d'influence
      for (const relation of relations) {
        for (const node of relation.path) {
          if (node.id) {
            toutesOeuvres.set(node.id, node);
          }
        }
      }
      
      
      const oeuvresDisponibles = Array.from(toutesOeuvres.values());
      
      
      for (const oeuvre of oeuvresDisponibles) {
        console.log(`Vérification de l'œuvre: ${oeuvre.nom}`, {
          passeFiltres: oeuvrePassesFilters(oeuvre),
          oeuvre: oeuvre
        });
        
        if (!oeuvrePassesFilters(oeuvre)) continue;

        this.graph.addNode(oeuvre.id, {
          label: `${oeuvre.nom} - ${oeuvre.date_creation}`,
          x: xPos,
          y: yPos,
          size: 12,
          color: '#8b5cf6',
          nodeType: 'oeuvre',
          nodeData: oeuvre
        });

        oeuvresCount++;
        xPos += xStep;
        if (xPos >= maxPerRow * xStep) {
          xPos = 0;
          yPos += yStep;
        }
      }

      // Traiter les relations
      let levelMap: Map<number, number> = new Map();

      for (const relation of relations) {
        const path = relation.path;
        const direction = relation.direction;

        for (let i = 0; i < path.length; i++) {
          const oeuvre = path[i];
          const nodeId = oeuvre.id;
          const level = i;

          if (!oeuvrePassesFilters(oeuvre)) continue;

          if (!this.graph.hasNode(nodeId)) {
            const y = level * yStep;
            const x = (levelMap.get(level) || 0) * xStep;
            levelMap.set(level, (levelMap.get(level) || 0) + 1);

            this.graph.addNode(nodeId, {
              label: `${oeuvre.nom} - ${oeuvre.date_creation}`,
              x,
              y,
              size: 10,
              color: '#8b5cf6',
              nodeType: 'oeuvre',
              nodeData: oeuvre
            });
          }


          // Ajouter les arêtes seulement si les deux nœuds existent ET si les filtres de relations le permettent
          if (i > 0) {
            const sourceId = path[i - 1].id;
            const targetId = oeuvre.id;
            const edgeKey = `${sourceId}->${targetId}`;

            // Vérifier que les deux nœuds existent dans le graphe
            if (this.graph.hasNode(sourceId) && this.graph.hasNode(targetId) && !this.graph.hasEdge(edgeKey)) {
              // Déterminer le type de relation
              const relationType = this.getRelationType(direction);
              
              // Vérifier si cette relation doit être affichée selon les filtres
              let shouldShow = true;
              
              if (relationType === 'influence' && showInfluence === false) {
                shouldShow = false;
              }
              
              if (relationType === 'relation' && showRelations === false) {
                shouldShow = false;
              }
              
              if (shouldShow) {
                this.graph.addEdgeWithKey(edgeKey, sourceId, targetId, {
                  color: '#ef4444',
                  size: 3,
                  label: direction,
                  type: 'arrow',
                  relationType: relationType,
                  sourceId: sourceId,
                  targetId: targetId
                });
              }
            }
          }
        }
      }
      
      console.log(`Mode œuvres seulement: ${oeuvresCount} œuvres affichées sur ${oeuvresDisponibles.length} total`);
    } else if (type === 'artistes') {
      // Affichage des artistes seulement
      let xPos = 0;
      let yPos = 0;
      const xStep = 200;
      const yStep = 150;
      const maxPerRow = 4;
      let artistesCount = 0;

      for (const a of artistes) {
        if (!artistePassesFilters(a)) continue;

        const nom = a.nom || a.id;
        this.graph.addNode(nom, {
          label: nom,
          x: xPos,
          y: yPos,
          size: 12,
          color: '#60a5fa',
          nodeType: 'artiste',
          nodeData: a
        });

        artistesCount++;
        xPos += xStep;
        if (xPos >= maxPerRow * xStep) {
          xPos = 0;
          yPos += yStep;
        }
      }
      
      console.log(`Mode artistes seulement: ${artistesCount} artistes affichés sur ${artistes.length} total`);
    } else {
      // Affichage des artistes ET des œuvres avec relations
      for (const a of artistes) {
        if (!artistePassesFilters(a)) continue;

        const nom = a.nom || a.id;
        this.graph.addNode(nom, {
          label: nom,
          x: Math.random() * 100 - 150,
          y: Math.random() * 100 + 100,
          size: 10,
          color: '#60a5fa',
          nodeType: 'artiste',
          nodeData: a
        });
      }

      // Traiter les relations
      let levelMap: Map<number, number> = new Map();
      let yStep = 80;
      let xStep = 150;

      for (const relation of relations) {
        const path = relation.path;
        const direction = relation.direction;

        for (let i = 0; i < path.length; i++) {
          const oeuvre = path[i];
          const nodeId = oeuvre.id;
          const level = i;

          if (!oeuvrePassesFilters(oeuvre)) continue;

          if (!this.graph.hasNode(nodeId)) {
            const y = level * yStep;
            const x = (levelMap.get(level) || 0) * xStep;
            levelMap.set(level, (levelMap.get(level) || 0) + 1);

            this.graph.addNode(nodeId, {
              label: `${oeuvre.nom} - ${oeuvre.date_creation}`,
              x,
              y,
              size: 10,
              color: '#8b5cf6',
              nodeType: 'oeuvre',
              nodeData: oeuvre
            });
          }


          // Ajouter les arêtes seulement si les deux nœuds existent ET si les filtres de relations le permettent
          if (i > 0) {
            const sourceId = path[i - 1].id;
            const targetId = oeuvre.id;
            const edgeKey = `${sourceId}->${targetId}`;

            // Vérifier que les deux nœuds existent dans le graphe
            if (this.graph.hasNode(sourceId) && this.graph.hasNode(targetId) && !this.graph.hasEdge(edgeKey)) {
              // Déterminer le type de relation
              const relationType = this.getRelationType(direction);
              
              // Vérifier si cette relation doit être affichée selon les filtres
              let shouldShow = true;
              
              if (relationType === 'influence' && showInfluence === false) {
                shouldShow = false;
              }
              
              if (relationType === 'relation' && showRelations === false) {
                shouldShow = false;
              }
              
              if (shouldShow) {
                this.graph.addEdgeWithKey(edgeKey, sourceId, targetId, {
                  color: '#ef4444',
                  size: 3,
                  label: direction,
                  type: 'arrow',
                  relationType: relationType,
                  sourceId: sourceId,
                  targetId: targetId
                });
              }
            }
          }
        }
      }
    }

    // Ajout des arêtes de création (bleues) dans la même logique que l'influence
    if ((type !== 'artistes' && type !== 'oeuvres') && (typeof showCreation === 'undefined' || showCreation !== false)) {
      for (const relation of creationRelations) {
        const artiste = relation.artiste;
        const oeuvre = relation.oeuvre;
        if (!artistePassesFilters(artiste) || !oeuvrePassesFilters(oeuvre)) continue;
        const artisteNom = artiste.nom || artiste.id;
        // Ajout des nœuds si besoin
        if (!this.graph.hasNode(artisteNom)) {
          this.graph.addNode(artisteNom, {
            label: artisteNom,
            x: 0,
            y: 0,
            size: 12,
            color: '#60a5fa',
            nodeType: 'artiste',
            nodeData: artiste
          });
        }
        if (!this.graph.hasNode(oeuvre.id)) {
          this.graph.addNode(oeuvre.id, {
            label: `${oeuvre.nom} - ${oeuvre.date_creation}`,
            x: 0,
            y: 0,
            size: 10,
            color: '#8b5cf6',
            nodeType: 'oeuvre',
            nodeData: oeuvre
          });
        }
        // Ajout de l'arête A_CREE
        const edgeKey = `a_cree_${artisteNom}->${oeuvre.id}`;
        if (this.graph.hasNode(artisteNom) && this.graph.hasNode(oeuvre.id) && !this.graph.hasEdge(edgeKey)) {
          this.graph.addEdgeWithKey(edgeKey, artisteNom, oeuvre.id, {
            color: '#3b82f6',
            size: 3,
            label: 'A_CREE',
            type: 'arrow',
            relationType: 'a_cree',
            sourceId: artisteNom,
            targetId: oeuvre.id
          });
        }
      }
    }

    console.log(`Graphe généré avec ${this.graph.order} nœuds et ${this.graph.size} arêtes`);
    this.renderer.refresh();
    
    // Centrer automatiquement le graphe
    setTimeout(() => {
      this.centrerGraphique();
    }, 100);
  }

  // Détermine le type de relation à partir du label/direction
  getRelationType(direction: string): string {
    if (!direction) return 'relation';
    const dir = direction.toLowerCase();
    if (dir.includes('influence') || dir.includes('descendance')) return 'influence';
    return 'relation';
  }

  setupInteractions() {
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
    const nodeAttributes = this.graph.getNodeAttributes(node);
    const nodeType = nodeAttributes['nodeType'];
    const nodeData = nodeAttributes['nodeData'];

    this.selectedElement = nodeData;
    this.selectedElementType = nodeType;
    this.showCrudPanel = true;

    // Mettre en surbrillance le nœud sélectionné
    this.graph.setNodeAttribute(node, 'color', '#f59e42');
  }

  private handleEdgeClick(edge: string) {
    const edgeAttributes = this.graph.getEdgeAttributes(edge);
    const sourceId = edgeAttributes['sourceId'];
    const targetId = edgeAttributes['targetId'];

    this.selectedElement = {
      sourceId: sourceId,
      targetId: targetId,
      edgeKey: edge,
      type: edgeAttributes['relationType']
    };
    this.selectedElementType = 'relation';
    this.showCrudPanel = true;

    // Mettre en surbrillance l'arête sélectionnée
    this.graph.setEdgeAttribute(edge, 'color', '#f59e42');
    this.graph.setEdgeAttribute(edge, 'size', 5);
  }

  public clearSelection() {
    if (this.selectedElementType === 'oeuvre' || this.selectedElementType === 'artiste') {
      // Restaurer la couleur du nœud
      this.graph.forEachNode((node, attributes) => {
        if (attributes['nodeData'] === this.selectedElement) {
          const nodeType = attributes['nodeType'];
          const color = nodeType === 'artiste' ? '#60a5fa' : '#8b5cf6';
          this.graph.setNodeAttribute(node, 'color', color);
        }
      });
    } else if (this.selectedElementType === 'relation') {
      // Restaurer la couleur de l'arête
      this.graph.forEachEdge((edge, attributes) => {
        if (attributes['sourceId'] === this.selectedElement?.sourceId && 
            attributes['targetId'] === this.selectedElement?.targetId) {
          this.graph.setEdgeAttribute(edge, 'color', '#ef4444');
          this.graph.setEdgeAttribute(edge, 'size', 3);
        }
      });
    }

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



  centrerGraphique() {
    if (this.renderer && this.graph.order > 0) {
      // Calculer les limites du graphe
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      
      this.graph.forEachNode((node, attributes) => {
        minX = Math.min(minX, attributes['x']);
        maxX = Math.max(maxX, attributes['x']);
        minY = Math.min(minY, attributes['y']);
        maxY = Math.max(maxY, attributes['y']);
      });

      // Calculer le centre et le zoom optimal
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const width = maxX - minX;
      const height = maxY - minY;
      const maxDimension = Math.max(width, height);
      
      // Ajouter une marge
      const margin = 100;
      const ratio = Math.min(
        (this.containerRef.nativeElement.clientWidth - margin) / maxDimension,
        (this.containerRef.nativeElement.clientHeight - margin) / maxDimension
      );

      this.renderer.getCamera().animate({
        x: -centerX,
        y: -centerY,
        ratio: Math.max(0.1, Math.min(2, ratio)),
        angle: 0
      }, {
        duration: 800,
        easing: 'easeInOutCubic'
      });
    }
  }
}
