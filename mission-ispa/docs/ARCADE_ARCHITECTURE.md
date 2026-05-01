# Architecture Arcade : Mission ISPA

## 1. Philosophie du Système
L'objectif est d'intégrer des mini-jeux pédagogiques (Arcade) à l'intérieur du RPG "Mission ISPA" de manière propre et non-intrusive. 
L'architecture garantit que :
- Le moteur principal du jeu (missions, progression) ne soit pas ralenti ou altéré.
- Les scores des mini-jeux soient persistés dans le profil du joueur.
- L'extension avec de nouveaux mini-jeux (internes ou externes) soit simple (data-driven).

## 2. Typage Fort (`src/types/arcade.ts`)
Les types définis garantissent une structure cohérente :
- `ArcadeGameMetadata` : Contient toutes les infos sur un jeu (id, titre, pédagogie, condition de déblocage).
- `ArcadeGameStatus` :
  - `planned` : Affiche "Bientôt disponible" dans l'UI.
  - `external` : Lance un jeu hébergé ailleurs dans un nouvel onglet (ex: Vercel).
  - `internal` : (Futur) Chargera un composant React interne.
- `ArcadeScore` et `MiniGameResult` : Gèrent l'historique des parties.

## 3. Évolution du GameState (`src/engine/gameState.ts`)
L'état Zustand `CharacterState` intègre désormais une propriété optionnelle :
```typescript
arcade?: {
  scores: ArcadeScore[];
  bestScores: Record<string, ArcadeScore>;
}
```
*Note : Cette propriété est initialisée dynamiquement au premier enregistrement de score pour ne pas casser la rétrocompatibilité des sauvegardes locales existantes.*

## 4. Moteur Dédié (`src/engine/arcadeEngine.ts`)
Un moteur léger est dédié à l'arcade. Il lit le state global et le tableau de données pour :
- Filtrer les jeux disponibles (`getAvailableArcadeGames`).
- Calculer et retourner les meilleurs scores (`getBestScore`).
- (Futur) Calculer les récompenses (`computeArcadeRewards`).

## 5. Composant UI Principal : `ArcadeHub.tsx`
Ce composant s'affiche dynamiquement dans `LocationModal` si le lieu sélectionné est `salle_jeu`. Il n'ajoute donc pas de complexité à la carte interactive existante.

## 6. Prochaines Étapes / Limites
- **Sécurité et Triche** : Si un jeu externe envoie un score, il faudra un mécanisme sécurisé (postMessage ou URL parameters chiffrés) si l'on souhaite vraiment intégrer les scores validés dans le `gameState`.
- **Récompenses** : Relier `computeArcadeRewards` au système d'items ou de stats une fois le modèle de scoring stabilisé.
