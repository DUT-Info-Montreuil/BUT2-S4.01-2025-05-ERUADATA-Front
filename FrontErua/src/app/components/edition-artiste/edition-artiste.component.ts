import {Component, inject, OnInit} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {Artiste} from "../../models/artiste";
import {ArtisteService} from "../../services/artiste-service";
import {Subscription} from "rxjs";
import {MatSelect} from "@angular/material/select";
import {Router} from "@angular/router";

export class AppModule { }

@Component({
  selector: 'app-edition-artiste',
  standalone: true,
  imports: [
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    MatSelect
  ],
  templateUrl: './edition-artiste.component.html',
  styleUrl: './edition-artiste.component.scss'
})
export class EditionArtisteComponent implements OnInit {
  artisteSearchCtrl: FormControl;
  idArtiste!: Number;
  editForm: FormGroup = new FormGroup({
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    naissance: new FormControl('', Validators.required),
    description: new FormControl(''),
    genre: new FormControl('', Validators.required),
    nationalite: new FormControl('', Validators.required),

  });
  filteredArtistes: Artiste[] = [];
  private readonly artisteService = inject(ArtisteService);
  private subscription = new Subscription();

    constructor(private router: Router) {
        this.artisteSearchCtrl = new FormControl('');
    }

  async ngOnInit() {
    this.subscription.add(
        await this.artisteService.getArtistes().then((data) => {
          if (data.success) {
            this.filteredArtistes = data.data;
          } else {
            console.error('Failed to fetch artistes', this.filteredArtistes);
          }
        }).catch(error => {
          console.error('Error fetching artistes:', error);
        })
    );
  }
  onArtisteSelected(value: Artiste) {
    if (value) {
      this.artisteSearchCtrl.setValue(value.nom);
      this.editForm.patchValue({
        nom: value.nom,
        prenom: value.prenom,
        naissance: value.anneeNaissance,
        description: value.description,
        genre: value.genre,
        nationalite: value.nationalite,
      });
        this.idArtiste = value.id;
        console.log('Artiste id sélectionné:', this.idArtiste);
    } else {
      this.artisteSearchCtrl.setValue('');
      this.editForm.reset();
    }
  }

  onSave() {
    const updatedArtiste = this.editForm.value;
    // Ajoutez ici la logique pour sauvegarder les modifications (appel service, etc.)
    this.artisteService.updateArtiste(this.idArtiste, updatedArtiste);
    this.router.navigate(['/artisteList']);
  }
}
