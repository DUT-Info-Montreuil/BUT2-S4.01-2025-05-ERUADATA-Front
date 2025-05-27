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
export class GenelogieComponent {
 @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  ngOnInit() {
    // Exemple de graphe simple
    const graph = new Graph();
    graph.addNode('a', { label: 'Artiste 1', x: 0, y: 0, size: 10, color: '#8b5cf6' });
    graph.addNode('b', { label: 'Artiste 2', x: 1, y: 1, size: 10, color: '#a78bfa' });
    graph.addNode('c', { label: 'Artiste 3', x: 2, y: 0, size: 10, color: '#c4b5fd' });
    graph.addEdge('a', 'b');
    graph.addEdge('b', 'c');

    new Sigma(graph, this.containerRef.nativeElement);
  }
}
