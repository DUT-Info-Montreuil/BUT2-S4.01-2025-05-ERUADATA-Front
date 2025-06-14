import {Injectable} from '@angular/core';
import {Artiste, Artistes, ArtisteSing} from "../models/artiste";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Oeuvres} from "../models/oeuvre";

@Injectable({
    providedIn: 'root'
})
export class ArtisteService {

    private apiUrlArtiste = 'http://127.0.0.1:5000/artistes/'

    constructor(private http: HttpClient) {
    }

    getArtistes(): Observable<Artistes> {
        return this.http.get<Artistes>(this.apiUrlArtiste);
    }

    getArtisteById(id: number): Observable<ArtisteSing> {
        return this.http.get<ArtisteSing>(this.apiUrlArtiste + id);
    }

    updateArtisteImage(id: number, formData: FormData): Observable<void> {
        return this.http.put<void>(`${this.apiUrlArtiste}${id}`, formData);
    }

    updateArtiste(id: number, artiste: FormData): Observable<Artiste> {

        console.log('Updating artiste with ID:', id, 'and data:', artiste);
        return this.http.put<Artiste>(this.apiUrlArtiste + id, artiste);
    }

    getArtisteImage(id: number): Observable<Blob> {
        const url = `${this.apiUrlArtiste}${id}/image?nocache=${Date.now()}`;
        return this.http.get(url, {responseType: 'blob'});
    }

    getOeuvresByArtisteId(id: number): Observable<Oeuvres> {
        return this.http.get<Oeuvres>(this.apiUrlArtiste + id + '/oeuvres');
    }

    addArtiste(artiste: Artiste): Observable<Artiste> {
        return this.http.post<Artiste>(this.apiUrlArtiste, artiste);
    }

    deleteArtiste(id: number): Observable<Artiste> {
        return this.http.delete<Artiste>(this.apiUrlArtiste + id);
    }


}
