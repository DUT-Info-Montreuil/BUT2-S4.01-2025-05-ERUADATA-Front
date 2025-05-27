import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {Artiste} from "../../models/artiste";
import {ArtisteService} from "../../services/artiste-service";

@Component({
    selector: 'app-artiste-detail',
    standalone: true,
    imports: [
        RouterLink,
        NgForOf
    ],
    templateUrl: './artiste-detail-component.html',
    styleUrl: './artiste-detail-component.scss'
})
export class ArtisteDetailComponent {
    artistes!: Artiste[];
    artiste!: Artiste | undefined;

    constructor(private artisteService: ArtisteService) {
    }

    ngOnInit(): void {
        this.artistes = this.artisteService.getAllArtistes();
        this.artiste = this.artisteService.getArtisteByName('Léonard', 'da Vinci');
    }

    redirectToGenalogie() {

    }

    redirectToEditerRelation() {

    }
}
