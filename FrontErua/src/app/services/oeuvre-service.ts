import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Oeuvre, Oeuvres, OeuvreSing} from "../models/oeuvre";
import {map, catchError} from 'rxjs/operators';

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

    // Récupérer une œuvre par ID
    getOeuvreById(id: number): Observable<OeuvreSing> {
        return this.http.get<OeuvreSing>(this.apiUrl + id);
    }

    // Créer une nouvelle œuvre
    createOeuvre(oeuvreData: Partial<Oeuvre>): Observable<OeuvreSing> {
        return this.http.post<OeuvreSing>(this.apiUrl, oeuvreData);
    }

    // Mettre à jour une œuvre
    updateOeuvre(id: number, oeuvreData: Partial<Oeuvre>): Observable<OeuvreSing> {
        return this.http.put<OeuvreSing>(this.apiUrl + id, oeuvreData);
    }

    // Supprimer une œuvre par ID
    deleteOeuvre(id: number): Observable<boolean> {
        return this.http.delete(this.apiUrl + id).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }
}
