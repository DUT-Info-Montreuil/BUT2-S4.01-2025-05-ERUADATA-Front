import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Artiste} from "../../../models/artiste";
import { ArtisteService } from '../../../services/artiste-service';

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
    imageSrc: string | undefined;

    constructor(private artisteService: ArtisteService) {}

    ngOnInit() {
        if (this.artiste && this.artiste.id) {
            this.artisteService.getArtisteImage(this.artiste.id).subscribe({
                next: (blob) => {
                    this.imageSrc = URL.createObjectURL(blob);
                },
                error: () => {
                    this.imageSrc = 'assets/images/default-artiste.png';
                }
            });
        } else {
            this.imageSrc = 'assets/images/default-artiste.png';
        }
    }
}
