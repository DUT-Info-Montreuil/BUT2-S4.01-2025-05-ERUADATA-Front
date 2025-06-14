export interface Oeuvre {
    id: number;
    nom: string;
    artiste: string;
    genre: string;
    date_creation: number;
    dimensions: string;
    description: string;
    type: string;
}

/**
 * Interface représentant la réponse d'une requête pour une seule œuvre.
 * - data: l'objet Oeuvre retourné.
 */
export interface OeuvreSing {
    data: Oeuvre;
}

/**
 * Interface représentant la réponse d'une requête pour plusieurs œuvres.
 * - data: un tableau d'objets Oeuvre.
 */
export interface Oeuvres {
    data: Oeuvre[];
}

/**
 * Interface pour les relations d'influence
 */
export interface InfluenceRelation {
    direction: string;
    path: Oeuvre[];
}

/**
 * Interface pour les relations de création
 */
export interface CreationRelation {
    artiste_id: number;
    oeuvre_id: number;
}