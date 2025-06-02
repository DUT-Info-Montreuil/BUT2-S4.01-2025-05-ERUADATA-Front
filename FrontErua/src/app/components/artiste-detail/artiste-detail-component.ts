import {Component, OnInit} from '@angular/core';
import {Artiste} from "../../models/artiste";
import {ArtisteService} from "../../services/artiste-service";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-artiste-detail',
    standalone: true,
    imports: [
        AsyncPipe
    ],
    templateUrl: './artiste-detail-component.html',
    styleUrl: './artiste-detail-component.scss'
})
export class ArtisteDetailComponent implements OnInit {
    artiste$?: Observable<Artiste>;

    constructor(
        private readonly artisteService: ArtisteService,
        private readonly route: ActivatedRoute) {
    }


    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.artiste$ = this.artisteService.getArtisteById(id);
        } else {
            console.error('Invalid artiste ID');
        }
    }


    redirectToGenalogie() {

    }

    redirectToEditerRelation() {

    }
}
