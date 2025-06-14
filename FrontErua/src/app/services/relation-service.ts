import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable} from "rxjs";
import {InfluenceRelation, Oeuvre} from "../models/oeuvre";
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RelationService {
    private apiUrl = 'http://127.0.0.1:5000';

    constructor(private http: HttpClient) {
    }

    // === RELATIONS A_CREE ===

    // Créer une relation A_CREE
    createCreationRelation(artisteId: number, oeuvreId: number): Observable<void> {
        const formData = new FormData();
        formData.append('artiste_id', artisteId.toString());
        formData.append('oeuvre_id', oeuvreId.toString());
        return this.http.post<void>(`${this.apiUrl}/artistes/creation`, formData);
    }

    // Supprimer une relation A_CREE
    deleteCreationRelation(artisteId: number, oeuvreId: number): Observable<void> {
        // Les paramètres doivent être passés en query string
        return this.http.delete<void>(`${this.apiUrl}/artistes/creation?artiste_id=${artisteId}&oeuvre_id=${oeuvreId}`);
    }

    // Récupérer les œuvres d'un artiste
    getOeuvresByArtiste(artisteId: number): Observable<Oeuvre[]> {
        return this.http.get<Oeuvre[]>(`${this.apiUrl}/artistes/${artisteId}/oeuvres`);
    }

    // === RELATIONS A_INFLUENCE ===

    // Créer une relation d'influence
    createInfluenceRelation(sourceId: number, cibleId: number): Observable<void> {
        const formData = new FormData();
        formData.append('source_id', sourceId.toString());
        formData.append('cible_id', cibleId.toString());
        return this.http.post<void>(`${this.apiUrl}/oeuvres/influence`, formData);
    }

    // Supprimer une relation d'influence
    deleteInfluenceRelation(sourceId: number, cibleId: number): Observable<void> {
        // Les paramètres doivent être passés en query string
        return this.http.delete<void>(`${this.apiUrl}/oeuvres/influence?source_id=${sourceId}&cible_id=${cibleId}`);
    }

    // Récupérer les influences d'une œuvre
    getInfluencesByOeuvre(oeuvreId: number, nodeLimit?: number): Observable<InfluenceRelation[]> {
        let url = `${this.apiUrl}/oeuvres/influence/${oeuvreId}`;
        if (nodeLimit) {
            url += `?node_limit=${nodeLimit}`;
        }
        return this.http.get<{ success: boolean; data: InfluenceRelation[] }>(url).pipe(
            map(response => response.data)
        );
    }
} 