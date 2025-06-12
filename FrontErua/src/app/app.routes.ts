import { Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil-component';
// import { ArtisteDetailComponent } from './components/artiste-detail/artiste-detail-component';
import { ArtisteFormComponent } from './components/artiste-form/artiste-form-component';
import { OeuvreFormComponent } from './components/oeuvre-form/oeuvre-form-component';
import { OeuvreDetailComponent } from './components/oeuvre-detail/oeuvre-detail-component';
import { OeuvreListComponent } from './components/oeuvre-list/oeuvre-list.component';
export const routes: Routes = [
    { path: 'oeuvre/:id', component: OeuvreDetailComponent }, 
    {path: 'oeuvre-list', component: OeuvreListComponent},
    {path: 'oeuvreList/:id', component: OeuvreDetailComponent},
    { path: 'oeuvreForm', component: OeuvreFormComponent },
    { path: 'ArtisteForm', component: ArtisteFormComponent },
    // { path: 'artisteDetail', component: ArtisteDetailComponent },
    { path: 'accueil', component: AccueilComponent },
    { path: '', redirectTo: 'accueil', pathMatch: 'full' },
    { path: '404', component: AccueilComponent }
];
