import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerModule,
    MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {Artiste} from "../../models/artiste";
import {ArtisteService} from "../../services/artiste-service";
import {Router} from "@angular/router";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-artiste-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDatepicker,
        MatButton,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
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
            naissance: ['', Validators.required],
            description: [''],
            nationalite: ['', Validators.required],
            genre: ['', Validators.required],
            // Champ pour l'image, si nécessaire
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
            // Ajouter le fichier au formulaire
            this.artisteForm.patchValue({image: file});

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
            this.artiste = this.artisteForm.value;
            this.artisteService.addArtiste(this.artiste);
            this.router.navigate(['/artisteList']);
        }
    }
}
