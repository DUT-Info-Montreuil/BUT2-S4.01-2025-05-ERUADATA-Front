import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebarcomponent} from "./components/sidebar/sidebarcomponent";
import {HeaderComponent} from "./layout/header/header.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, Sidebarcomponent, HeaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'FrontErua';
}
