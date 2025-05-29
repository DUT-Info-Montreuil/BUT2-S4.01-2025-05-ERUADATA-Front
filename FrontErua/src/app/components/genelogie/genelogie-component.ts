import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  ngOnInit() {
    this.setupGraph();
  }

  setupGraph() {
    this.graph = new Graph();

    this.graph.addNode('a', {
      label: 'Artiste 1',
      x: Math.random(),
      y: Math.random(),
      size: 10,
      color: '#8b5cf6'
    });
    this.graph.addNode('b', {
      label: 'Artiste 2',
      x: Math.random(),
      y: Math.random(),
      size: 10,
      color: '#8b5cf6'
    });
    this.graph.addNode('c', {
      label: 'Artiste 3',
      x: Math.random(),
      y: Math.random(),
      size: 10,
      color: '#8b5cf6'
    });

    this.graph.addEdgeWithKey('a-c', 'a', 'c', { color: '#aaa', size: 2, label: 'a-c' });
    this.graph.addEdgeWithKey('b-c', 'b', 'c', { color: '#aaa', size: 2, label: 'b-c' });

    this.renderer = new Sigma(this.graph, this.containerRef.nativeElement);

    // === GLISSER/DÉPLACER LES NOEUDS ===
    this.renderer.on('downNode', ({ node }) => {
      this.draggingNode = node;
      this.renderer.getCamera().disable(); // désactiver le déplacement de la vue
    });

    this.renderer.getMouseCaptor().on('mousemove', (e) => {
      if (!this.draggingNode) return;
      const pos = this.renderer.viewportToGraph({ x: e.x, y: e.y });
      this.graph.setNodeAttribute(this.draggingNode, 'x', pos.x);
      this.graph.setNodeAttribute(this.draggingNode, 'y', pos.y);
    });

    this.renderer.getMouseCaptor().on('mouseup', () => {
      this.draggingNode = null;
      this.renderer.getCamera().enable(); // réactiver le déplacement de la vue
    });

    // === CLIQUER SUR LES NOEUDS POUR CRÉER / SUPPRIMER DES LIENS ===
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

    // === CLIC SUR LE FOND POUR DÉSELECTIONNER ===
    this.renderer.on('clickStage', () => {
      if (this.selectedNode) {
        this.graph.setNodeAttribute(this.selectedNode, 'color', '#8b5cf6');
        this.selectedNode = null;
      }
    });
  }
}
