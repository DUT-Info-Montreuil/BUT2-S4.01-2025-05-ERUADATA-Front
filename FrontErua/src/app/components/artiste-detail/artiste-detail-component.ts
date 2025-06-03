import {Component, OnInit} from '@angular/core';
import {Artiste} from "../../models/artiste";
import {ArtisteService} from "../../services/artiste-service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-artiste-detail',
    standalone: true,
    imports: [
    ],
    templateUrl: './artiste-detail-component.html',
    styleUrl: './artiste-detail-component.scss'
})
export class ArtisteDetailComponent implements OnInit {
    artiste!: Artiste;

    constructor(
        private readonly artisteService: ArtisteService,
        private readonly route: ActivatedRoute) {
    }

    /**
     * Initialise le composant ArtisteDetailComponent.
     */
    async ngOnInit(): Promise<void> {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        console.log('Artiste ID from route:', id);
        if (id) {
            await this.artisteService.getArtisteById(id).then((response) => {
                this.artiste = response.data
                console.log('Artiste details:', this.artiste);

            })

        } else {
            console.error('Invalid artiste ID');
        }
    }


    redirectToGenalogie() {

    }

    redirectToEditerRelation() {

    }
}
