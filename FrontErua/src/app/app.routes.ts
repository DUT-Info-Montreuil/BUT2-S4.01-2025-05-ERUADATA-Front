import {Routes} from '@angular/router';
import {ArtisteDetailComponent} from "./components/artiste-detail/artiste-detail-component";
import {ArtisteListComponent} from "./components/artiste-list/artiste-list.component";
import {Page404Component} from "./components/404/Page404.component";
import {EditionComponent} from "./components/edition/editioncomponent";
import {GenealogiePageComponent} from './components/genealogie-page/genealogie-page.component';
import {AccueilComponent} from './components/accueil/accueil-component';
// import { ArtisteDetailComponent } from './components/artiste-detail/artiste-detail-component';
import {ArtisteFormComponent} from './components/artiste-form/artiste-form-component';
import {OeuvreFormComponent} from './components/oeuvre-form/oeuvre-form-component';
import {OeuvreDetailComponent} from './components/oeuvre-detail/oeuvre-detail-component';
import {OeuvreListComponent} from './components/oeuvre-list/oeuvre-list.component';
import {EditionOeuvreComponent} from './components/edition-oeuvre/edition_oeuvre.component';

export const routes: Routes = [
    {path: '', redirectTo: 'accueil', pathMatch: 'full'},
    {path: 'accueil', component: AccueilComponent},
    {path: 'oeuvre/:id', component: OeuvreDetailComponent},
    {path: 'oeuvre-list', component: OeuvreListComponent},
    {path: 'oeuvreList/:id', component: OeuvreDetailComponent},
    {path: 'oeuvreForm', component: OeuvreFormComponent},
    {path: 'artisteForm', component: ArtisteFormComponent},
    {path: 'artisteList', component: ArtisteListComponent},
    {path: 'artisteList/:id', component: ArtisteDetailComponent},
    {path: '404', component: Page404Component},
    {path:'edition', component: EditionComponent},
    {path: 'editionOeuvre', component: EditionOeuvreComponent},
    {path: 'genealogie', component: GenealogiePageComponent},
    {path: 'oeuvres/edit/:id', component: EditionOeuvreComponent},
    {path: 'oeuvre-list', component: OeuvreListComponent},
    // { path: 'artisteDetail', component: ArtisteDetailComponent },
    {path: '**', redirectTo: '/404'},
];
