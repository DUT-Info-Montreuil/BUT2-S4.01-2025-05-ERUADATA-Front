import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebarcomponent.html',
  styleUrl: './sidebarcomponent.scss'
})
export class Sidebarcomponent {
  activeItem: string = 'accueil';

  setActive(item: string): void {
    this.activeItem = item;
  }
}
