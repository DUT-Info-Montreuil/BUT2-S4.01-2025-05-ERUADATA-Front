import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {EditionArtisteComponent} from "../edition-artiste/edition-artiste.component";
import {GraphDataService} from '../../services/graph-data.service';
import {Artiste} from '../../models/artiste';
import {InfluenceRelation, Oeuvre} from '../../models/oeuvre';
import {FormsModule} from "@angular/forms";
import {RelationService} from "../../services/relation-service";
import {ArtisteService} from "../../services/artiste-service";
import {OeuvreService} from "../../services/oeuvre-service";
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {EditionOeuvreComponent} from "../edition-oeuvre/edition_oeuvre.component";

@Component({
    selector: 'app-edition',
    standalone: true,
  imports: [FormsModule, CommonModule],
    templateUrl: './editioncomponent.html',
    styleUrl: './editioncomponent.scss'
})
export class EditionComponent implements OnInit {
  constructor(
    private relationService: RelationService,
    private artisteService: ArtisteService,
    private oeuvreService: OeuvreService,
    private graphDataService: GraphDataService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  showRelationForm = false;
  relationType: 'oeuvreArtiste' | 'influenceOeuvre' = 'oeuvreArtiste';
  artisteId?: number;
  oeuvreId?: number;
  sourceOeuvreId?: number;
  cibleOeuvreId?: number;
  relationSuccess = false;
  relationError = false;
  deleteSuccess = false;
  deleteError = false;
  artisteNom?: string;
  oeuvreNom?: string;
  sourceOeuvreNom?: string;
  cibleOeuvreNom?: string;

  artistes: Artiste[] = [];
  oeuvres: Oeuvre[] = [];

  showModal = false;
  modalAction: 'create' | 'delete' | null = null;

  relationsCreation: { artisteId: number, oeuvreId: number }[] = [];
  relationsInfluence: { sourceId: number, cibleId: number }[] = [];
  filteredOeuvresForArtiste: Oeuvre[] = [];
  filteredArtistesForOeuvre: Artiste[] = [];
  filteredCibleOeuvres: Oeuvre[] = [];

  artistesShowcase: Artiste[] = [];
  oeuvresShowcase: Oeuvre[] = [];

  carouselIndex = 0;

  get visibleShowcase() {
    const all = [...this.artistesShowcase, ...this.oeuvresShowcase];
    return all.slice(this.carouselIndex, this.carouselIndex + 4);
  }

  carouselPrev() {
    if (this.carouselIndex > 0) this.carouselIndex--;
  }

  carouselNext() {
    const max = this.artistesShowcase.length + this.oeuvresShowcase.length - 4;
    if (this.carouselIndex < max) this.carouselIndex++;
  }

  onShowcaseClick(item: any) {
    if ('prenom' in item) {
      this.router.navigate(['/artisteList', item.id]);
    } else {
      this.router.navigate(['/oeuvreList', item.id], {queryParams: {id: item.id}});
    }
  }

  ngOnInit() {
    this.artisteService.getArtistes().subscribe(artistesRes => {
      if (artistesRes && artistesRes.data) {
        this.artistes = artistesRes.data;
        this.artistesShowcase = this.getRandomItems(this.artistes, 4);
      }
    });
    this.oeuvreService.getOeuvres().subscribe(oeuvresRes => {
      if (oeuvresRes && oeuvresRes.data) {
        this.oeuvres = oeuvresRes.data;
        this.oeuvresShowcase = this.getRandomItems(this.oeuvres, 4);
      }
    });
    this.graphDataService.getAllCreationRelations().subscribe(allRelations => {
      if (allRelations) {
        this.relationsCreation = allRelations.flat().map((rel: {artiste: Artiste, oeuvre: Oeuvre}) => ({
          artisteId: rel.artiste.id,
          oeuvreId: rel.oeuvre.id
        }));
      }
    });
  }

  getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }

  onArtisteDeleteChange() {
    const artiste = this.artistes.find(a => a.nom === this.artisteNom);
    if (artiste) {
      this.relationService.getOeuvresByArtiste(artiste.id).subscribe((oeuvres: Oeuvre[]) => {
        this.filteredOeuvresForArtiste = this.oeuvres.filter(o => oeuvres.some((oo: Oeuvre) => oo.id === o.id));
      });
    } else {
      this.filteredOeuvresForArtiste = [];
    }
  }

  onSourceOeuvreDeleteChange() {
    const source = this.oeuvres.find(o => o.nom === this.sourceOeuvreNom);
    if (source) {
      this.relationService.getInfluencesByOeuvre(source.id).subscribe((influences: InfluenceRelation[]) => {
        this.filteredCibleOeuvres = this.oeuvres.filter(o => influences.some((inf: InfluenceRelation) => inf.path?.[1]?.id === o.id));
      });
    } else {
      this.filteredCibleOeuvres = [];
    }
  }

  createOeuvreArtisteRelation(artisteId: number, oeuvreId: number) {
    this.relationService.createCreationRelation(artisteId, oeuvreId).subscribe({
      next: () => {
      },
      error: () => {
      }
    });
  }

  createInfluenceRelation(sourceOeuvreId: number, cibleOeuvreId: number) {
    this.relationService.createInfluenceRelation(sourceOeuvreId, cibleOeuvreId).subscribe({
      next: () => {
      },
      error: () => {
      }
    });
  }

  onSubmitRelation() {
    this.relationSuccess = false;
    this.relationError = false;
    if (this.relationType === 'oeuvreArtiste' && this.artisteNom && this.oeuvreNom) {
      const artiste = this.artistes.find(a => a.nom === this.artisteNom);
      const oeuvre = this.oeuvres.find(o => o.nom === this.oeuvreNom);
      if (artiste && oeuvre) {
        this.createOeuvreArtisteRelation(artiste.id, oeuvre.id);
        this.relationSuccess = true;
      } else {
        this.relationError = true;
      }
    } else if (this.relationType === 'influenceOeuvre' && this.sourceOeuvreNom && this.cibleOeuvreNom) {
      const source = this.oeuvres.find(o => o.nom === this.sourceOeuvreNom);
      const cible = this.oeuvres.find(o => o.nom === this.cibleOeuvreNom);
      if (source && cible) {
        this.createInfluenceRelation(source.id, cible.id);
        this.relationSuccess = true;
      } else {
        this.relationError = true;
      }
    } else {
      this.relationError = true;
    }
  }

  onDeleteRelation() {
    this.deleteSuccess = false;
    this.deleteError = false;
    if (this.relationType === 'oeuvreArtiste' && this.artisteNom && this.oeuvreNom) {
      const artiste = this.artistes.find(a => a.nom === this.artisteNom);
      const oeuvre = this.oeuvres.find(o => o.nom === this.oeuvreNom);
      if (artiste && oeuvre) {
        this.relationService.deleteCreationRelation(artiste.id, oeuvre.id).subscribe({
          next: () => { this.deleteSuccess = true; },
          error: () => { this.deleteError = true; }
        });
      } else {
        this.deleteError = true;
      }
    } else if (this.relationType === 'influenceOeuvre' && this.sourceOeuvreNom && this.cibleOeuvreNom) {
      const source = this.oeuvres.find(o => o.nom === this.sourceOeuvreNom);
      const cible = this.oeuvres.find(o => o.nom === this.cibleOeuvreNom);
      if (source && cible) {
        this.relationService.deleteInfluenceRelation(source.id, cible.id).subscribe({
          next: () => { this.deleteSuccess = true; },
          error: () => { this.deleteError = true; }
        });
      } else {
        this.deleteError = true;
      }
    } else {
      this.deleteError = true;
    }
  }

  onEditArtiste() {
    const editionRef = this.dialog.open(EditionArtisteComponent, {
      width: '600px',
      data: {
      }
    });

    editionRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Edition dialog closed with result:', result);
      }
    });
  }

  onEditOeuvre() {
    const editionRef = this.dialog.open(EditionOeuvreComponent, {
      width: '600px',
      data: {}
    });

    editionRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Edition dialog closed with result:', result);
      }
    });
  }


  onGererRelations() {
    this.showModal = true;
    this.modalAction = null;
  }

  onVoirRelations() {
    this.router.navigate(['/genealogie']);
  }

  closeModal() {
    this.showModal = false;
    this.modalAction = null;
  }

  chooseAction(action: 'create' | 'delete') {
    this.modalAction = action;
  }

  relationExists(): boolean {
    if (this.relationType === 'oeuvreArtiste' && this.artisteNom && this.oeuvreNom) {
      const artiste = this.artistes.find(a => a.nom === this.artisteNom);
      const oeuvre = this.oeuvres.find(o => o.nom === this.oeuvreNom);
      return !!this.relationsCreation.find(r => r.artisteId === artiste?.id && r.oeuvreId === oeuvre?.id);
    }
    if (this.relationType === 'influenceOeuvre' && this.sourceOeuvreNom && this.cibleOeuvreNom) {
      const source = this.oeuvres.find(o => o.nom === this.sourceOeuvreNom);
      const cible = this.oeuvres.find(o => o.nom === this.cibleOeuvreNom);
      return !!this.relationsInfluence.find(r => r.sourceId === source?.id && r.cibleId === cible?.id);
    }
    return false;
  }
}
