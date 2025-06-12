import { Component, Input } from '@angular/core';
import { Oeuvre } from '../../oeuvre-detail/oeuvre';

@Component({
  selector: 'app-oeuvre-list-card',
  standalone: true,
  templateUrl: './oeuvre-list-card.component.html',
  styleUrls: ['./oeuvre-list-card.component.scss']
})
export class OeuvreListCardComponent {
  @Input() oeuvre!: Oeuvre;
}
