import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Oeuvre } from './oeuvre';
import { OeuvreService } from '../../services/oeuvre-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oeuvre-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oeuvre-detail.component.html',
  styleUrls: ['./oeuvre-detail.component.scss']
})
export class OeuvreDetailComponent implements OnInit {
  private service = inject(OeuvreService);
  private route = inject(ActivatedRoute);

  public oeuvre?: Oeuvre;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = parseInt(idParam, 10);
      this.service.getOeuvreDetailById(id).subscribe((data) => {
        this.oeuvre = data;
      });
    }
  }
}
