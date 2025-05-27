import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Sidebarcomponent} from "./components/sidebar/sidebarcomponent";
import {HeaderComponent} from "./layout/header/header.component";
import {OeuvreDetailComponent} from "./components/oeuvre-detail/oeuvre-detail-component";
import {ArtisteDetailComponent} from "./components/artiste-detail/artiste-detail-component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebarcomponent, HeaderComponent, OeuvreDetailComponent, ArtisteDetailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FrontErua';
}
