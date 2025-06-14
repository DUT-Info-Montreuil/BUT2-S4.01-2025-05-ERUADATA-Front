export interface Artiste {
    id: number,
    nationalite: string,
    nom: string,
    prenom: string,
    description?: string,
    genre: string,
    image?: string,
}


/**
 * Interface représentant la réponse d'une requête pour un seul artiste.
 * - data: l'objet Artiste retourné.
 * - success: indique si la requête a réussi.
 */
export interface ArtisteSing {
    data: Artiste;
}

/**
 * Interface représentant la réponse d'une requête pour plusieurs artistes.
 * - data: un tableau d'objets Artiste.
 * - success: indique si la requête a réussi.
 */
export interface Artistes {
    data: Artiste[];
}