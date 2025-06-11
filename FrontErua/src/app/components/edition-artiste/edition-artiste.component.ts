import {Component, inject, OnInit} from '@angular/core';
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {Artiste} from "../../models/artiste";
import {ArtisteService} from "../../services/artiste-service";
import {Subscription} from "rxjs";
import {MatSelect} from "@angular/material/select";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog";


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
    MatSelect,

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

  constructor(private router: Router, private dialogRef: MatDialogRef<EditionArtisteComponent>) {
        this.artisteSearchCtrl = new FormControl('');
    }

  ngOnInit() {
    this.subscription = this.artisteService.getArtistes().subscribe((data) => {
      if (data) {
        this.filteredArtistes = data.data;
      } else {
        console.error('Aucun artiste trouvé');
      }
    });
  }
  onArtisteSelected(value: Artiste) {
    if (value) {
      this.artisteSearchCtrl.setValue(value.nom);
      this.editForm.patchValue({
        nom: value.nom,
        prenom: value.prenom,
        naissance: value.naissance,
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
    try {
      this.artisteService.updateArtiste(this.idArtiste, updatedArtiste).subscribe({
        complete: () => {
          console.log('Artiste mis à jour avec succès');
          this.dialogRef.close();
          this.router.navigate(['/artisteList/' + this.idArtiste]);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'artiste:', error);
    }
  }
}
