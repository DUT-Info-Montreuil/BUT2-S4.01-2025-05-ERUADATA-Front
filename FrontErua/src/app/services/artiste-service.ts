import { Injectable } from '@angular/core';
import {Artiste} from "../models/artiste";

@Injectable({
  providedIn: 'root'
})
export class ArtisteService {
  private artistes: Artiste[] = [
    new Artiste(
        'Léonard',
        'da Vinci',
        'Italien',
        '1452',
        'Peintre et inventeur de la Renaissance, célèbre pour la Joconde et La Cène.',
    ),
    new Artiste(
        'Michelangelo',
        'Buonarroti',
        'Italien',
        '1475',
        'Sculpteur, peintre et architecte, connu pour la chapelle Sixtine.',
    ),
    new Artiste(
        'Raphaël',
        'Sanzio',
        'Italien',
        '1483',
        'Peintre de la Haute Renaissance, célèbre pour ses Madones et fresques.',
    ),
    new Artiste(
        'Albrecht',
        'Dürer',
        'Allemand',
        '1471',
        'Maître de la gravure et de la peinture, influencé par l’humanisme.',
    ),
    new Artiste(
        'Sandro',
        'Botticelli',
        'Italien',
        '1445',
        'Peintre florentin, connu pour La Naissance de Vénus.',
    ),
    new Artiste(
        'Caravaggio',
        'Michelangelo Merisi',
        'Italien',
        '1571',
        'Peintre baroque maître du clair-obscur dramatique.',
    ),
    new Artiste(
        'Rembrandt',
        'van Rijn',
        'Néerlandais',
        '1606',
        'Peintre baroque, célèbre pour ses portraits et jeux de lumière.',
    ),
    new Artiste(
        'Diego',
        'Velázquez',
        'Espagnol',
        '1599',
        'Peintre de cour espagnol, auteur de Les Ménines.',
    ),
    new Artiste(
        'Peter Paul',
        'Rubens',
        'Belge',
        '1577',
        'Peintre baroque flamand, célèbre pour ses compositions dynamiques.',
    ),
    new Artiste(
        'Artemisia',
        'Gentileschi',
        'Italienne',
        '1593',
        'Peintre baroque, pionnière parmi les femmes artistes.',
    ),
    new Artiste(
        'Francisco',
        'Goya',
        'Espagnol',
        '1746',
        'Peintre romantique, critique de la guerre et de la société.',
    ),
    new Artiste(
        'Eugène',
        'Delacroix',
        'Français',
        '1798',
        'Figure du romantisme, auteur de La Liberté guidant le peuple.',
    ),
    new Artiste(
        'Théodore',
        'Géricault',
        'Français',
        '1791',
        'Précurseur du romantisme, connu pour Le Radeau de la Méduse.',
    ),
    new Artiste(
        'Caspar David',
        'Friedrich',
        'Allemand',
        '1774',
        'Peintre romantique célèbre pour ses paysages spirituels.',
    ),
    new Artiste(
        'Claude',
        'Monet',
        'Français',
        '1840',
        'Fondateur de l’impressionnisme, célèbre pour ses Nymphéas.',
    ),
    new Artiste(
        'Edgar',
        'Degas',
        'Français',
        '1834',
        'Peintre impressionniste, connu pour ses danseuses de ballet.',
    ),
    new Artiste(
        'Pierre-Auguste',
        'Renoir',
        'Français',
        '1841',
        'Peintre impressionniste, maître des scènes joyeuses et colorées.',
    ),
    new Artiste(
        'Mary',
        'Cassatt',
        'Américaine',
        '1844',
        'Peintre impressionniste, spécialisée dans les scènes de maternité.',
    ),
    new Artiste(
        'Pablo',
        'Picasso',
        'Espagnol',
        '1881',
        'Pionnier du cubisme et de l’art moderne.',
    ),
    new Artiste(
        'Georges',
        'Braque',
        'Français',
        '1882',
        'Cofondateur du cubisme avec Picasso.',
    ),
    new Artiste(
        'Henri',
        'Matisse',
        'Français',
        '1869',
        'Chef de file du fauvisme, maître de la couleur et des formes.',
    ),
    new Artiste(
        'Wassily',
        'Kandinsky',
        'Russe',
        '1866',
        'Pionnier de l’art abstrait, théoricien de la couleur.',
    ),
    new Artiste(
        'Jean-Michel',
        'Basquiat',
        'Américain',
        '1960',
        'Artiste néo-expressionniste influencé par le street art.',
    ),
    new Artiste(
        'Banksy',
        '',
        'Britannique',
        'inconnu',
        'Artiste de rue anonyme, célèbre pour ses œuvres engagées.',
    ),
    new Artiste(
        'Yayoi',
        'Kusama',
        'Japonaise',
        '1929',
        'Artiste contemporaine connue pour ses pois et installations immersives.',
    ),
    new Artiste(
        'Ai',
        'Weiwei',
        'Chinois',
        '1957',
        'Artiste et dissident politique chinois, engagé pour les droits humains.',
    ),


  ]



  constructor() { }

  getAllArtistes() {
      return this.artistes;
  }

  getArtisteByName(nom: string, prenom: string): Artiste | undefined {
      return this.artistes.find(artiste => artiste.nomArtiste === nom && artiste.prenomArtiste === prenom);
  }
}
