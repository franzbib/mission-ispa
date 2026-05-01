# État du Projet "Mission ISPA" pour les LLMs (ChatGPT, Claude, etc.)

> **Note aux LLMs** : Lisez toujours ce fichier avant de commencer une tâche sur ce dépôt. Il résume l'architecture, les fonctionnalités en place et les règles métier pour éviter toute régression.

## 1. Contexte du Projet
"Mission ISPA" est un RPG pédagogique FLE/FOU (Français Langue Étrangère / Français sur Objectif Universitaire) développé en **React + Vite + TypeScript**.
Le joueur incarne un étudiant international arrivant à l'ISPA (Amiens) et doit s'installer, valider son dossier, puis acquérir de l'autonomie universitaire.

## 2. Architecture & Technologies
- **Stack** : Vite, React 18, TypeScript, TailwindCSS, Zustand (State Management), Framer Motion (Animations).
- **Point d'entrée du code métier** : Dossier `src/engine/` (Moteur de progression) et `src/data/` (Données statiques).
- **Structure des données** :
  - `missions.ts` : Définit toutes les missions, leurs textes et leurs choix.
  - `locations.ts` : Définit les lieux de la carte, leurs coordonnées et leurs conditions de déblocage (cadenas).
  - `narrativeLevels.ts` : Groupes de missions et niveaux narratifs (Niveau 1, Niveau 2, etc.).
  - `items.ts` : Catalogue des objets gagnables par le joueur.
  - `unlockEngine.ts` : Le cœur du moteur gérant les dépendances logiques (prérequis).
  - `gameState.ts` : Le store Zustand (`useGameStore`) stockant le nom, niveau, track pédagogique, stats, inventaire et missions terminées.

## 3. Fonctionnalités Actuelles (Implémentées)
1. **Création de Personnage** : Choix du nom, du profil (impacte les stats de base) et du **parcours pédagogique** (A2/B1 guidé OU B1/B2 autonomie).
2. **Carte Interactive** : Affichage des lieux avec positionnement et offsets. Les cadenas s'ouvrent dynamiquement selon la progression.
3. **Missions Interactives (QCM, Multi-étapes, Comparaison)** :
   - Supporte des choix avec feedbacks et conséquences sur les statistiques (Ex: +2 en Stress, +5 en Autonomie).
   - Les missions B1/B2 et A2/B1 sont séparées par IDs distincts (ex: `m1_accueil_delphine` vs `m1_accueil_delphine_a2`).
4. **Inventaire du Joueur ("Sac à dos")** :
   - Accessible via le profil du joueur (fenêtre modale).
   - Affiche les documents débloqués (ex: `liste_pieces`, `carte_etudiant`, `emploi_du_temps`).
   - Le moteur donne les objets via la condition de récompense `giveItem`.
5. **Niveau 1 Terminé** : Les deux parcours (A2/B1 et B1/B2) ont leur chaîne de missions fonctionnelle jusqu'à la validation du dossier.

## 4. Règles Cruciales (À ne pas briser)
- **Typage Strict** : Ne pas bypasser le compilateur TypeScript. Utilisez les interfaces dans `src/types/`. Exécutez `npm run build` après modification.
- **Séparation des Parcours** : Ne **JAMAIS** faire dépendre un lieu ou une mission A2/B1 d'un ID de mission B1/B2. Utilisez toujours `missionsCompleted` avec le `mode: 'any'` pour les lieux communs (ex: `{ type: "missionsCompleted", missionIds: ["m1", "m1_a2"], mode: "any" }`).
- **Styles** : Toujours utiliser TailwindCSS. Ne pas ajouter de CSS inline sauf pour des positionnements dynamiques (offsets de la carte).

## 5. Prochaines Étapes Envisagées (Roadmap)
- **La Salle d'Arcade (Niveau 3)** : Création d'un système de mini-jeux internes, dont le "Jeu des Verbes" (composant React isolé).
- **Système d'Indices** : Permettre au joueur de demander de l'aide lors d'une mission (contre une pénalité de stat).
- **Poursuite du Scénario** : Remplir davantage le Niveau 2 (Méthodologie, Certifications, etc.).

*(Fichier mis à jour automatiquement à chaque grande évolution architecturale)*
