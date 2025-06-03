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
    recherche: ''
  };

  emitFiltre() {
    //this.filtreChange.emit(this.filtre);
    this.filtreChange.emit({ ...this.filtre });
  }
}
