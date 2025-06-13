
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink, RouterLinkWithHref} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkWithHref],
  templateUrl: './sidebarcomponent.html',
  styleUrls: ['./sidebarcomponent.scss']
})
export class Sidebarcomponent {
  @Input() visible = true;
  @Output() closeSidebar = new EventEmitter<void>();


  menuItems = [
    { label: 'Accueil', path: '/accueil' },
    { label: 'Édition', path: '/edition' },
    {label: 'Généalogie', path: '/genealogie'},
    {label: 'Liste des artistes', path: '/artisteList'},
  ];

    onLinkClick() {
    this.closeSidebar.emit();
  }
}

