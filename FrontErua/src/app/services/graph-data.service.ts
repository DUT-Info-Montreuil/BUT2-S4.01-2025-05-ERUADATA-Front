// src/app/services/graph-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
  getArtistes(): Observable<Artistes> {
    return this.http.get<Artistes>(`${this.apiUrl}/artistes/`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des artistes:', error);
        return throwError(() => error);
      })
    );
  }

  getArtisteById(id: number): Observable<Artiste> {
    return this.http.get<{ success: boolean; data: Artiste }>(`${this.apiUrl}/artistes/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la récupération de l\'artiste:', error);
        return throwError(() => error);
      })
    );
  }

  createArtiste(artisteData: Partial<Artiste>): Observable<Artiste | null> {
    return this.http.post<{ success: boolean; data: Artiste }>(`${this.apiUrl}/artistes/`, artisteData).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la création de l\'artiste:', error);
        return of(null);
      })
    );
  }

  updateArtiste(id: number, artisteData: Partial<Artiste>): Observable<Artiste | null> {
    return this.http.put<{ success: boolean; data: Artiste }>(`${this.apiUrl}/artistes/${id}`, artisteData).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la mise à jour de l\'artiste:', error);
        return of(null);
      })
    );
  }

  deleteArtiste(nom: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/artistes/${nom}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Erreur lors de la suppression de l\'artiste:', error);
        return of(false);
      })
    );
  }

  // === MÉTHODES POUR LES ŒUVRES ===
  getOeuvres(): Observable<Oeuvres> {
    return this.http.get<Oeuvres>(`${this.apiUrl}/oeuvres/`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des œuvres:', error);
        return throwError(() => error);
      })
    );
  }

  getOeuvreById(id: number): Observable<Oeuvre> {
    return this.http.get<{ success: boolean; data: Oeuvre }>(`${this.apiUrl}/oeuvres/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la récupération de l\'œuvre:', error);
        return throwError(() => error);
      })
    );
  }

  createOeuvre(oeuvreData: Partial<Oeuvre>): Observable<Oeuvre | null> {
    return this.http.post<{ success: boolean; data: Oeuvre }>(`${this.apiUrl}/oeuvres/`, oeuvreData).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la création de l\'œuvre:', error);
        return of(null);
      })
    );
  }

  updateOeuvre(id: number, oeuvreData: Partial<Oeuvre>): Observable<Oeuvre | null> {
    return this.http.put<{ success: boolean; data: Oeuvre }>(`${this.apiUrl}/oeuvres/${id}`, oeuvreData).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la mise à jour de l\'œuvre:', error);
        return of(null);
      })
    );
  }

  deleteOeuvre(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/oeuvres/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Erreur lors de la suppression de l\'œuvre:', error);
        return of(false);
      })
    );
  }

  // === MÉTHODES POUR LES RELATIONS D'INFLUENCE ===
  getInfluencesByOeuvre(id: number, nodeLimit?: number): Observable<InfluenceRelation[]> {
    let url = `${this.apiUrl}/influence_relation/${id}`;
    if (nodeLimit) {
      url += `?node_limit=${nodeLimit}`;
    }
    return this.http.get<{ success: boolean; data: InfluenceRelation[] }>(url).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la récupération des influences:', error);
        return throwError(() => error);
      })
    );
  }

  createInfluenceRelation(sourceId: number, cibleId: number): Observable<any> {
    const request: CreateRelationRequest = { source_id: sourceId, target_id: cibleId };
    return this.http.post<{ success: boolean; data: any }>(`${this.apiUrl}/influence_relation/`, request).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la création de la relation d\'influence:', error);
        return of(null);
      })
    );
  }

  deleteInfluenceRelation(sourceId: number, cibleId: number): Observable<boolean> {
    const data = { source_id: sourceId, cible_id: cibleId };
    return this.http.delete(`${this.apiUrl}/influence_relation/`, { body: data }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Erreur lors de la suppression de la relation d\'influence:', error);
        return of(false);
      })
    );
  }

  // === MÉTHODES POUR LES RELATIONS DE CRÉATION ===
  getOeuvresByArtiste(artisteId: number): Observable<any> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/a_cree_relation/${artisteId}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la récupération des œuvres de l\'artiste:', error);
        return of([]);
      })
    );
  }

  createCreationRelation(artisteId: number, oeuvreId: number): Observable<any> {
    const data = { artiste_id: artisteId, oeuvre_id: oeuvreId };
    return this.http.post<{ success: boolean; data: any }>(`${this.apiUrl}/a_cree_relation/`, data).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la création de la relation de création:', error);
        return of(null);
      })
    );
  }

  deleteCreationRelation(artisteId: number, oeuvreId: number): Observable<boolean> {
    const data = { artiste_id: artisteId, oeuvre_id: oeuvreId };
    return this.http.delete(`${this.apiUrl}/a_cree_relation/`, { body: data }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Erreur lors de la suppression de la relation de création:', error);
        return of(false);
      })
    );
  }

  getAllCreationRelations(): Observable<any[]> {
    return this.getArtistes().pipe(
      switchMap(artistes => {
        const artisteObservables = artistes.data.map(artiste => 
          this.getOeuvresByArtiste(artiste.id).pipe(
            map(oeuvres => {
              if (oeuvres && oeuvres.length > 0) {
                return oeuvres.map((oeuvre: any) => {
                  // Correction : extraire la vraie oeuvre si elle est dans la clé 'o'
                  const realOeuvre = oeuvre.o ? oeuvre.o : oeuvre;
                  if (realOeuvre && realOeuvre.id && realOeuvre.nom && realOeuvre.date_creation) {
                    return {
                      artiste: artiste,
                      oeuvre: realOeuvre,
                      type: 'A_CREE'
                    };
                  }
                  return null;
                }).filter((relation: any) => relation !== null);
              }
              return [];
            })
          )
        );
        
        // Combiner tous les observables d'artistes
        return artisteObservables.length > 0 
          ? artisteObservables.reduce((acc, obs) => 
              acc.pipe(
                switchMap(accResults => 
                  obs.pipe(
                    map(obsResults => [...accResults, ...obsResults])
                  )
                )
              ), of([])
            )
          : of([]);
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des relations de création:', error);
        return of([]);
      })
    );
  }
}
