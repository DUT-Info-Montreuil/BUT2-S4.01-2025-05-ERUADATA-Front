import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class GenelogieComponent implements OnInit {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private graph!: Graph;
  private renderer!: Sigma;
  private selectedNode: string | null = null;
  private draggingNode: string | null = null;

  constructor(private graphService: GraphDataService) {}

  async ngOnInit() {
    await this.setupGraph();
  }

  async setupGraph() {
    this.graph = new Graph();
    this.renderer = new Sigma(this.graph, this.containerRef.nativeElement);
    await this.loadGraphFromBackend();
    this.setupInteractions();
  }

  async loadGraphFromBackend() {
    const responseArtistes = await this.graphService.getArtistes();
    const responseOeuvres = await this.graphService.getOeuvres();

    // Extraire le tableau data de la réponse
    
    const artistes = responseArtistes.data || [];

    const oeuvres = responseOeuvres.data || [];


    console.log('Artistes:', artistes);
    console.log('Oeuvres:', oeuvres);

    for (const a of artistes) {
      const id = a.nom || a.id || a;
      if (!this.graph.hasNode(id)) {
        this.graph.addNode(id, {
          label: id,
          x: Math.random(),
          y: Math.random(),
          size: 10,
          color: '#60a5fa'
        });
      }
    }

    for (const o of oeuvres) {
      const id =  o.id;
      if (!this.graph.hasNode(id)) {
        this.graph.addNode(id, {
          label: `${o.nom} - ${o.date_creation}`,
          x: Math.random(),
          y: Math.random(),
          size: 10,
          color: '#8b5cf6'
        });
      }

      const relations = await this.graphService.getRelations(o.id);
      for (const relation of relations) {
        // Assert the type of relation
        const rel = relation as { artiste_id: string; oeuvre_id: string };
        const artisteId = rel.artiste_id;
        const oeuvreId = rel.oeuvre_id;
        if (this.graph.hasNode(artisteId) && this.graph.hasNode(oeuvreId)) {
          const edgeKey = `${artisteId}-${oeuvreId}`;
          if (!this.graph.hasEdge(edgeKey)) {
            this.graph.addEdgeWithKey(edgeKey, artisteId, oeuvreId, {
              color: '#aaa',
              size: 2,
              label: `Influence: ${artisteId} -> ${oeuvreId}`
            });
          }
        } else {
          console.warn(`No node found for relation: ${artisteId} -> ${oeuvreId}`);
        }
      }
    }
    this.renderer.refresh();
    this.renderer.getCamera().setState({
      x: 0,
      y: 0,
      ratio: 1,
      angle: 0
    });
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
