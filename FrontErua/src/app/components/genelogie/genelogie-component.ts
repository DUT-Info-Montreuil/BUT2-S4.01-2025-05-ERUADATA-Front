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

  constructor(private graphService: GraphDataService) {}

  async ngOnInit() {
    await this.setupGraph();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['filtres'] && this.graph) {
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

    const relations = await this.graphService.getRelationsById(1); // utiliser un ID statique ou dynamiquement en fonction du contexte
    const responseArtistes = await this.graphService.getArtistes();
    const responseOeuvres = await this.graphService.getOeuvres();

    const artistes = responseArtistes.data || [];
    const oeuvres = responseOeuvres.data || [];

    const { type, mouvement, periode, nationalite, Genre, recherche } = this.filtres;

    // Affichage des artistes
    for (const a of artistes) {
      if (type === 'oeuvres') continue;
      const nom = a.nom || a.id;

      if (recherche && !nom.toLowerCase().includes(recherche.toLowerCase())) continue;
      if (nationalite && (!a.nationalite || a.nationalite.toLowerCase() !== nationalite.toLowerCase())) continue;

      this.graph.addNode(nom, {
        label: nom,
        x: Math.random() * 100 - 150, // Position horizontale aléatoire pour éviter les chevauchements
        y: Math.random() * 100 + 100, // Position aléatoire pour éviter les chevauchements
        size: 10,
        color: '#60a5fa'
      });
    }
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

        if (type === 'artistes') continue;
        if (recherche && !oeuvre.nom.toLowerCase().includes(recherche.toLowerCase())) continue;
        if (mouvement && oeuvre.mouvement !== mouvement) continue;
        if (periode) {
          const year = oeuvre.date_creation;
          if (
            (periode === '1800&1900' && (year < 1800 || year > 1900)) ||
            (periode === '1900&2000' && (year < 1900 || year > 2000)) ||
            (periode === 'Apres2000' && year <= 2000)
          ) continue;
        }


        if (!this.graph.hasNode(nodeId)) {
          const y = level * yStep;
          const x = (levelMap.get(level) || 0) * xStep;
          levelMap.set(level, (levelMap.get(level) || 0) + 1);

          this.graph.addNode(nodeId, {
            label: `${oeuvre.nom} - ${oeuvre.date_creation}`,
            x,
            y,
            size: 10,
            color: '#8b5cf6'
          });
        }

        if (i > 0) {
          const sourceId = path[i - 1].id;
          const targetId = oeuvre.id;
          const edgeKey = `${sourceId}->${targetId}`;

          if (!this.graph.hasEdge(edgeKey)) {
            this.graph.addEdgeWithKey(edgeKey, sourceId, targetId, {
              color: '#ef4444',
              size: 3,
              label: direction,
              type: 'arrow'
            });
          }
        }
      }
    }

    this.renderer.refresh();
    this.renderer.getCamera().setState({ x: 0, y: 0, ratio: 1, angle: 0 });
    this.renderer.getCamera().enable();
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
      if (!this.selectedNode) {
        this.selectedNode = node;
        this.graph.setNodeAttribute(node, 'color', '#f59e42');
      } else if (this.selectedNode !== node) {
        const edgeKey1 = `${this.selectedNode}-${node}`;
        const edgeKey2 = `${node}-${this.selectedNode}`;
        if (this.graph.hasEdge(edgeKey1)) {
          this.graph.dropEdge(edgeKey1);
        } else if (this.graph.hasEdge(edgeKey2)) {
          this.graph.dropEdge(edgeKey2);
        } else {
          this.graph.addEdgeWithKey(edgeKey1, this.selectedNode, node, {
            color: '#aaa',
            size: 2,
            label: edgeKey1,
          });
        }
        this.graph.setNodeAttribute(this.selectedNode, 'color', '#8b5cf6');
        this.selectedNode = null;
      } else {
        this.graph.setNodeAttribute(this.selectedNode, 'color', '#8b5cf6');
        this.selectedNode = null;
      }
    });

    this.renderer.on('clickStage', () => {
      if (this.selectedNode) {
        this.graph.setNodeAttribute(this.selectedNode, 'color', '#8b5cf6');
        this.selectedNode = null;
      }
    });
  }

  exportGraph() {
    const json = this.graph.export();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'graphe.json';
    a.click();
  }

  importGraph(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        this.graph.clear();
        this.graph.import(json);
        this.renderer.refresh();
      } catch (e) {
        alert('Fichier invalide ou erreur d’importation.');
        console.error(e);
      }
    };

    reader.readAsText(file);
  }
}
