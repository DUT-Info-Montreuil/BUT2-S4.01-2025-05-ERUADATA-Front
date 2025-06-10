// src/app/services/graph-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Artiste } from '../models/artiste';
import { Oeuvre, InfluenceRelation } from '../models/oeuvre';

interface Artistes {
  data: Artiste[];
  success: boolean;
}

interface Oeuvres {
  data: Oeuvre[];
  success: boolean;
}

interface Relation {
  source: Oeuvre;
  target: Oeuvre;
  type: string;
}

interface CreateRelationRequest {
  source_id: number;
  target_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  private apiUrl = 'http://127.0.0.1:5000'; 
  
  constructor(private http: HttpClient) {}

  // === MÉTHODES POUR LES ARTISTES ===
  async getArtistes(): Promise<Artistes> {
    return firstValueFrom(this.http.get<Artistes>(`${this.apiUrl}/artistes/`));
  }

  async getArtisteById(id: number): Promise<Artiste> {
    const response = await firstValueFrom(this.http.get<{ success: boolean; data: Artiste }>(`${this.apiUrl}/artistes/${id}`));
    return response.data;
  }

  async createArtiste(artisteData: Partial<Artiste>): Promise<Artiste | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; data: Artiste }>(`${this.apiUrl}/artistes/`, artisteData)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'artiste:', error);
      return null;
    }
  }

  async updateArtiste(id: number, artisteData: Partial<Artiste>): Promise<Artiste | null> {
    try {
      const response = await firstValueFrom(
        this.http.put<{ success: boolean; data: Artiste }>(`${this.apiUrl}/artistes/${id}`, artisteData)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'artiste:', error);
      return null;
    }
  }

  async deleteArtiste(nom: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/artistes/${nom}`));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'artiste:', error);
      return false;
    }
  }

  // === MÉTHODES POUR LES ŒUVRES ===
  async getOeuvres(): Promise<Oeuvres> {
    return firstValueFrom(this.http.get<Oeuvres>(`${this.apiUrl}/oeuvres/`));
  }

  async getOeuvreById(id: number): Promise<Oeuvre> {
    const response = await firstValueFrom(this.http.get<{ success: boolean; data: Oeuvre }>(`${this.apiUrl}/oeuvres/${id}`));
    return response.data;
  }

  async createOeuvre(oeuvreData: Partial<Oeuvre>): Promise<Oeuvre | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; data: Oeuvre }>(`${this.apiUrl}/oeuvres/`, oeuvreData)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'œuvre:', error);
      return null;
    }
  }

  async updateOeuvre(id: number, oeuvreData: Partial<Oeuvre>): Promise<Oeuvre | null> {
    try {
      const response = await firstValueFrom(
        this.http.put<{ success: boolean; data: Oeuvre }>(`${this.apiUrl}/oeuvres/${id}`, oeuvreData)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'œuvre:', error);
      return null;
    }
  }

  async deleteOeuvre(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/oeuvres/${id}`));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'œuvre:', error);
      return false;
    }
  }

  // === MÉTHODES POUR LES RELATIONS D'INFLUENCE ===
  async getInfluencesByOeuvre(id: number, nodeLimit?: number): Promise<InfluenceRelation[]> {
    let url = `${this.apiUrl}/influence_relation/${id}`;
    if (nodeLimit) {
      url += `?node_limit=${nodeLimit}`;
    }
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; data: InfluenceRelation[] }>(url)
    );
    return response.data;
  }

  async createInfluenceRelation(sourceId: number, cibleId: number): Promise<any> {
    try {
      const request: CreateRelationRequest = { source_id: sourceId, target_id: cibleId };
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; data: any }>(`${this.apiUrl}/influence_relation/`, request)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la relation d\'influence:', error);
      return null;
    }
  }

  async deleteInfluenceRelation(sourceId: number, cibleId: number): Promise<boolean> {
    try {
      const data = { source_id: sourceId, cible_id: cibleId };
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/influence_relation/`, { body: data })
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la relation d\'influence:', error);
      return false;
    }
  }

  // === MÉTHODES POUR LES RELATIONS DE CRÉATION ===
  async getOeuvresByArtiste(artisteId: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/a_cree_relation/${artisteId}`)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des œuvres de l\'artiste:', error);
      return [];
    }
  }

  async createCreationRelation(artisteId: number, oeuvreId: number): Promise<any> {
    try {
      const data = { artiste_id: artisteId, oeuvre_id: oeuvreId };
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; data: any }>(`${this.apiUrl}/a_cree_relation/`, data)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la relation de création:', error);
      return null;
    }
  }

  async deleteCreationRelation(artisteId: number, oeuvreId: number): Promise<boolean> {
    try {
      const data = { artiste_id: artisteId, oeuvre_id: oeuvreId };
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/a_cree_relation/`, { body: data })
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la relation de création:', error);
      return false;
    }
  }
  async getAllCreationRelations(): Promise<any[]> {
    try {
      const artistes = await this.getArtistes();
      const relations: any[] = [];
      for (const artiste of artistes.data) {
        const oeuvres = await this.getOeuvresByArtiste(artiste.id);
        if (oeuvres && oeuvres.length > 0) {
          for (const oeuvre of oeuvres) {
            // Correction : extraire la vraie oeuvre si elle est dans la clé 'o'
            const realOeuvre = oeuvre.o ? oeuvre.o : oeuvre;
            if (realOeuvre && realOeuvre.id && realOeuvre.nom && realOeuvre.date_creation) {
              relations.push({
                artiste: artiste,
                oeuvre: realOeuvre,
                type: 'A_CREE'
              });
            }
          }
        }
      }
      return relations;
    } catch (error) {
      console.error('Erreur lors de la récupération des relations de création:', error);
      return [];
    }
  }

  
}
