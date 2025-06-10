// src/app/services/graph-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Artistes {
  data: Artiste[];
  success: boolean;
}

interface Artiste {
  id: string;
  nom: string;
  prenom?: string;
  nationalite?: string;
  description?: string;
  genre?: string;
}

interface Oeuvres {
  data: Oeuvre[];
  success: boolean;
}

interface Oeuvre {
  id: number;
  nom: string;
  description: string;
  date_creation: number;
  type: string;
  dimensions: string;
  mouvement: string;
}

interface RelationInfluenceRaw {
  direction: string;
  path: (any | { id: string })[]; // on peut typer plus finement plus tard
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

  async getArtistes(): Promise<Artistes> {
    return firstValueFrom(this.http.get<Artistes>(`${this.apiUrl}/artistes/`));
  }

  async getOeuvres(): Promise<Oeuvres> {
    return firstValueFrom(this.http.get<Oeuvres>(`${this.apiUrl}/oeuvres/`));
  }

  async getRelations(id: number): Promise<unknown[]> {
    return firstValueFrom(this.http.get<unknown[]>(`${this.apiUrl}/oeuvres/${encodeURIComponent(id)}/influences/`));
  }
  
  async getRelationsById(id: number): Promise<RelationInfluenceRaw[]> {
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; data: RelationInfluenceRaw[] }>(
        `${this.apiUrl}/oeuvres/${encodeURIComponent(id)}/influences`
      )
    );
    return response.data;
  }

  // Méthodes CRUD pour les artistes
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

  async updateArtiste(id: string, artisteData: Partial<Artiste>): Promise<Artiste | null> {
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

  async deleteArtiste(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/artistes/${id}`));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'artiste:', error);
      return false;
    }
  }

  // Méthodes CRUD pour les œuvres
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

  // Méthodes CRUD pour les relations
  async getAllRelations(): Promise<Relation[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ success: boolean; data: Relation[] }>(`${this.apiUrl}/relations/`)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des relations:', error);
      return [];
    }
  }

  async createRelation(sourceId: number, targetId: number): Promise<Relation | null> {
    try {
      const request: CreateRelationRequest = { source_id: sourceId, target_id: targetId };
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; data: Relation }>(`${this.apiUrl}/relations/`, request)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la relation:', error);
      return null;
    }
  }

  async deleteRelation(sourceId: number, targetId: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/relations/${sourceId}/${targetId}`)
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la relation:', error);
      return false;
    }
  }
}
