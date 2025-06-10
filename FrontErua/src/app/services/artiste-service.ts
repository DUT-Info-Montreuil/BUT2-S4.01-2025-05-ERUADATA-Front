import {Injectable} from '@angular/core';
import {Artiste, Artistes, ArtisteSing} from "../models/artiste";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ArtisteService {
    private apiUrl = 'http://127.0.0.1:5000/artistes/'

    constructor(private http: HttpClient) {
    }

    // Récupérer tous les artistes avec filtres optionnels
    async getArtistes(filters?: any): Promise<Artistes> {
        let url = this.apiUrl;
        if (filters && Object.keys(filters).length > 0) {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                params.append(key, filters[key]);
            });
            url += '?' + params.toString();
        }
        return firstValueFrom(this.http.get<Artistes>(url));
    }

    // Récupérer un artiste par ID
    async getArtisteById(id: number): Promise<ArtisteSing> {
        return firstValueFrom(this.http.get<ArtisteSing>(this.apiUrl + id));
    }

    // Créer un nouvel artiste
    async createArtiste(artisteData: Partial<Artiste>): Promise<ArtisteSing> {
        return firstValueFrom(this.http.post<ArtisteSing>(this.apiUrl, artisteData));
    }

    // Mettre à jour un artiste
    async updateArtiste(id: number, artisteData: Partial<Artiste>): Promise<ArtisteSing> {
        return firstValueFrom(this.http.put<ArtisteSing>(this.apiUrl + id, artisteData));
    }

    // Supprimer un artiste par nom
    async deleteArtiste(nom: string): Promise<boolean> {
        try {
            await firstValueFrom(this.http.delete(this.apiUrl + nom));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'artiste:', error);
            return false;
        }
    }

    // Méthodes avec Observable pour la compatibilité
    getArtisteByName(nom: string): Observable<Artiste> {
        const formattedNom = nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase();
        return this.http.get<Artiste>(this.apiUrl + '?nom=' + formattedNom);
    }

    getArtistebyNationalite(nationalite: string): Observable<Artiste[]> {
        const formattedNationalite = nationalite.charAt(0).toUpperCase() + nationalite.slice(1).toLowerCase();
        return this.http.get<Artiste[]>(this.apiUrl + '?nationalite=' + formattedNationalite);
    }
}
