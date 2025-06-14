import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {OeuvreService} from '../../services/oeuvre-service';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Subscription} from "rxjs";
import {MatDialogRef} from "@angular/material/dialog";
import {Oeuvre} from "../../models/oeuvre";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";

@Component({
    selector: 'app-edition-oeuvre',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatAutocomplete, MatAutocompleteTrigger, MatFormField, MatInput, MatLabel, MatOption, MatButton, MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatSuffix],
    templateUrl: './edition-oeuvre.component.html',
    styleUrls: ['./edition_oeuvre.component.scss']
})
export class EditionOeuvreComponent implements OnInit {
    /*
    oeuvreForm: FormGroup = this.fb.group({
        nom: [''],
        date_creation: [''],
        dimensions: [''],
        description: [''],
        type: [''],
        mouvement: ['']
    });
     */
    oeuvreSearchCtrl: FormControl;
    idOeuvre!: number;
    editForm: FormGroup = new FormGroup({
        nom: new FormControl('', Validators.required),
        date_creation: new FormControl('', Validators.required),
        dimensions: new FormControl('', Validators.required),
        description: new FormControl(''),
        type: new FormControl('', Validators.required),
        mouvement: new FormControl('', Validators.required),
        image: new FormControl('')
    });
    filteredOeuvre: Oeuvre[] = [];
    private readonly oeuvreService = inject(OeuvreService);
    private subscription = new Subscription();

    /*
        ngOnInit(): void {
            this.id = Number(this.route.snapshot.paramMap.get('id'));

            this.oeuvreService.getOeuvreDetailById(this.id).subscribe({
                next: (oeuvre) => {
                    if (!oeuvre) {
                        this.oeuvreNotFound = true;
                        return;
                    }

                    this.oeuvreForm.patchValue({
                        nom: oeuvre.nom,
                        date_creation: oeuvre.date_creation,
                        dimensions: oeuvre.dimensions,
                        description: oeuvre.description,
                        type: oeuvre.type,
                        mouvement: oeuvre.mouvement
                    });
                },
                error: (err: any) => {
                    console.error('Erreur chargement oeuvre', err);
                    this.oeuvreNotFound = true;
                }
            });
        }

        onSubmit(): void {
            if (this.oeuvreForm.invalid) return;

            const updatedData = this.oeuvreForm.value;

            this.oeuvreService.updateOeuvre(this.id, updatedData).subscribe({
                next: () => {
                    console.log('Modification réussie ✅');
                    this.router.navigate(['/oeuvres']);
                },
                error: (err) => {
                    console.error('Erreur de modification ❌', err);
                }
            });
        }
        */

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
            });
            this.idOeuvre = value.id;
        } else {
            this.oeuvreSearchCtrl.setValue('');
            this.editForm.reset();
        }
    }

    /*
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
    */
    onSave() {
        const updatedOeuvre = this.editForm.value;
        try {
            // D'abord mettre à jour les informations de l'artiste
            this.oeuvreService.updateOeuvre(this.idOeuvre, updatedOeuvre).subscribe({
                next: () => {
                    this.dialogRef.close();
                    console.log('Modification:', updatedOeuvre);
                    this.router.navigate(['/oeuvreList' + `/${this.idOeuvre}`]);
                }
            });
        } catch (error) {
            this.dialogRef.close();
            this.router.navigate(['/oeuvreList' + `/${this.idOeuvre}`]);
        }
    }
}
