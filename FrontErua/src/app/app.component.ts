import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Sidebarcomponent} from './components/sidebar/sidebarcomponent';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Sidebarcomponent, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarVisible = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
