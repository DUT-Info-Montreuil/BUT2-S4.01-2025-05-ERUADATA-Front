import {Routes} from '@angular/router';
import {AccueilComponent} from "./components/accueil/accueil-component";
import {ArtisteDetailComponent} from "./components/artiste-detail/artiste-detail-component";
import {ArtisteFormComponent} from "./components/artiste-form/artiste-form-component";
import {OeuvreFormComponent} from "./components/oeuvre-form/oeuvre-form-component";
import {OeuvreDetailComponent} from "./components/oeuvre-detail/oeuvre-detail-component";
import {ArtisteListComponent} from "./components/artiste-list/artiste-list.component";
import {Page404Component} from "./components/404/Page404.component";
import {EditionComponent} from "./components/edition/editioncomponent";
import {GenelogieComponent } from './components/genelogie/genelogie-component';
import {GenealogiePageComponent} from './components/genealogie-page/genealogie-page.component';

export const routes: Routes = [
    {path: '', component: AccueilComponent},
    {path: 'accueil', component: AccueilComponent},
    {path: 'oeuvreDetail', component: OeuvreDetailComponent},
    {path: 'oeuvreForm', component: OeuvreFormComponent},
    {path: 'artisteForm', component: ArtisteFormComponent},
    {path: 'artisteList', component: ArtisteListComponent},
    {path: 'artisteList/:id', component: ArtisteDetailComponent},
    {path: '404', component: Page404Component},
    {path:'edition', component: EditionComponent},
    {path: '**', redirectTo: '/404'},
    {path: 'genealogie', component: GenealogiePageComponent},
];
