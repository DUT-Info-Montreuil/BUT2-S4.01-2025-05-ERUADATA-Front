import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OeuvreService } from '../../services/oeuvre-service';

@Component({
  selector: 'app-edition-oeuvre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edition-oeuvre.component.html',
  styleUrls: ['./edition_oeuvre.component.scss']
})
export class EditionOeuvreComponent implements OnInit {
  oeuvreForm: FormGroup = this.fb.group({
    nom: [''],
    date_creation: [''],
    dimensions: [''],
    description: [''],
    type: [''],
    mouvement: ['']
  });

  id!: number;
  oeuvreNotFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private oeuvreService: OeuvreService
  ) {}

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
      error: (err:any) => {
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
}
