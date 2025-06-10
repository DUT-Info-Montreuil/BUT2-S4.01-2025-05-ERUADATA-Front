import {Injectable} from '@angular/core';
import {Artiste,Artistes,ArtisteSing} from "../models/artiste";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class ArtisteService {



    private apiUrl = 'http://127.0.0.1:5000/artistes/'

    constructor(private http: HttpClient) {
    }

    async getArtistes(): Promise<Artistes> {
        return firstValueFrom(this.http.get<Artistes>(this.apiUrl));
    }

    async getArtisteById(id: number): Promise<ArtisteSing> {
        return firstValueFrom(this.http.get<ArtisteSing>(this.apiUrl + id));
    }

    async addArtiste(artiste: Artiste): Promise<Artiste> {
            return firstValueFrom(this.http.post<Artiste>(this.apiUrl, artiste));
    }

    async updateArtiste(id: Number, artiste: Artiste): Promise<Artiste> {
        console.log("Updating artiste:", artiste);
        return firstValueFrom(this.http.put<Artiste>(this.apiUrl + id, artiste));
    }

}
