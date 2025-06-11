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

    getArtisteImage(id: number): Observable<Blob> {
        return this.http.get(this.apiUrlArtiste + id + '/image', {responseType: 'blob'});
    }

    addArtisteImage(id: number, event: Event): Observable<string> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) {
            throw new Error('Aucun fichier sélectionné');
        }

        const formData = new FormData();
        formData.append('image', file, file.name);
        return this.http.post<string>(this.apiUrlArtiste + id + '/image', formData, {responseType: 'text' as 'json'});
    }

    getArtisteById(id: number): Observable<ArtisteSing> {
        return this.http.get<ArtisteSing>(this.apiUrlArtiste + id);
    }

    getOeuvresByArtisteId(id: number): Observable<Oeuvres> {
        return this.http.get<Oeuvres>(this.apiUrlArtiste + id + '/oeuvres');
    }

    addArtiste(artiste: Artiste): Observable<Artiste> {
        return this.http.post<Artiste>(this.apiUrlArtiste, artiste);
    }

    deleteArtiste(id: Number): Observable<Artiste> {
        return this.http.delete<Artiste>(this.apiUrlArtiste + id);
    }

    updateArtiste(id: Number, artiste: Artiste): Observable<Artiste> {
        return this.http.put<Artiste>(this.apiUrlArtiste + id, artiste);
    }

}
