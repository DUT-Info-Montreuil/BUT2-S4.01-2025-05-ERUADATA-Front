import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {Oeuvre, Oeuvres, OeuvreSing} from "../models/oeuvre";

@Injectable({
    providedIn: 'root'
})
export class OeuvreService {
    private apiUrl = 'http://127.0.0.1:5000/oeuvres/'

    constructor(private http: HttpClient) {
    }

    // Récupérer toutes les œuvres avec filtres optionnels
    async getOeuvres(filters?: any): Promise<Oeuvres> {
        let url = this.apiUrl;
        if (filters && Object.keys(filters).length > 0) {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                params.append(key, filters[key]);
            });
            url += '?' + params.toString();
        }
        return firstValueFrom(this.http.get<Oeuvres>(url));
    }

    // Récupérer une œuvre par ID
    async getOeuvreById(id: number): Promise<OeuvreSing> {
        return firstValueFrom(this.http.get<OeuvreSing>(this.apiUrl + id));
    }

    // Créer une nouvelle œuvre
    async createOeuvre(oeuvreData: Partial<Oeuvre>): Promise<OeuvreSing> {
        return firstValueFrom(this.http.post<OeuvreSing>(this.apiUrl, oeuvreData));
    }

    // Mettre à jour une œuvre
    async updateOeuvre(id: number, oeuvreData: Partial<Oeuvre>): Promise<OeuvreSing> {
        return firstValueFrom(this.http.put<OeuvreSing>(this.apiUrl + id, oeuvreData));
    }

    // Supprimer une œuvre par ID
    async deleteOeuvre(id: number): Promise<boolean> {
        try {
            await firstValueFrom(this.http.delete(this.apiUrl + id));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'œuvre:', error);
            return false;
        }
    }

    // Méthodes avec Observable pour la compatibilité
    getOeuvreByName(nom: string): Observable<Oeuvre> {
        const formattedNom = nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase();
        return this.http.get<Oeuvre>(this.apiUrl + '?nom=' + formattedNom);
    }

    getOeuvreByGenre(genre: string): Observable<Oeuvre[]> {
        const formattedGenre = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
        return this.http.get<Oeuvre[]>(this.apiUrl + '?genre=' + formattedGenre);
    }
}
