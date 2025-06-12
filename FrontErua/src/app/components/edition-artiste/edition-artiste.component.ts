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
import {MatIcon} from "@angular/material/icon";


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
    MatIcon,

  ],
  templateUrl: './edition-artiste.component.html',
  styleUrl: './edition-artiste.component.scss'
})
export class EditionArtisteComponent implements OnInit {
  artisteSearchCtrl: FormControl;
  idArtiste!: number;
  editForm: FormGroup = new FormGroup({
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    naissance: new FormControl('', Validators.required),
    description: new FormControl(''),
    genre: new FormControl('', Validators.required),
    nationalite: new FormControl('', Validators.required),
    image: new FormControl('')
  });
  filteredArtistes: Artiste[] = [];
  private readonly artisteService = inject(ArtisteService);
  private subscription = new Subscription();
  imagePreview: string | ArrayBuffer | null = null;
  imageName: string = '';

  constructor(private router: Router, private dialogRef: MatDialogRef<EditionArtisteComponent>) {
    this.artisteSearchCtrl = new FormControl('');
  }

  ngOnInit() {
    this.subscription = this.artisteService.getArtistes().subscribe((data) => {
      if (data) {
        this.filteredArtistes = data.data;
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
        image: value.image || '',
      });
        this.idArtiste = value.id;
    } else {
      this.artisteSearchCtrl.setValue('');
      this.editForm.reset();
    }
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imageName = file.name;

      // Stocker le fichier dans imageForm
      this.editForm.patchValue({image: file});

      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.imageName = '';
    this.editForm.patchValue({image: ''});
  }

  onSave() {
    const updatedArtiste = this.editForm.value;
    try {
      // D'abord mettre à jour les informations de l'artiste
      this.artisteService.updateArtiste(this.idArtiste, updatedArtiste).subscribe({
        next: () => {
          this.dialogRef.close();
          this.router.navigate(['/artisteList' + `/${this.idArtiste}`]);
        },
        error: (err) => {
          this.dialogRef.close();
          this.router.navigate(['/artisteList' + `/${this.idArtiste}`]);
        }
      });
    } catch (error) {
      this.dialogRef.close();
      this.router.navigate(['/artisteList' + `/${this.idArtiste}`]);
    }
  }
}
