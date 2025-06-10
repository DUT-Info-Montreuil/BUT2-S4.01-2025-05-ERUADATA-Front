import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ArtisteService} from "../../services/artiste-service";
import {Subscription} from "rxjs";
import {Artiste} from "../../models/artiste";
import {RouterLink} from "@angular/router";
import {ArtisteListCardComponent} from "./artiste-list-card/artiste-list-card.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatFormFieldModule} from "@angular/material/form-field";
import {
    MatDatepickerModule,
} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";


@Component({
    selector: 'app-artiste-list',
    standalone: true,
    imports: [
        RouterLink,
        ArtisteListCardComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
    ],
    templateUrl: './artiste-list.component.html',
    styleUrl: './artiste-list.component.scss'
})
export class ArtisteListComponent implements OnInit, OnDestroy {
    artistes: Artiste[] = [];
    searchText: string = '';
    private readonly artisteService = inject(ArtisteService);
    private subscription = new Subscription();

    /**
     * Initialize les composants nécessaires pour la liste des artistes.
     */
    async ngOnInit() {
        this.subscription.add(
            await this.artisteService.getArtistes().then((data) => {
                if (data.success) {
                    this.artistes = data.data;
                } else {
                    console.error('Failed to fetch artistes', this.artistes);
                }
            }).catch(error => {
                console.error('Error fetching artistes:', error);
            })
        );
    }

    /**
     * Filtre les artistes en fonction du texte de recherche.
     */
    search() {
        this.artisteService.getArtistes().then((data) => {
            if (data.success) {
                this.artistes = data.data.filter(artiste =>
                    artiste.nom.toLowerCase().includes(this.searchText.toLowerCase())
                );
            }
        });
    }

    /**
     * Nettoie les ressources utilisées par le composant.
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


}
