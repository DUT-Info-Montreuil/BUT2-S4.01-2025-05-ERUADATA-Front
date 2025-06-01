import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  @Input() filtres: any = {}; // gestion des filtres
  @Input() recherche: string = ''; // gestion de la recherche
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

    const artistes = responseArtistes.data || [];
    const oeuvres = responseOeuvres.data || [];

    console.log('Artistes:', artistes);
    console.log('Oeuvres:', oeuvres);
    console.log('Relations:', await this.graphService.getRelationsById(58));

    for (const a of artistes) {
      const id = a.nom || a.id;
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
      const oeuvreId = o.id;
      const oeuvreLabel = `${o.nom} - ${o.date_creation}`;

      if (!this.graph.hasNode(oeuvreId)) {
        this.graph.addNode(oeuvreId, {
          label: oeuvreLabel,
          x: Math.random(),
          y: Math.random(),
          size: 10,
          color: '#8b5cf6'
        });
      }

      // 🔗 Récupération et affichage des relations pour chaque oeuvre
      /*const relations = await this.graphService.getRelationsById(o.id);
      for (const { source, cible } of relations) {
        const edgeKey = `${source}->${cible}`;
        console.log('Essai ajout edge entre', source, 'et', cible, {
          sourceExist: this.graph.hasNode(source),
          cibleExist: this.graph.hasNode(cible)
        });
        if (this.graph.hasNode(source) && this.graph.hasNode(cible) && !this.graph.hasEdge(edgeKey)) {
          this.graph.addEdgeWithKey(edgeKey, source, cible, {
            color: '#f87171',
            size: 2,
            label: 'influence'
          });
        }
      }*/

      const rawRelations = await this.graphService.getRelationsById(o.id);
      const relations = rawRelations
        .filter(r => Array.isArray(r.path) && r.path.length >= 3)
        .map(r => {
          const path = r.path;
          const sourceNode = path[0];
          const targetNode = path[path.length - 1];

          return {
            source: sourceNode.nom,
            cible: targetNode.nom
          };
        });

        for (const { source, cible } of relations) {
        console.log('Ajout arête :', source, '->', cible);

        if (this.graph.hasNode(source) && this.graph.hasNode(cible)) {
          const edgeKey = `${source}->${cible}`;
          if (!this.graph.hasEdge(edgeKey)) {
            this.graph.addEdgeWithKey(edgeKey, source, cible, {
              color: '#f87171',
              size: 2,
              type: 'arrow',
              label: 'influence'
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
