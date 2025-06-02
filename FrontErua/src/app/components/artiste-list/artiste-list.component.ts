import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ArtisteService} from "../../services/artiste-service";
import {Subscription} from "rxjs";
import {Artiste} from "../../models/artiste";
import {RouterLink} from "@angular/router";
import {ArtisteListCardComponent} from "./artiste-list-card/artiste-list-card.component";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-artiste-list',
    standalone: true,
    imports: [
        RouterLink,
        ArtisteListCardComponent,
        FormsModule
    ],
    templateUrl: './artiste-list.component.html',
    styleUrl: './artiste-list.component.scss'
})
export class ArtisteListComponent implements OnInit, OnDestroy {
    artistes: Artiste[] = [];
    searchText: string = '';
    private readonly artisteService = inject(ArtisteService);
    private subscription = new Subscription();

    async ngOnInit() {
        this.subscription.add(
            await this.artisteService.getArtistes().then((data) => {
                if (data.success) {
                    this.artistes = data.data;
                } else {
                    console.error('Failed to fetch artistes');
                }
            }).catch(error => {
                console.error('Error fetching artistes:', error);
            })
        );
    }


    search() {
        this.artisteService.getArtistes().then((data) => {
            if (data.success) {
                this.artistes = data.data.filter(artiste =>
                    artiste.nom.toLowerCase().includes(this.searchText.toLowerCase())
                );
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


}
