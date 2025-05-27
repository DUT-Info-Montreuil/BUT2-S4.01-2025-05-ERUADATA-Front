import { Routes } from '@angular/router';
import {AccueilComponent} from "./components/accueil/accueil-component";
import {ArtisteDetailComponent} from "./components/artiste-detail/artiste-detail-component";
import {ArtisteFormComponent} from "./components/artiste-form/artiste-form-component";
import {OeuvreFormComponent} from "./components/oeuvre-form/oeuvre-form-component";
import {OeuvreDetailComponent} from "./components/oeuvre-detail/oeuvre-detail-component";

export const routes: Routes = [
    {path: 'oeuvreDetail' , component: OeuvreDetailComponent},
    {path: 'oeuvreForm', component: OeuvreFormComponent},
    {path: 'artisteForm', component: ArtisteFormComponent},
    {path: 'artisteDetail', component: ArtisteDetailComponent },
    {path: 'accueil', component: AccueilComponent},
    {path:'', redirectTo: 'accueil'},
    {path: '404', component: AccueilComponent},
];
