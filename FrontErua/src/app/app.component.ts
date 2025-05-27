import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebarcomponent } from './components/sidebar/sidebarcomponent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Sidebarcomponent, HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarVisible = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
