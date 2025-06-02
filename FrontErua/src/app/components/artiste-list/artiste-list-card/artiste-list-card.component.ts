import {Component, Input} from '@angular/core';
import {Artiste} from "../../../models/artiste";

@Component({
    selector: 'app-artiste-list-card',
    standalone: true,
    imports: [],
    templateUrl: './artiste-list-card.component.html',
    styleUrl: './artiste-list-card.component.scss'
})
export class ArtisteListCardComponent {
    @Input() artiste!: Artiste;


}
