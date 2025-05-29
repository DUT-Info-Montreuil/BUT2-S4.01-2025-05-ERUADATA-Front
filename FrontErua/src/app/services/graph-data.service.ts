// src/app/services/graph-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  private apiUrl = 'http://localhost:5000'; // adapte l’URL si ton back est déployé

  constructor(private http: HttpClient) {}

  async getArtistes(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/artistes/`));
  }

  async getOeuvres(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/oeuvres/`));
  }

  async getRelations(titre: string): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/oeuvres/${encodeURIComponent(titre)}/influences`));
  }
}
