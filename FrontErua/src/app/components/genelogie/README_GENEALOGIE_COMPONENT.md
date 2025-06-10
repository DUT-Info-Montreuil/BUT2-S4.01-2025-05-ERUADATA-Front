# Documentation du Composant GenelogieComponent

## Vue d'ensemble

Le `GenelogieComponent` est un composant Angular qui gère la visualisation interactive d'un graphe de généalogie artistique. Il utilise la bibliothèque `graphology` et `sigma.js` pour afficher les relations entre artistes et œuvres.

## Propriétés du composant

### Inputs
- `@Input() filtres: any = {}` - Filtres appliqués au graphe (type, mouvement, période, etc.)
- `@Input() recherche: string = ''` - Terme de recherche pour filtrer les éléments

### ViewChild
- `@ViewChild('container') containerRef!: ElementRef<HTMLDivElement>` - Référence au conteneur DOM du graphe

### Propriétés publiques
- `selectedElement: any = null` - Élément actuellement sélectionné (œuvre, artiste ou relation)
- `selectedElementType: 'oeuvre' | 'artiste' | 'relation' | null = null` - Type de l'élément sélectionné
- `showCrudPanel: boolean = false` - État d'affichage du panneau d'informations

### Propriétés privées
- `graph: Graph` - Instance du graphe graphology
- `renderer: Sigma` - Instance du renderer Sigma.js
- `selectedNode: string | null = null` - ID du nœud sélectionné
- `draggingNode: string | null = null` - ID du nœud en cours de déplacement

## Méthodes du cycle de vie

### `ngOnInit()`
**Description :** Initialise le composant au démarrage.
**Fonctionnement :**
- Appelle `setupGraph()` pour configurer le graphe et le renderer
- Charge les données depuis le backend

### `ngOnChanges(changes: SimpleChanges)`
**Description :** Réagit aux changements des propriétés d'entrée.
**Paramètres :**
- `changes` - Objet contenant les changements détectés
**Fonctionnement :**
- Vérifie si les filtres ou la recherche ont changé
- Recharge le graphe si nécessaire avec `loadGraphFromBackend()`

## Méthodes d'initialisation

### `setupGraph()`
**Description :** Configure le graphe et le renderer Sigma.js.
**Fonctionnement :**
- Crée une nouvelle instance de `Graph`
- Initialise le renderer Sigma avec les options de configuration
- Charge les données depuis le backend
- Configure les interactions utilisateur

### `loadGraphFromBackend()`
**Description :** Charge et affiche les données du graphe depuis l'API.
**Fonctionnement :**
1. Récupère les relations, artistes et œuvres depuis le service
2. Applique les filtres selon le type sélectionné :
   - **Mode "oeuvres"** : Affiche seulement les œuvres avec leurs relations
   - **Mode "artistes"** : Affiche seulement les artistes
   - **Mode mixte** : Affiche artistes et œuvres avec relations
3. Filtre les éléments selon les critères (recherche, mouvement, genre, etc.)
4. Ajoute les nœuds au graphe avec leurs attributs
5. Ajoute les arêtes (relations) entre les œuvres
6. Centre automatiquement le graphe

## Méthodes utilitaires

### `getRelationType(direction: string): string`
**Description :** Détermine le type de relation à partir de sa direction.
**Paramètres :**
- `direction` - Chaîne décrivant la direction de la relation
**Retour :** `'influence'` ou `'relation'`
**Fonctionnement :**
- Analyse la chaîne de direction
- Retourne `'influence'` si elle contient "influence" ou "descendance"
- Retourne `'relation'` par défaut

## Méthodes d'interaction

### `setupInteractions()`
**Description :** Configure tous les événements d'interaction avec le graphe.
**Fonctionnement :**
- **Drag & Drop** : Permet de déplacer les nœuds
- **Clic sur nœud** : Appelle `handleNodeClick()`
- **Clic sur arête** : Appelle `handleEdgeClick()`
- **Clic sur arrière-plan** : Appelle `clearSelection()`

### `handleNodeClick(node: string)`
**Description :** Gère le clic sur un nœud (œuvre ou artiste).
**Paramètres :**
- `node` - ID du nœud cliqué
**Fonctionnement :**
1. Récupère les attributs du nœud (type et données)
2. Met à jour les propriétés de sélection
3. Affiche le panneau d'informations
4. Met en surbrillance le nœud (couleur orange)

### `handleEdgeClick(edge: string)`
**Description :** Gère le clic sur une arête (relation).
**Paramètres :**
- `edge` - ID de l'arête cliquée
**Fonctionnement :**
1. Récupère les attributs de l'arête (source, target, type)
2. Met à jour les propriétés de sélection
3. Affiche le panneau d'informations
4. Met en surbrillance l'arête (couleur orange, taille augmentée)

### `clearSelection()`
**Description :** Efface la sélection actuelle et ferme le panneau.
**Fonctionnement :**
1. Restaure la couleur originale des éléments sélectionnés
2. Réinitialise toutes les propriétés de sélection
3. Ferme le panneau d'informations

## Méthodes d'export/import

### `exportGraph()`
**Description :** Exporte le graphe au format JSON.
**Fonctionnement :**
1. Exporte le graphe avec `graph.export()`
2. Crée un lien de téléchargement
3. Déclenche automatiquement le téléchargement du fichier

### `importGraph(event: Event)`
**Description :** Importe un graphe depuis un fichier JSON.
**Paramètres :**
- `event` - Événement de sélection de fichier
**Fonctionnement :**
1. Lit le fichier sélectionné
2. Parse le JSON
3. Importe les données dans le graphe
4. Rafraîchit l'affichage

## Méthodes de navigation

### `centrerGraphique()`
**Description :** Centre automatiquement le graphe dans la vue.
**Fonctionnement :**
1. Calcule les limites du graphe (min/max X et Y)
2. Détermine le centre et le zoom optimal
3. Anime la caméra vers la position calculée
4. Ajoute une marge pour une meilleure visibilité

## Fonctions helper internes

### `oeuvrePassesFilters(oeuvre: any): boolean`
**Description :** Vérifie si une œuvre passe les filtres appliqués.
**Paramètres :**
- `oeuvre` - Objet œuvre à vérifier
**Retour :** `true` si l'œuvre passe les filtres, `false` sinon
**Fonctionnement :**
- Vérifie la recherche textuelle dans le nom
- Vérifie le filtre de mouvement
- Vérifie le filtre de genre
- Vérifie le filtre de période (1800-1900, 1900-2000, après 2000)

### `artistePassesFilters(artiste: any): boolean`
**Description :** Vérifie si un artiste passe les filtres appliqués.
**Paramètres :**
- `artiste` - Objet artiste à vérifier
**Retour :** `true` si l'artiste passe les filtres, `false` sinon
**Fonctionnement :**
- Vérifie la recherche textuelle dans le nom
- Vérifie le filtre de nationalité

## Gestion des erreurs

Le composant gère les erreurs de plusieurs manières :
- **Try/catch** dans les méthodes asynchrones
- **Vérifications de null/undefined** avant les opérations
- **Logs console** pour le débogage
- **Messages d'alerte** pour informer l'utilisateur

## Dépendances

### Services
- `GraphDataService` - Service pour récupérer les données depuis l'API

### Bibliothèques
- `graphology` - Gestion du graphe
- `sigma.js` - Rendu du graphe
- `@angular/core` - Fonctionnalités Angular

## Utilisation

```typescript
// Dans un template parent
<app-genelogie 
  [filtres]="mesFiltres" 
  [recherche]="termeRecherche">
</app-genelogie>
```

## Notes importantes

1. **Performance** : Le graphe se recharge entièrement à chaque changement de filtre
2. **Responsive** : Le composant s'adapte aux différentes tailles d'écran
3. **Interactions** : Drag & drop et clics sont gérés de manière optimisée
4. **États** : Le composant maintient l'état de sélection et d'affichage
5. **Filtrage** : Les filtres sont appliqués côté client pour une réactivité optimale 