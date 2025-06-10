import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {InfluenceRelation, CreationRelation} from "../models/oeuvre";

@Injectable({
    providedIn: 'root'
})
export class RelationService {
    private apiUrl = 'http://127.0.0.1:5000';

    constructor(private http: HttpClient) {
    }

    // === RELATIONS A_CREE ===

    // Créer une relation A_CREE
    async createCreationRelation(artisteId: number, oeuvreId: number): Promise<any> {
        const data = {
            artiste_id: artisteId,
            oeuvre_id: oeuvreId
        };
        return firstValueFrom(this.http.post(`${this.apiUrl}/a_cree_relation/`, data));
    }

    // Supprimer une relation A_CREE
    async deleteCreationRelation(artisteId: number, oeuvreId: number): Promise<any> {
        const data = {
            artiste_id: artisteId,
            oeuvre_id: oeuvreId
        };
        return firstValueFrom(this.http.delete(`${this.apiUrl}/a_cree_relation/`, { body: data }));
    }

    // Récupérer les œuvres d'un artiste
    async getOeuvresByArtiste(artisteId: number): Promise<any> {
        return firstValueFrom(this.http.get(`${this.apiUrl}/a_cree_relation/${artisteId}`));
    }

    // === RELATIONS A_INFLUENCE ===

    // Créer une relation d'influence
    async createInfluenceRelation(sourceId: number, cibleId: number): Promise<any> {
        const data = {
            source_id: sourceId,
            cible_id: cibleId
        };
        return firstValueFrom(this.http.post(`${this.apiUrl}/influence_relation/`, data));
    }

    // Supprimer une relation d'influence
    async deleteInfluenceRelation(sourceId: number, cibleId: number): Promise<any> {
        const data = {
            source_id: sourceId,
            cible_id: cibleId
        };
        return firstValueFrom(this.http.delete(`${this.apiUrl}/influence_relation/`, { body: data }));
    }

    // Récupérer les influences d'une œuvre
    async getInfluencesByOeuvre(oeuvreId: number, nodeLimit?: number): Promise<InfluenceRelation[]> {
        let url = `${this.apiUrl}/influence_relation/${oeuvreId}`;
        if (nodeLimit) {
            url += `?node_limit=${nodeLimit}`;
        }
        const response = await firstValueFrom(this.http.get<{ success: boolean; data: InfluenceRelation[] }>(url));
        return response.data;
    }
} 