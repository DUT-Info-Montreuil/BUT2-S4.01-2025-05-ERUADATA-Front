import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Oeuvre } from '../components/oeuvre-detail/oeuvre'; // adapte le chemin si besoin

interface OeuvresResponse {
  data: Oeuvre[];
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OeuvreService {
  private apiUrl = 'http://127.0.0.1:5000/oeuvres';

  constructor(private http: HttpClient) {}

  getAllOeuvres(): Observable<Oeuvre[]> {
    return this.http.get<OeuvresResponse>(`${this.apiUrl}`).pipe(
      map(response => response.data)
    );
  }

  getOeuvreDetailById(id: number): Observable<Oeuvre | undefined> {
    return this.getAllOeuvres().pipe(
      map(oeuvres => oeuvres.find(o => o.id === id))
    );
  }
}
