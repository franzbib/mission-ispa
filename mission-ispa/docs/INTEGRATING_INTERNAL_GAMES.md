# Guide d'Intégration d'un Mini-Jeu Interne

Ce guide explique comment transformer un mini-jeu externe (comme le **Jeu des Verbes**) en un composant interne complètement intégré au système de scores de "Mission ISPA".

## Étape 1 : Préparation du composant

1. **Créer le dossier** : Dans votre projet, créez un dossier dédié aux mini-jeux : `src/components/arcade/games/`.
2. **Importer les fichiers** : Copiez les fichiers de votre jeu externe (composants React, styles, utilitaires) dans ce nouveau dossier (ex: `src/components/arcade/games/JeuVerbes/`).
3. **Isoler les dépendances** : Vérifiez que le mini-jeu n'utilise pas de routeur ou de store global qui entrerait en conflit avec Zustand ou React Router de Mission ISPA. L'état du jeu doit idéalement être géré par des hooks locaux (`useState`, `useReducer`).

## Étape 2 : Adapter le composant pour "Mission ISPA"

Votre composant principal du jeu (ex: `JeuVerbes.tsx`) doit pouvoir communiquer son résultat à l'application principale une fois la partie terminée.

Ajoutez des `props` à votre composant pour qu'il puisse :
- Informer quand le joueur a terminé la partie.
- Informer quand le joueur souhaite fermer le mini-jeu.

**Exemple de modification du composant de jeu :**

```tsx
import type { MiniGameResult } from '../../../../types/arcade';

interface JeuVerbesProps {
  onGameEnd: (result: MiniGameResult) => void;
  onCloseGame: () => void;
}

export default function JeuVerbes({ onGameEnd, onCloseGame }: JeuVerbesProps) {
  // ... logique de votre jeu ...

  const handleGameOver = (finalScore: number, finalAccuracy: number) => {
    // 1. Appeler la fonction fournie par Mission ISPA
    onGameEnd({
      gameId: 'jeu-verbes',
      score: finalScore,
      maxScore: 1000, // Optionnel
      accuracy: finalAccuracy, // Optionnel
      durationSeconds: 120, // Optionnel
      level: 'B1' // Optionnel
    });
  };

  return (
    <div className="jeu-verbes-container">
      <button onClick={onCloseGame}>Quitter le jeu</button>
      {/* Rendu de votre jeu */}
    </div>
  );
}
```

## Étape 3 : Modifier le fichier de données

Allez dans `src/data/arcadeGames.ts` et modifiez le statut du jeu de `external` à `internal`. 
Ajoutez également une clé unique pour l'identifier côté interface.

```typescript
{
  id: "jeu-verbes",
  title: "Jeu des verbes",
  // ... autres champs
  status: "internal", // On passe de "external" à "internal"
  internalComponentKey: "JeuVerbes", // Clé pour charger le bon composant
  // externalUrl n'est plus nécessaire
}
```

## Étape 4 : Mettre à jour l'ArcadeHub

Dans `src/components/arcade/ArcadeHub.tsx`, il faut ajouter la logique pour afficher le mini-jeu en plein écran (ou dans la modale) au lieu d'ouvrir un nouvel onglet.

1. Importez votre composant :
```tsx
import JeuVerbes from './games/JeuVerbes/JeuVerbes';
```

2. Ajoutez un état pour savoir quel jeu est en cours :
```tsx
const [activeGameId, setActiveGameId] = useState<string | null>(null);
const { recordArcadeScore } = useGameStore(state => state);
```

3. Créez les fonctions de gestion (Handler) :
```tsx
const handleGameEnd = (result: MiniGameResult) => {
  recordArcadeScore(result);
  // Optionnel : afficher un écran de résultat ou une popup de récompense
};
```

4. Affichage conditionnel dans l'`ArcadeHub` :
```tsx
if (activeGameId === 'jeu-verbes') {
  return (
    <JeuVerbes 
      onGameEnd={handleGameEnd} 
      onCloseGame={() => setActiveGameId(null)} 
    />
  );
}
```

Et voilà ! Votre mini-jeu est maintenant complètement absorbé dans l'écosystème "Mission ISPA". Ses scores seront sauvegardés dans le `gameState` et pourront être utilisés comme conditions de réussite pour de futures missions.
