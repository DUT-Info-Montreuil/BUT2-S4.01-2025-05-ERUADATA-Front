import {Component, Input} from '@angular/core';
import {Oeuvre} from '../../../models/oeuvre';
import { OeuvreService } from '../../../services/oeuvre-service';

@Component({
    selector: 'app-oeuvre-list-card',
    standalone: true,
    templateUrl: './oeuvre-list-card.component.html',
    styleUrls: ['./oeuvre-list-card.component.scss']
})
export class OeuvreListCardComponent {
    @Input() oeuvre!: Oeuvre;
    imageSrc: string | undefined;

    constructor(private oeuvreService: OeuvreService) {}

    ngOnInit() {
        if (this.oeuvre && this.oeuvre.id) {
            this.oeuvreService.getOeuvreImage(this.oeuvre.id).subscribe({
                next: (blob) => {
                    this.imageSrc = URL.createObjectURL(blob);
                },
                error: () => {
                    this.imageSrc = 'assets/images/default-oeuvre.png';
                }
            });
        } else {
            this.imageSrc = 'assets/images/default-oeuvre.png';
        }
    }
}