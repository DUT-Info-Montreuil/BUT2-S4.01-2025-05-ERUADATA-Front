import {Injectable} from '@angular/core';
import {Artiste, Artistes, ArtisteSing} from "../models/artiste";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {Oeuvres} from "../models/oeuvre";

@Injectable({
    providedIn: 'root'
})
export class ArtisteService {

    private apiUrlArtiste = 'http://127.0.0.1:5000/artistes/'

    constructor(private http: HttpClient) {
    }

    // Récupérer tous les artistes avec filtres optionnels
    async getArtistesFilters(filters?: any): Promise<Artistes> {
        let url = this.apiUrlArtiste;
        if (filters && Object.keys(filters).length > 0) {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                params.append(key, filters[key]);
            });
            url += '?' + params.toString();
        }
        return firstValueFrom(this.http.get<Artistes>(url));
    }

    getArtistes(): Observable<Artistes> {
        return this.http.get<Artistes>(this.apiUrlArtiste);
    }

    getArtisteImage(id: number): Observable<File> {
        return this.http.get<File>(`${this.apiUrlArtiste}${id}/image`);
    }

    updateArtisteImage(id: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrlArtiste}${id}`, formData);
    }

    getArtistebyNationalite(nationalite: string): Observable<Artiste[]> {
        const formattedNationalite = nationalite.charAt(0).toUpperCase() + nationalite.slice(1).toLowerCase();
        return this.http.get<Artiste[]>(this.apiUrlArtiste + '?nationalite=' + formattedNationalite);
    }

    getArtisteByName(nom: string): Observable<Artiste> {
        const formattedNom = nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase();
        return this.http.get<Artiste>(this.apiUrlArtiste + '?nom=' + formattedNom);
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
