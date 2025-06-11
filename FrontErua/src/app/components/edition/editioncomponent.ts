import {Component, OnInit} from '@angular/core';
import {RelationService} from '../../services/relation-service';
import {FormsModule} from '@angular/forms';
import {ArtisteService} from '../../services/artiste-service';
import {OeuvreService} from '../../services/oeuvre-service';
import {Artiste} from '../../models/artiste';
import {Oeuvre} from '../../models/oeuvre';
import {GraphDataService} from '../../services/graph-data.service';

@Component({
    selector: 'app-edition',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './editioncomponent.html',
    styleUrl: './editioncomponent.scss'
})
export class EditionComponent implements OnInit {
  constructor(
    private relationService: RelationService,
    private artisteService: ArtisteService,
    private oeuvreService: OeuvreService,
    private graphDataService: GraphDataService
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

  async ngOnInit() {
    const artistesRes = await this.artisteService.getArtistes();
    if (artistesRes.success) this.artistes = artistesRes.data;
    const oeuvresRes = await this.oeuvreService.getOeuvres();
    if (oeuvresRes.success) this.oeuvres = oeuvresRes.data;
    // Récupérer toutes les relations existantes
    this.graphDataService.getAllCreationRelations().subscribe(allRelations => {
      if (allRelations) {
        this.relationsCreation = allRelations.flat().map((rel: any) => ({
          artisteId: rel.artiste.id,
          oeuvreId: rel.oeuvre.id
        }));
      }
    });
    // TODO: Récupérer aussi les relations d'influence si besoin
  }

  // Créer une relation Oeuvre & Artiste
  async createOeuvreArtisteRelation(artisteId: number, oeuvreId: number) {
    try {
      await this.relationService.createCreationRelation(artisteId, oeuvreId);
      // Ajoute ici la logique de feedback utilisateur ou de rafraîchissement
    } catch (e) {
      // Gestion d'erreur
    }
  }

  // Créer une relation d'influence directe entre oeuvres
  async createInfluenceRelation(sourceOeuvreId: number, cibleOeuvreId: number) {
    try {
      await this.relationService.createInfluenceRelation(sourceOeuvreId, cibleOeuvreId);
      // Ajoute ici la logique de feedback utilisateur ou de rafraîchissement
    } catch (e) {
      // Gestion d'erreur
    }
  }

  onGererRelations() {
    this.showModal = true;
    this.modalAction = null;
  }

  closeModal() {
    this.showModal = false;
    this.modalAction = null;
  }

  chooseAction(action: 'create' | 'delete') {
    this.modalAction = action;
  }

  async onSubmitRelation() {
    this.relationSuccess = false;
    this.relationError = false;
    try {
      if (this.relationType === 'oeuvreArtiste' && this.artisteNom && this.oeuvreNom) {
        const artiste = this.artistes.find(a => a.nom === this.artisteNom);
        const oeuvre = this.oeuvres.find(o => o.nom === this.oeuvreNom);
        if (artiste && oeuvre) {
          await this.createOeuvreArtisteRelation(artiste.id, oeuvre.id);
          this.relationSuccess = true;
        } else {
          this.relationError = true;
        }
      } else if (this.relationType === 'influenceOeuvre' && this.sourceOeuvreNom && this.cibleOeuvreNom) {
        const source = this.oeuvres.find(o => o.nom === this.sourceOeuvreNom);
        const cible = this.oeuvres.find(o => o.nom === this.cibleOeuvreNom);
        if (source && cible) {
          await this.createInfluenceRelation(source.id, cible.id);
          this.relationSuccess = true;
        } else {
          this.relationError = true;
        }
      } else {
        this.relationError = true;
      }
    } catch (e) {
      this.relationError = true;
    }
  }

  async onDeleteRelation() {
    this.deleteSuccess = false;
    this.deleteError = false;
    try {
      if (this.relationType === 'oeuvreArtiste' && this.artisteNom && this.oeuvreNom) {
        const artiste = this.artistes.find(a => a.nom === this.artisteNom);
        const oeuvre = this.oeuvres.find(o => o.nom === this.oeuvreNom);
        if (artiste && oeuvre) {
          await this.relationService.deleteCreationRelation(artiste.id, oeuvre.id);
          this.deleteSuccess = true;
        } else {
          this.deleteError = true;
        }
      } else if (this.relationType === 'influenceOeuvre' && this.sourceOeuvreNom && this.cibleOeuvreNom) {
        const source = this.oeuvres.find(o => o.nom === this.sourceOeuvreNom);
        const cible = this.oeuvres.find(o => o.nom === this.cibleOeuvreNom);
        if (source && cible) {
          await this.relationService.deleteInfluenceRelation(source.id, cible.id);
          this.deleteSuccess = true;
        } else {
          this.deleteError = true;
        }
      } else {
        this.deleteError = true;
      }
    } catch (e) {
      this.deleteError = true;
    }
  }

  // Pour la suppression : filtrer les oeuvres selon l'artiste sélectionné
  async onArtisteDeleteChange() {
    const artiste = this.artistes.find(a => a.nom === this.artisteNom);
    if (artiste) {
      const oeuvres = await this.relationService.getOeuvresByArtiste(artiste.id);
      this.filteredOeuvresForArtiste = this.oeuvres.filter(o => oeuvres.some((oo: any) => (oo.o ? oo.o.id : oo.id) === o.id));
    } else {
      this.filteredOeuvresForArtiste = [];
    }
  }

  // Pour la suppression : filtrer les artistes selon l'oeuvre sélectionnée (optionnel)
  async onOeuvreDeleteChange() {
    const oeuvre = this.oeuvres.find(o => o.nom === this.oeuvreNom);
    if (oeuvre) {
      // À implémenter si besoin : filtrer les artistes ayant créé cette oeuvre
    }
  }

  // Pour la suppression d'influence : filtrer les cibles selon la source
  async onSourceOeuvreDeleteChange() {
    const source = this.oeuvres.find(o => o.nom === this.sourceOeuvreNom);
    if (source) {
      const influences = await this.relationService.getInfluencesByOeuvre(source.id);
      this.filteredCibleOeuvres = this.oeuvres.filter(o => influences.some((inf: any) => inf.path?.[1]?.id === o.id));
    } else {
      this.filteredCibleOeuvres = [];
    }
  }

  // Empêcher la création d'une relation déjà existante
  relationExists(): boolean {
    if (this.relationType === 'oeuvreArtiste' && this.artisteNom && this.oeuvreNom) {
      const artiste = this.artistes.find(a => a.nom === this.artisteNom);
      const oeuvre = this.oeuvres.find(o => o.nom === this.oeuvreNom);
      return !!this.relationsCreation.find(r => r.artisteId === artiste?.id && r.oeuvreId === oeuvre?.id);
    }
    // TODO: Ajouter la vérification pour les influences
    return false;
  }
}
