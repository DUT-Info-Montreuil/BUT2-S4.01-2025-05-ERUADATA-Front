import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Oeuvre, Oeuvres, OeuvreSing} from "../models/oeuvre";

interface OeuvresResponse {
    data: Oeuvre[];
    success: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class OeuvreService {
    private apiUrl = 'http://127.0.0.1:5000/oeuvres/'

    constructor(private http: HttpClient) {
    }

    // Récupérer toutes les œuvres avec filtres optionnels
    getOeuvres(filters?: Record<string, string>): Observable<Oeuvres> {
        let url = this.apiUrl;
        if (filters && Object.keys(filters).length > 0) {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                params.append(key, filters[key]);
            });
            url += '?' + params.toString();
        }
        return this.http.get<Oeuvres>(url);
    }

    getAllOeuvres(): Observable<Oeuvre[]> {
        return this.http.get<OeuvresResponse>(`${this.apiUrl}`).pipe(
            map(response => response.data)
        );
    }
    // Récupérer une œuvre par ID
    getOeuvreById(id: number): Observable<OeuvreSing> {
        return this.http.get<OeuvreSing>(this.apiUrl + id);
    }

    // Créer une nouvelle œuvre
    createOeuvre(oeuvreData: FormData): Observable<OeuvreSing> {
        return this.http.post<OeuvreSing>(this.apiUrl, oeuvreData);
    }

    // Mettre à jour une œuvre
    updateOeuvre(id: number, oeuvreData: FormData): Observable<OeuvreSing> {
        return this.http.put<OeuvreSing>(this.apiUrl + id, oeuvreData);
    }

    getOeuvreDetailById(id: number): Observable<Oeuvre | undefined> {
        return this.getAllOeuvres().pipe(
            map(oeuvres => oeuvres.find(o => o.id === id))
        );
    }

    // Supprimer une œuvre par ID
    deleteOeuvre(id: number): Observable<Oeuvre> {
        return this.http.delete<Oeuvre>(this.apiUrl + id);
    }

    // Récupérer l'image d'une oeuvre par ID
    getOeuvreImage(id: number): Observable<Blob> {
        const url = `${this.apiUrl}${id}/image?nocache=${Date.now()}`;
        return this.http.get(url, {responseType: 'blob'});
    }

    updateOeuvreImage(id: number, formData: FormData) {
        return this.http.put(`${this.apiUrl}/oeuvres/${id}/image`, formData);
      }
      
}
