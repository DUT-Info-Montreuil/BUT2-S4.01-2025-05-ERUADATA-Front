import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {OeuvreService} from '../../services/oeuvre-service';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Subscription} from "rxjs";
import {MatDialogRef} from "@angular/material/dialog";
import {Oeuvre} from "../../models/oeuvre";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";


@Component({
    selector: 'app-edition-oeuvre',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatAutocomplete, MatAutocompleteTrigger, MatFormField, MatInput, MatLabel, MatOption, MatButton, MatError, MatIcon, MatIconButton],
    templateUrl: './edition-oeuvre.component.html',
    styleUrls: ['./edition_oeuvre.component.scss']
})
export class EditionOeuvreComponent implements OnInit {
    oeuvreSearchCtrl: FormControl;
    idOeuvre!: number;
    editForm: FormGroup = new FormGroup({
        nom: new FormControl('', Validators.required),
        date_creation: new FormControl('', Validators.required),
        dimensions: new FormControl('', Validators.required),
        description: new FormControl(''),
        type: new FormControl('', Validators.required),
        image: new FormControl('')
    });
    filteredOeuvre: Oeuvre[] = [];
    private readonly oeuvreService = inject(OeuvreService);
    private subscription = new Subscription();
    imagePreview: string | ArrayBuffer | null = null;
    imageName: string = '';


    constructor(private router: Router, private dialogRef: MatDialogRef<EditionOeuvreComponent>) {
        this.oeuvreSearchCtrl = new FormControl('');
    }

    ngOnInit() {
        this.subscription = this.oeuvreService.getOeuvres().subscribe((data) => {
            if (data) {
                this.filteredOeuvre = data.data;
            }
        });
    }

    onOeuvreSelected(value: Oeuvre) {
        if (value) {
            this.oeuvreSearchCtrl.setValue(value.nom);
            this.editForm.patchValue({
                nom: value.nom,
                date_creation: value.date_creation,
                dimensions: value.dimensions,
                description: value.description,
                type: value.type,
                image: value.image || '',
            });
            this.idOeuvre = value.id;
        } else {
            this.oeuvreSearchCtrl.setValue('');
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
        const updatedOeuvre = this.editForm.value;
        const formaData = new FormData();
        formaData.append('nom', updatedOeuvre.nom);
        formaData.append('date_creation', updatedOeuvre.date_creation);
        formaData.append('dimensions', updatedOeuvre.dimensions);
        formaData.append('description', updatedOeuvre.description);
        formaData.append('type', updatedOeuvre.type);
        if (updatedOeuvre.image) {
            formaData.append('image', updatedOeuvre.image);
        }

        this.oeuvreService.updateOeuvre(this.idOeuvre, formaData).subscribe({
            complete: () => {
                this.dialogRef.close();
                console.log('Modification:', formaData);
                this.router.navigate(['/oeuvreList' + `/${this.idOeuvre}`]);
            }
        });

        this.dialogRef.close();
        this.router.navigate(['/oeuvreList' + `/${this.idOeuvre}`]);

    }

}
