import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
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
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        MatDialogClose,
        MatOption,
        MatSelect
    ],
    templateUrl: './artiste-form-component.html',
    styleUrl: './artiste-form-component.scss'
})
export class ArtisteFormComponent implements OnInit {
    artiste!: Artiste;
    artisteForm!: FormGroup;
   @ViewChild('uploadDialog') uploadDialog!: TemplateRef<any>;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private artisteService: ArtisteService
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
    }


    onSubmit(): void {
        if (this.artisteForm.valid) {
            console.log('Formulaire soumis :', this.artisteForm.value);
            this.artiste = this.artisteForm.value;
            console.log('Artiste créé :', this.artiste);
            this.artisteService.addArtiste(this.artiste)
        }
    }

    openUploadDialog(): void {
        this.dialog.open(this.uploadDialog);
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            console.log('Fichier sélectionné:', file);
            // Ajouter ici la logique pour traiter le fichier
        }
    }

    uploadFile() {

    }
}
