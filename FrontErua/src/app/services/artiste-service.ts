import { Injectable } from '@angular/core';
import {Artiste} from "../models/artiste";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ArtisteService {
  private apiUrl = 'http://127.0.0.1:5000/artistes/'

  constructor(private http: HttpClient) { }

    getAllArtistes(): Observable<Artiste[]> {
        return this.http.get<Artiste[]>(this.apiUrl);
    }


    getArtisteById(id: number): Observable<Artiste> {
        return this.http.get<Artiste>(this.apiUrl + '?id=' + id);
    }

    getArtisteByName(nom: string): Observable<Artiste> {
        // Capitalise la première lettre du nom et du prénom
        const formattedNom = nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase();

        return this.http.get<Artiste>(this.apiUrl + '?nom=' + formattedNom);
    }
}
