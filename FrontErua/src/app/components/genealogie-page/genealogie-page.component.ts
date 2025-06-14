import { Component, ViewChild } from '@angular/core';
import { FiltreComponent, FilterConfig } from '../filtre/filtre-component';
import { GenelogieComponent } from '../genelogie/genelogie-component';

@Component({
  selector: 'app-genealogie-page',
  standalone: true,
  imports: [FiltreComponent, GenelogieComponent],
  templateUrl: './genealogie-page.component.html',
  styleUrls: ['./genealogie-page.component.scss']
})
export class GenealogiePageComponent {
  @ViewChild(FiltreComponent) filtreComponent!: FiltreComponent;
  
  filtres: FilterConfig = {};

  onFiltreChange(filtre: FilterConfig) {
    this.filtres = filtre;
  }

  reinitialiserFiltres(): void {
    this.filtres = {};
    // Réinitialiser aussi le composant de filtres
    if (this.filtreComponent) {
      this.filtreComponent.filtre = {
        periode: '',
        mouvement: '',
        type: '',
        recherche: '',
        nationalite: '',
        genre: '',
        showInfluence: true,  // Par défaut sélectionné
        showRelations: true,   // Par défaut sélectionné
        showCreation: true     // Par défaut sélectionné pour les relations A_CREE
      };
    }
  }
} 
