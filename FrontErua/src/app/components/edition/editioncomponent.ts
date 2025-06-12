import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {EditionArtisteComponent} from "../edition-artiste/edition-artiste.component";

@Component({
    selector: 'app-edition',
    standalone: true,
    imports: [],
    templateUrl: './editioncomponent.html',
    styleUrl: './editioncomponent.scss'
})
export class EditionComponent {

    constructor(private dialog: MatDialog) {}

    onEdit() {
        const editionRef = this.dialog.open(EditionArtisteComponent, {
            width: '600px',
            data: {
                // Pass any data you want to the dialog here
            }
        });

        editionRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Edition dialog closed with result:', result);
            }
        });
    }
}
