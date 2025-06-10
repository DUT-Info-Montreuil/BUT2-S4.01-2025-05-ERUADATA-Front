import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatButton} from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {Artiste} from "../../models/artiste";
import {ArtisteService} from "../../services/artiste-service";
import {Router} from "@angular/router";

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
        MatSelect
    ],
    templateUrl: './artiste-form-component.html',
    styleUrl: './artiste-form-component.scss'
})
export class ArtisteFormComponent implements OnInit {
    artiste!: Artiste;
    artisteForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
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
        });
    }

    ngOnInit(): void {
        // Initialisation du formulaire si nécessaire
        this.artisteForm.reset();
    }

    /**
     * Méthode pour soumettre le formulaire.
     * Valide le formulaire et envoie les données à l'ArtisteService.
     */
    onSubmit(): void {
        if (this.artisteForm.valid) {
            console.log('Formulaire soumis :', this.artisteForm.value);
            this.artiste = this.artisteForm.value;
            console.log('Artiste créé :', this.artiste);
            this.artisteService.addArtiste(this.artiste);
            this.router.navigate(['/artisteList']);
        }
    }
}
