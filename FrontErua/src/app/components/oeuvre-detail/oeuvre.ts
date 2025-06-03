export interface Oeuvre {
  id: number;
  nom: string;
  artiste: string;
  date_creation: number;
  dimensions: string;
  description: string;
  type: string;
  mouvement: string;
  influencePar?: string[];
  influenceSur?: string[];
}
