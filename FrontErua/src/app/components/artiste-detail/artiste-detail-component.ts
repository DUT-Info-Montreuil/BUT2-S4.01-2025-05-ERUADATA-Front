import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Artiste, ArtisteSing} from "../../models/artiste";
import {ArtisteService} from "../../services/artiste-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Oeuvre, Oeuvres} from "../../models/oeuvre";
import {Observable} from "rxjs";

@Component({
    selector: 'app-artiste-detail',
    standalone: true,
    imports: [],
    templateUrl: './artiste-detail-component.html',
    styleUrl: './artiste-detail-component.scss'
})
export class ArtisteDetailComponent implements OnInit {
    artiste$!: Observable<ArtisteSing>;
    artiste!: Artiste;
    oeuvres$!: Observable<Oeuvres>;
    oeuvres: Oeuvre[] = [];
    imageSrc: string | undefined;
    @Output() suppArtiste = new EventEmitter<number>();


    constructor(
        private readonly artisteService: ArtisteService,
        private readonly route: ActivatedRoute,
        private router: Router,
    ) {
    }

    /**
     * Initialise le composant ArtisteDetailComponent.
     */
    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.artiste$ = this.artisteService.getArtisteById(id);
            this.oeuvres$ = this.artisteService.getOeuvresByArtisteId(id);
            this.artiste$.subscribe(artiste => {
                if (artiste.data) {
                    this.artiste = artiste.data;
                    this.artisteService.getArtisteImage(id).subscribe(blob => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            this.imageSrc = reader.result as string;
                        };
                        reader.readAsDataURL(blob);
                    });
                }
            });
            this.oeuvres$.subscribe(oeuvres => {
                if (oeuvres.data) {
                    this.oeuvres = oeuvres.data;
                }
            });
        }
    }

    /**
     * Redirige vers la page de généalogie de l'artiste.
     */
    redirectToGenalogie() {

    }

    /**
     * Redirige vers la page d'édition de l'artiste.
     */
    redirectToEditerRelation() {

    }

    deleteArtiste() {
        this.artiste$.subscribe(artiste => {
            if (artiste.data.id) {
                this.artisteService.deleteArtiste(artiste.data.id).subscribe({
                    complete: () => {
                        this.router.navigate(['/artisteList']);
                    }
                });
            }
        });
    }
}
