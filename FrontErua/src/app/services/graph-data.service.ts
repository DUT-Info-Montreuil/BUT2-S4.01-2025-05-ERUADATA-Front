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


}
