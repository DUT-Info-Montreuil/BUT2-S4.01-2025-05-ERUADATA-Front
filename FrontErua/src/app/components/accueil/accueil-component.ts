import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GenelogieComponent } from "../genelogie/genelogie-component";

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink, GenelogieComponent],
  templateUrl: './accueil-component.html',
  styleUrl: './accueil-component.scss'
})
export class AccueilComponent {

}
