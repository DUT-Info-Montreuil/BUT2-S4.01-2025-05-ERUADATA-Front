import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Oeuvre, OeuvreSing} from "../../models/oeuvre";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {OeuvreService} from "../../services/oeuvre-service";


@Component({
  selector: 'app-oeuvre-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oeuvre-detail.component.html',
  styleUrls: ['./oeuvre-detail.component.scss']
})
export class OeuvreDetailComponent implements OnInit {
  oeuvre$!: Observable<OeuvreSing>;
  oeuvre!: Oeuvre;


  constructor(private router: Router, private route: ActivatedRoute, private service: OeuvreService) {
  }

  ngOnInit(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));

    if (idParam) {
      this.oeuvre$ = this.service.getOeuvreById(idParam);
      this.oeuvre$.subscribe(oeuvre => {
        this.oeuvre = oeuvre.data;
      })
    }
  }
}
