import { Routes } from '@angular/router';
import {AccueilComponent} from "./components/accueil/accueil-component";
import {
    ArtisteDetailComponent
} from "./components/artiste-detail/artiste-detail-component";
import {ArtisteFormComponent} from "./components/artiste-form/artiste-form-component";
import {OeuvreFormComponent} from "./components/oeuvre-form/oeuvre-form-component";
import {OeuvreDetailComponent} from "./components/oeuvre-detail/oeuvre-detail-component";
import {EditionComponent} from "./components/edition/editioncomponent";
import { GenelogieComponent } from './components/genelogie/genelogie-component';

export const routes: Routes = [
    {path: 'oeuvreDetail' , component: OeuvreDetailComponent},
    {path: 'oeuvreForm', component: OeuvreFormComponent},
    {path: 'ArtisteForm', component: ArtisteFormComponent},
    {path: 'artisteDetail', component: ArtisteDetailComponent },
    {path: 'accueil', component: AccueilComponent},
    {path:'', redirectTo: 'accueil', pathMatch: 'full'},
    {path: '404', component: AccueilComponent},
    {path:'edition', component: EditionComponent},
    {path: 'genealogie', component: GenelogieComponent},
];
