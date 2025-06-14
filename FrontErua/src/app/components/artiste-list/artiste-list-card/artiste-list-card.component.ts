import {Component, EventEmitter, Input, Output} from '@angular/core';
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
    @Output() suppArtiste = new EventEmitter<number>();
    @Input() imageSrc!: string | undefined;





}
