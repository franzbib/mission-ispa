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
  - `narrativeLevels.ts` : Groupes de missions et niveaux narratifs (Niveau 1, Niveau 2, etc.). Configure les groupes selon la piste (`Record<PedagogicalTrack, string>`).
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
5. **Niveaux 1 et 2 Terminés** : 
   - Le Niveau 1 (Installation ISPA) est complet pour les pistes A2/B1 et B1/B2.
   - Le Niveau 2 (Autonomie ISPA) est complet pour les pistes A2/B1 et B1/B2.
6. **Moteur Track-Aware** : Le composant `CharacterModal.tsx` et les interfaces de `progression.ts` gèrent dynamiquement la piste du joueur sans conditions en dur grâce au typage `Record<PedagogicalTrack, string>`.

## 4. Règles Cruciales (À ne pas briser)
- **Typage Strict** : Ne pas bypasser le compilateur TypeScript. Utilisez les interfaces dans `src/types/`. Exécutez `npm run build` après modification.
- **Séparation des Parcours** : Ne **JAMAIS** faire dépendre un lieu ou une mission A2/B1 d'un ID de mission B1/B2. Utilisez toujours `missionsCompleted` avec le `mode: 'any'` pour les lieux communs (ex: `{ type: "missionsCompleted", missionIds: ["m1", "m1_a2"], mode: "any" }`).
- **Composants Dynamiques** : Utilisez la structure `currentLevel.mainMissionGroups[track]` pour récupérer un groupe, plutôt que d'écrire des vérifications statiques `if (track === 'a2-b1')`.

## 5. POINT DE REPRISE / PROCHAINE ÉTAPE
**La prochaine évolution majeure est la construction du NIVEAU 3 : La Salle d'Arcade.**
- Il s'agira de développer un composant React de mini-jeu "Jeu des Verbes" accessible depuis un nouveau lieu (`salle_jeu`).
- Le `NARRATIVE_LEVELS[3]` (dans `narrativeLevels.ts`) possède déjà la structure "Track-Aware" prête pour accueillir les IDs des missions de boss/arcade.

*(Fichier mis à jour automatiquement à chaque grande évolution architecturale)*
