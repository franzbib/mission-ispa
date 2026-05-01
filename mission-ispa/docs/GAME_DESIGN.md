# Game Design Document : Mission ISPA (V2 - Réalité ISPA)

## 1. Concept Fondamental
**Mission ISPA** est un RPG narratif et pédagogique "Serious Game" visant à faciliter l'intégration linguistique et culturelle des étudiants étrangers en France, en s'inspirant de la véritable offre de l'ISPA à Amiens.

## 1.1 Philosophie et Cible
Le jeu est conçu pour de jeunes adultes (étudiants internationaux) arrivant en France. L'ambiance est mature, pragmatique et centrée sur des tâches réelles et utiles (Français sur Objectif Spécifique / Universitaire).

### Deux Parcours Pédagogiques (Tracks)
Afin de ne pas proposer une expérience générique, le joueur choisit un "Parcours" au début du jeu :
- **A2/B1 (Parcours guidé)** : Vocabulaire plus simple, consignes directes, grammaire de base consolidée (présent, futur proche, obligations simples).
- **B1/B2 (Parcours autonomie)** : Textes longs, implicite, discours rapporté, Français sur Objectif Universitaire (FOU), et méthodologie avancée.

Ces deux parcours coexistent dans le même moteur. Les lieux de la ville sont mutualisés, mais les missions proposées à l'intérieur s'adaptent dynamiquement au parcours choisi.

## 2. Boucle de Gameplay
1. **Exploration** : Le joueur navigue sur une carte de la ville/du campus.
2. **Identification** : Le joueur repère les lieux accessibles et les missions prioritaires (principales ou secondaires).
3. **Résolution** : Le joueur tente de résoudre un problème linguistique ou pratique lié à une mission (plusieurs formats possibles).
4. **Récompense** : Le joueur gagne des statistiques, des objets, ou débloque la suite de l'histoire.
5. **Progression** : La complétion d'un groupe de missions clés permet d'évoluer d'un "Niveau Narratif" à un autre.

## 3. Progression Narrative (Les Niveaux)

La progression n'est plus linéaire par "Chapitres" mais repose sur des **Niveaux Narratifs** vastes, débloqués par l'accomplissement d'un **Groupe de Missions** (MissionGroup).

### Niveau 1 : Arriver, comprendre, s'installer
- **Objectif** : Régulariser le dossier administratif, comprendre les premiers plannings.
- **Lieux Initiaux** : ISPA (Accueil), Hall, CROUS (Logement), Salles de cours nommées (Beffroi, Cathédrale, Gambetta, Hortillonnages, Jules Verne), Secrétariat.
- **Groupe bloquant** : "Installation ISPA" (Nécessite de valider 5 missions sur 7 + la mission Nœud "Validation du dossier").

### Niveau 2 : Devenir Autonome
- **Objectif** : Entrer dans les cours de spécialité (FOU, Prépa TCF) et s'ouvrir à la vie étudiante.
- **Lieux Débloqués** : Salle FOU, Espace Certifications, BU, Café des Étudiants, Cathédrale, Bureau Orientation.
- **Thématiques** : Français Universitaire, Certifications, Culture, Orientation.

### Niveau 3 : Gamification et Révisions (En cours de développement)
- **Objectif** : Travailler des compétences ciblées par le jeu.
- **Lieux Débloqués** : Salle de jeu.
- **Thématiques** : Défis syntaxiques, corticaux, lexicaux via des mini-jeux d'arcade (Tetris grammatical, etc.).

## 4. Typologie des Missions

Pour s'adapter à la réalité des apprentissages (FLE/FOU), le jeu propose plusieurs formats de résolution :

1. **singleChoice** : QCM classique (une seule bonne réponse).
2. **multiStep** : Enchaînement de plusieurs questions sur un même document.
3. **multiSelect** : Sélection de plusieurs réponses correctes simultanément (ex: "Cochez les documents à fournir").
4. **documentComparison** : Analyse de deux documents distincts affichés côte à côte pour trouver une information.

*D'autres formats pourront être ajoutés (ordering, guidedCloze) sans casser la base technique.*

## 5. Personnages (PNJ)
Les PNJ sont inspirés des fonctions réelles de l'ISPA (sans être des copies biographiques exactes) :
- **Delphine P.** : Administratif et accueil.
- **Margaux H.** : Responsable pédagogique (FOU, Méthodologie).
- **François C.** : Enseignant exigeant (Compréhension écrite).
- **Yaqiu L.** : Responsable parascolaire (Activités culturelles).

## 6. Mécanique de Déblocage (UnlockEngine)
Le fichier `src/engine/unlockEngine.ts` est le cœur du jeu. Il lit les dépendances (prerequisites) et détermine la visibilité :
- **Lieu Caché (hidden)** : N'apparaît pas sur la carte.
- **Lieu Découvert (discovered)** : Apparaît grisé, avec une explication textuelle du blocage.
- **Lieu Débloqué (unlocked)** : Cliquable, affiche les missions à l'intérieur.

Les verrous sont scénarisés ("Tu dois d'abord comprendre le message d'accueil" plutôt que "Condition non remplie").
