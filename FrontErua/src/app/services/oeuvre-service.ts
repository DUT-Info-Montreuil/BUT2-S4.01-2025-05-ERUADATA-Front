import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Oeuvres} from "../models/oeuvre";

@Injectable({
    providedIn: 'root'
})
export class OeuvreService {
    private apiUrl = 'http://127.0.0.1:5000/oeuvres/'


    constructor(private http: HttpClient) {
    }

    async getOeuvres(): Promise<Oeuvres> {
        return firstValueFrom(this.http.get<Oeuvres>(this.apiUrl));
    }

}
