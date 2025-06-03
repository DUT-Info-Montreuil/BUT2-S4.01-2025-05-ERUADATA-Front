import {Injectable} from '@angular/core';
import {Artiste} from "../models/artiste";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
/**
 * Interface représentant la réponse d'une requête pour un seul artiste.
 * - data: l'objet Artiste retourné.
 * - success: indique si la requête a réussi.
 */
interface ArtisteSing {
    data: Artiste;
    success: boolean;

}

/**
 * Interface représentant la réponse d'une requête pour plusieurs artistes.
 * - data: un tableau d'objets Artiste.
 * - success: indique si la requête a réussi.
 */
interface Artistes {
    data: Artiste[];
    success: boolean;
}
@Injectable({
    providedIn: 'root'
})

export class ArtisteService {

    private apiUrl = 'http://127.0.0.1:5000/artistes/'

    constructor(private http: HttpClient) {
    }

    async getArtistes(): Promise<Artistes> {
        return firstValueFrom(this.http.get<Artistes>(this.apiUrl));
    }

    async getArtisteById(id: number): Promise<ArtisteSing> {
        return firstValueFrom(this.http.get<ArtisteSing>(this.apiUrl + id));
    }

    getArtisteByName(nom: string): Observable<Artiste> {
        const formattedNom = nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase();
        return this.http.get<Artiste>(this.apiUrl + '?nom=' + formattedNom);
    }

    getArtistebyNationalite(nationalite: string): Observable<Artiste[]> {
        const formattedNationalite = nationalite.charAt(0).toUpperCase() + nationalite.slice(1).toLowerCase();
        return this.http.get<Artiste[]>(this.apiUrl + '?nationalite=' + formattedNationalite);
    }

}
