import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {Artiste} from "../../models/artiste";
import {ArtisteService} from "../../services/artiste-service";
import {Router} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatNativeDateModule} from '@angular/material/core';

@Component({
    selector: 'app-artiste-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatButton,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatOption,
        MatSelect,
        MatIcon
    ],
    templateUrl: './artiste-form-component.html',
    styleUrl: './artiste-form-component.scss'
})
export class ArtisteFormComponent implements OnInit {
    artiste!: Artiste;
    artisteForm!: FormGroup;
    imagePreview: string | ArrayBuffer | null = null;
    imageName: string = '';

    constructor(
        private fb: FormBuilder,
        private artisteService: ArtisteService,
        private router: Router,
    ) {
        this.artisteForm = this.fb.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            description: [''],
            nationalite: ['', Validators.required],
            genre: ['', Validators.required],
            image: [null]
        });
    }

    ngOnInit(): void {
        // Initialisation du formulaire si nécessaire
        this.artisteForm.reset();
    }

    /**
     * Méthode pour gérer le changement de fichier d'image.
     * @param event L'événement de changement de fichier.
     */
    onFileSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.imageName = file.name;
            this.artisteForm.patchValue({ image: file });
            // Créer un aperçu de l'image
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Méthode pour soumettre le formulaire.
     * Valide le formulaire et envoie les données à l'ArtisteService.
     */
    onSubmit(): void {
        if (this.artisteForm.valid) {
            const formValue = this.artisteForm.value;
            const formData = new FormData();
            formData.append('nom', formValue.nom);
            formData.append('prenom', formValue.prenom);
            formData.append('description', formValue.description || '');
            formData.append('genre', formValue.genre);
            formData.append('nationalite', formValue.nationalite);
            if (this.artisteForm.get('image')?.value) {
                formData.append('image', this.artisteForm.get('image')?.value);
            }
            this.artisteService.addArtiste(formData).subscribe({
                next: () => this.router.navigate(['/artisteList']),
                error: (err) => {
                    console.error('Erreur lors de l\'ajout de l\'artiste', err);
                }
            });
        }
    }
}
