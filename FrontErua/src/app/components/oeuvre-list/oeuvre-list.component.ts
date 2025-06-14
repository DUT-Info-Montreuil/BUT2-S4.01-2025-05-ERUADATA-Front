import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OeuvreService} from '../../services/oeuvre-service';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Oeuvre} from '../../models/oeuvre';

@Component({
    selector: 'app-oeuvre-list',
    standalone: true,
    imports: [
        RouterLink,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './oeuvre-list.component.html',
    styleUrls: ['./oeuvre-list.component.scss']
})
export class OeuvreListComponent implements OnInit {
    oeuvres: Oeuvre[] = [];
    searchText: string = '';
    private readonly oeuvreService = inject(OeuvreService);

    ngOnInit() {
        this.oeuvreService.getAllOeuvres().subscribe(data => {
            this.oeuvres = data;
        }, error => {
            console.error('Error fetching oeuvres:', error);
        });
    }
}
