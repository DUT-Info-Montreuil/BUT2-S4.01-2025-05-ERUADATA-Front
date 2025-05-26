import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebarcomponent } from './components/sidebar/sidebarcomponent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Sidebarcomponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FrontErua';
}
