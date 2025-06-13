# Module de Généalogie Artistique

Ce module permet de visualiser et d'explorer les relations entre artistes et leurs œuvres à travers un graphe interactif. Il offre une représentation visuelle des influences artistiques et des créations, permettant de comprendre les connexions entre différents éléments du monde artistique.

## Fonctionnalités Principales

### 1. Visualisation du Graphe
- **Représentation Interactive** : Utilisation de la bibliothèque Sigma.js pour une visualisation dynamique et interactive du graphe
- **Types de Nœuds** :
  - Artistes (représentés par des nœuds spécifiques)
  - Œuvres (représentées par des nœuds distincts)
- **Types de Relations** :
  - Relations d'influence entre œuvres
  - Relations de création (artiste → œuvre)
  - Relations générales entre éléments

### 2. Filtrage et Recherche
- **Filtres par Type** :
  - Vue des œuvres uniquement
  - Vue des artistes uniquement
  - Vue mixte (œuvres et artistes)
- **Filtres de Relations** :
  - Affichage/masquage des influences
  - Affichage/masquage des relations de création
  - Filtrage par période, style, ou autres critères

### 3. Interaction avec le Graphe
- **Navigation** :
  - Zoom in/out
  - Déplacement du graphe
  - Sélection d'éléments
- **Actions sur les Nœuds** :
  - Cliquer pour voir les détails
  - Glisser-déposer pour réorganiser
  - Mise en évidence des connexions

### 4. Panneau d'Informations
- **Détails des Artistes** :
  - Nom et prénom
  - Nationalité
  - Genre artistique
  - Description
- **Détails des Œuvres** :
  - Titre
  - Date de création
  - Description
  - Informations contextuelles
- **Détails des Relations** :
  - Type de relation
  - Direction
  - Poids de l'influence
  - Contexte historique

### 5. Fonctionnalités Avancées
- **Exportation** : Possibilité d'exporter le graphe dans différents formats
- **Édition** : Interface pour modifier les relations et les informations
- **Mise en Évidence** : Surbrillance des connexions lors de la sélection

## Utilisation Technique

### Structure des Données
- **Nœuds** : Représentent les artistes et les œuvres
- **Arêtes** : Représentent les relations entre les éléments
- **Attributs** : Stockent les informations détaillées sur chaque élément

### Types de Relations
1. **Influence** : Relation entre œuvres montrant l'influence artistique
2. **Création** : Lien entre un artiste et son œuvre
3. **Relation Générale** : Autres types de connexions entre éléments

### Gestion des Filtres
- Filtrage dynamique des nœuds et des arêtes
- Mise à jour en temps réel de la visualisation
- Persistance des filtres entre les sessions

## Bonnes Pratiques
1. Utiliser les filtres pour simplifier la visualisation
2. Explorer les relations en cliquant sur les nœuds
3. Utiliser le zoom pour naviguer dans les graphes complexes
4. Exporter les vues importantes pour référence future

## Limitations et Considérations
- Performance avec de grands ensembles de données
- Complexité de la mise en page avec de nombreuses relations
- Nécessité de données structurées et cohérentes


Je vais maintenant expliquer en détail chaque fonction du composant GenelogieComponent. Je vais les organiser par catégories pour une meilleure compréhension :

### 1. Initialisation et Configuration

#### `constructor(private graphService: GraphDataService, private router: Router)`
- **Objectif** : Initialise le composant avec les services nécessaires
- **Paramètres** : 
  - `graphService` : Service pour gérer les données du graphe
  - `router` : Service de navigation Angular

#### `ngOnInit()`
- **Objectif** : Méthode du cycle de vie Angular appelée à l'initialisation
- **Fonctionnalité** : Initialise le graphe en appelant `setupGraph()`

#### `ngOnChanges(changes: SimpleChanges)`
- **Objectif** : Réagit aux changements des propriétés d'entrée
- **Paramètres** : `changes` - Objet contenant les changements détectés
- **Fonctionnalité** : Recharge le graphe si les filtres ou la recherche changent

#### `setupGraph()`
- **Objectif** : Configure le graphe initial
- **Fonctionnalités** :
  - Crée une nouvelle instance de Graph
  - Initialise le renderer Sigma avec des options de visualisation
  - Charge les données depuis le backend
  - Configure les interactions

### 2. Construction et Gestion du Graphe

#### `loadGraphFromBackend()`
- **Objectif** : Charge les données du graphe depuis le backend
- **Fonctionnalités** :
  - Utilise `forkJoin` pour charger simultanément :
    - Les relations d'influence
    - Les artistes
    - Les œuvres
    - Les relations de création
  - Initialise le gestionnaire de filtres
  - Construit le graphe avec les données

#### `buildGraph(data: GraphData)`
- **Objectif** : Construit le graphe selon le type de vue sélectionné
- **Paramètres** : `data` - Données du graphe
- **Fonctionnalités** :
  - Gère trois types de vues : œuvres, artistes, ou mixte
  - Applique les filtres appropriés

#### `buildMixedGraph(data: GraphData)`
- **Objectif** : Construit un graphe mixte (artistes et œuvres)
- **Paramètres** : `data` - Données du graphe
- **Fonctionnalités** :
  - Filtre les artistes selon les critères
  - Ajoute les nœuds d'artistes
  - Ajoute les arêtes d'influence

#### `addOeuvreNodes(oeuvres: Oeuvre[])`
- **Objectif** : Ajoute les nœuds d'œuvres au graphe
- **Paramètres** : `oeuvres` - Liste des œuvres à ajouter
- **Fonctionnalités** :
  - Organise les œuvres en grille
  - Crée les nœuds avec leurs attributs

### 3. Gestion des Interactions

#### `setupInteractions()`
- **Objectif** : Configure toutes les interactions utilisateur
- **Fonctionnalités** :
  - Configure les interactions de glisser-déposer
  - Configure les interactions de clic

#### `setupClickInteractions()`
- **Objectif** : Configure les interactions de clic
- **Fonctionnalités** :
  - Gère les clics sur les nœuds
  - Gère les clics sur les arêtes
  - Gère les clics sur le fond

#### `handleNodeClick(node: string)`
- **Objectif** : Gère le clic sur un nœud
- **Paramètres** : `node` - Identifiant du nœud cliqué
- **Fonctionnalités** :
  - Met à jour l'élément sélectionné
  - Affiche le panneau d'informations
  - Met en évidence le nœud

#### `handleEdgeClick(edge: string)`
- **Objectif** : Gère le clic sur une arête
- **Paramètres** : `edge` - Identifiant de l'arête cliquée
- **Fonctionnalités** :
  - Met à jour l'élément sélectionné
  - Affiche le panneau d'informations
  - Met en évidence l'arête

### 4. Gestion de la Sélection et de l'Affichage

#### `clearSelection()`
- **Objectif** : Réinitialise la sélection
- **Fonctionnalités** :
  - Restaure les couleurs des nœuds
  - Restaure les couleurs des arêtes
  - Réinitialise l'état de sélection

#### `resetSelectionState()`
- **Objectif** : Réinitialise l'état de sélection
- **Fonctionnalités** :
  - Efface l'élément sélectionné
  - Réinitialise le type d'élément
  - Cache le panneau d'informations

#### `highlightNode(node: string)`
- **Objectif** : Met en évidence un nœud
- **Paramètres** : `node` - Identifiant du nœud
- **Fonctionnalité** : Change la couleur du nœud

#### `highlightEdge(edge: string)`
- **Objectif** : Met en évidence une arête
- **Paramètres** : `edge` - Identifiant de l'arête
- **Fonctionnalités** :
  - Change la couleur de l'arête
  - Augmente sa taille

### 5. Utilitaires et Export

#### `getRelationType(direction: string)`
- **Objectif** : Détermine le type de relation
- **Paramètres** : `direction` - Direction de la relation
- **Retourne** : Type de relation ('influence' ou 'relation')

#### `shouldShowRelation(relationType: string, showInfluence?: boolean, showRelations?: boolean)`
- **Objectif** : Détermine si une relation doit être affichée
- **Paramètres** :
  - `relationType` - Type de relation
  - `showInfluence` - Option d'affichage des influences
  - `showRelations` - Option d'affichage des relations
- **Retourne** : Booléen indiquant si la relation doit être affichée

#### `exportGraph()`
- **Objectif** : Exporte le graphe
- **Fonctionnalités** :
  - Convertit le graphe en JSON
  - Crée un fichier téléchargeable

#### `editGraph()`
- **Objectif** : Redirige vers la page d'édition
- **Fonctionnalité** : Navigation vers '/edition'

### 6. Getters

#### `selectedRelation`
- **Objectif** : Accesseur pour l'élément relation sélectionné
- **Retourne** : L'élément relation sélectionné ou null

Ces fonctions travaillent ensemble pour créer une expérience interactive de visualisation de graphe, permettant aux utilisateurs d'explorer et de comprendre les relations entre artistes et œuvres. Le composant utilise la bibliothèque Sigma.js pour le rendu et Graphology pour la gestion du graphe, offrant ainsi une interface performante et interactive.

Voulez-vous que je détaille davantage certains aspects particuliers de ces fonctions ?