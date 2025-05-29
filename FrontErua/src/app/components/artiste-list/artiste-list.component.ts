import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ArtisteService} from "../../services/artiste-service";
import {Subscription} from "rxjs";
import {Artiste} from "../../models/artiste";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-artiste-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './artiste-list.component.html',
  styleUrl: './artiste-list.component.scss'
})
export class ArtisteListComponent implements OnInit, OnDestroy {
  private readonly artisteService = inject(ArtisteService);
  private subscription = new Subscription();
  artistes: Artiste[] = [];

  ngOnInit() {
    this.subscription = this.artisteService.getAllArtistes().subscribe((data) => {
      console.log("Données reçues :", data); // ✅ Meilleure inspection

      // Protection si l'API retourne un objet ou undefined
      if (Array.isArray(data)) {
        this.artistes = data;
      } else {
        console.warn('⚠️ Données invalides reçues (pas un tableau)', data);
        this.artistes = []; // valeur de secours
      }
    });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

}
