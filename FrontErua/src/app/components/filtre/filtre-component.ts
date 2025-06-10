import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtre',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filtre-component.html',
  styleUrl: './filtre-component.scss'
})
export class FiltreComponent {
  @Output() filtreChange = new EventEmitter<any>();

  filtre = {
    periode: '',
    mouvement: '',
    type: '',
    recherche: '',
    nationalite: '',
    genre: '',
    showInfluence: true, // Par défaut sélectionné
    showRelations: true  // Par défaut sélectionné
  };

  emitFiltre() {
    this.filtreChange.emit({ ...this.filtre });
  }

  toggleInfluence() {
    this.filtre.showInfluence = !this.filtre.showInfluence;
    this.emitFiltre();
  }

  toggleRelations() {
    this.filtre.showRelations = !this.filtre.showRelations;
    this.emitFiltre();
  }
}