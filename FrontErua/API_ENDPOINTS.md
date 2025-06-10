# Documentation des Endpoints API

## Vue d'ensemble
Cette documentation décrit les endpoints disponibles dans le backend et leur utilisation côté frontend.

## Base URL
```
http://127.0.0.1:5000
```

## Endpoints Artistes

### GET /artistes/
Récupère tous les artistes avec filtres optionnels.

**Paramètres de requête (optionnels):**
- `nom`: Nom de l'artiste
- `nationalite`: Nationalité de l'artiste
- `naissance`: Année de naissance
- `genre`: Genre de l'artiste
- `description`: Description de l'artiste

**Exemple d'utilisation:**
```typescript
// Sans filtres
const artistes = await this.artisteService.getArtistes();

// Avec filtres
const artistes = await this.artisteService.getArtistes({
  nationalite: 'Française',
  genre: 'Peintre'
});
```

### GET /artistes/{id}
Récupère un artiste par son ID.

**Exemple d'utilisation:**
```typescript
const artiste = await this.artisteService.getArtisteById(1);
```

### POST /artistes/
Crée un nouvel artiste.

**Corps de la requête:**
```json
{
  "nom": "Nom de l'artiste",
  "nationalite": "Française",
  "naissance": 1850,
  "genre": "Peintre",
  "description": "Description de l'artiste"
}
```

**Exemple d'utilisation:**
```typescript
const nouvelArtiste = await this.artisteService.createArtiste({
  nom: "Vincent van Gogh",
  nationalite: "Néerlandais",
  naissance: 1853,
  genre: "Peintre",
  description: "Artiste post-impressionniste"
});
```

### PUT /artistes/{id}
Met à jour un artiste existant.

**Exemple d'utilisation:**
```typescript
const artisteModifie = await this.artisteService.updateArtiste(1, {
  description: "Nouvelle description"
});
```

### DELETE /artistes/{nom}
Supprime un artiste par son nom.

**Exemple d'utilisation:**
```typescript
const supprime = await this.artisteService.deleteArtiste("Nom de l'artiste");
```

## Endpoints Œuvres

### GET /oeuvres/
Récupère toutes les œuvres avec filtres optionnels.

**Paramètres de requête (optionnels):**
- `nom`: Nom de l'œuvre
- `date_creation`: Date de création
- `genre`: Genre de l'œuvre
- `dimensions`: Dimensions de l'œuvre
- `mouvement`: Mouvement artistique
- `type`: Type d'œuvre

**Exemple d'utilisation:**
```typescript
// Sans filtres
const oeuvres = await this.oeuvreService.getOeuvres();

// Avec filtres
const oeuvres = await this.oeuvreService.getOeuvres({
  genre: "Peinture",
  mouvement: "Impressionnisme"
});
```

### GET /oeuvres/{id}
Récupère une œuvre par son ID.

**Exemple d'utilisation:**
```typescript
const oeuvre = await this.oeuvreService.getOeuvreById(1);
```

### POST /oeuvres/
Crée une nouvelle œuvre.

**Corps de la requête:**
```json
{
  "nom": "Nom de l'œuvre",
  "date_creation": 1889,
  "genre": "Peinture",
  "dimensions": "73.7 x 92.1 cm",
  "mouvement": "Post-impressionnisme",
  "type": "Huile sur toile"
}
```

**Exemple d'utilisation:**
```typescript
const nouvelleOeuvre = await this.oeuvreService.createOeuvre({
  nom: "La Nuit étoilée",
  date_creation: 1889,
  genre: "Peinture",
  dimensions: "73.7 x 92.1 cm",
  mouvement: "Post-impressionnisme",
  type: "Huile sur toile"
});
```

### PUT /oeuvres/{id}
Met à jour une œuvre existante.

**Exemple d'utilisation:**
```typescript
const oeuvreModifiee = await this.oeuvreService.updateOeuvre(1, {
  description: "Nouvelle description"
});
```

### DELETE /oeuvres/{id}
Supprime une œuvre par son ID.

**Exemple d'utilisation:**
```typescript
const supprime = await this.oeuvreService.deleteOeuvre(1);
```

## Endpoints Relations A_CREE

### POST /a_cree_relation/
Crée une relation A_CREE entre un artiste et une œuvre.

**Corps de la requête:**
```json
{
  "artiste_id": 1,
  "oeuvre_id": 1
}
```

**Exemple d'utilisation:**
```typescript
const relation = await this.relationService.createCreationRelation(1, 1);
```

### DELETE /a_cree_relation/
Supprime une relation A_CREE.

**Corps de la requête:**
```json
{
  "artiste_id": 1,
  "oeuvre_id": 1
}
```

**Exemple d'utilisation:**
```typescript
const supprime = await this.relationService.deleteCreationRelation(1, 1);
```

### GET /a_cree_relation/{artiste_id}
Récupère toutes les œuvres créées par un artiste.

**Exemple d'utilisation:**
```typescript
const oeuvres = await this.relationService.getOeuvresByArtiste(1);
```

## Endpoints Relations A_INFLUENCE

### POST /influence_relation/
Crée une relation d'influence entre deux œuvres.

**Corps de la requête:**
```json
{
  "source_id": 1,
  "cible_id": 2
}
```

**Exemple d'utilisation:**
```typescript
const relation = await this.relationService.createInfluenceRelation(1, 2);
```

### DELETE /influence_relation/
Supprime une relation d'influence.

**Corps de la requête:**
```json
{
  "source_id": 1,
  "cible_id": 2
}
```

**Exemple d'utilisation:**
```typescript
const supprime = await this.relationService.deleteInfluenceRelation(1, 2);
```

### GET /influence_relation/{id}
Récupère les influences d'une œuvre.

**Paramètres de requête (optionnels):**
- `node_limit`: Limite du nombre de nœuds dans les chemins d'influence (défaut: 25)

**Exemple d'utilisation:**
```typescript
// Avec limite par défaut
const influences = await this.relationService.getInfluencesByOeuvre(1);

// Avec limite personnalisée
const influences = await this.relationService.getInfluencesByOeuvre(1, 10);
```

## Services Frontend

### ArtisteService
Service dédié à la gestion des artistes.

### OeuvreService
Service dédié à la gestion des œuvres.

### RelationService
Service dédié à la gestion des relations (A_CREE et A_INFLUENCE).

### GraphDataService
Service unifié pour toutes les opérations (artistes, œuvres, relations).

## Gestion des Erreurs

Tous les services gèrent automatiquement les erreurs et retournent des valeurs appropriées :
- `null` pour les opérations de création/mise à jour qui échouent
- `false` pour les opérations de suppression qui échouent
- `[]` pour les opérations de récupération qui échouent

Les erreurs sont également loggées dans la console pour le débogage. 