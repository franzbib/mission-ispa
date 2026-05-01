# Comment Ajouter du Contenu (V2 - Réalité ISPA)

L'architecture de **Mission ISPA** est totalement orientée données (Data-Driven). Pour modifier le jeu, vous n'avez pas besoin de toucher au code de l'interface (React) ou de la sauvegarde (Zustand).

Tout se passe dans le dossier `src/data/`.

## 1. Ajouter une Mission (`src/data/missions.ts`)

Pour créer une mission, ajoutez un objet dans le tableau `MISSIONS`.

### Les nouveautés de la V2
- **`missionType`** : Vous pouvez désormais utiliser `singleChoice` (par défaut), `multiSelect` (plusieurs cases à cocher), `multiStep` (étapes séquentielles) ou `documentComparison` (affichage de plusieurs documents côte à côte).
- **`narrativeLevel`** : Remplace l'ancien système de chapitres. Une mission définie pour le `narrativeLevel: 2` n'apparaîtra pas tant que le joueur est au Niveau 1, même si le lieu est débloqué.
- **`missionGroupId`** : Permet de rattacher la mission à un grand groupe (ex: `installation-ispa`).
- **`isNodeMission`** : Indique que cette mission est un "nœud" obligatoire pour avancer.

### Exemple d'une mission `multiSelect` :
```typescript
{
  id: 'm_exemple_multiselect',
  title: 'Choix de cours',
  narrativeLevel: 2,
  locationId: 'salle_fou',
  level: 'B1',
  missionType: 'multiSelect',
  type: 'document',
  difficulty: 2,
  narrativeContext: 'Sélectionnez les cours qui vous intéressent.',
  document: { ... },
  question: 'Quels cours sont obligatoires ?',
  choices: [
    { id: 'c1', text: 'FOU', effects: [] },
    { id: 'c2', text: 'Théâtre', effects: [] },
    { id: 'c3', text: 'Compréhension Écrite', effects: [] }
  ],
  correctSelection: ['c1', 'c3'], // Les ID des choix qui DOIVENT être cochés
  successEffects: [{ target: 'autonomy', amount: 2 }],
  failureEffects: [{ target: 'stress', amount: 5 }]
}
```

### Exemple d'une mission `multiStep` :
```typescript
{
  id: 'm_exemple_multistep',
  title: 'Exercice FOU',
  // ...
  missionType: 'multiStep',
  document: { ... },
  steps: [
    {
      id: 's1',
      question: 'Question 1 ?',
      choices: [ { id: 'c1', text: 'Oui', isCorrect: true, effects: [] }, { id: 'c2', text: 'Non' } ]
    },
    {
      id: 's2',
      question: 'Question 2 ?',
      choices: [ { id: 'c1', text: 'A', isCorrect: true, effects: [] }, { id: 'c2', text: 'B' } ]
    }
  ]
}
```

## Les Types de Missions (`missionType`)

Voici la liste des types de missions actuellement **implémentés et fonctionnels** dans le moteur :

### 1. `singleChoice` (Choix unique)
Le joueur lit un document et répond à une question simple avec plusieurs choix, dont un seul est correct.
- **Champs requis** : `question`, `choices`.

### 2. `multiSelect` (Choix multiple)
Le joueur doit cocher plusieurs informations correctes parmi une liste.
- **Champs requis** : un tableau `steps` avec des `choices`, ou bien des `choices` à la racine, et impérativement le champ `correctSelection: ["id_c1", "id_c3"]`.

### 3. `ordering` (Mise en ordre)
Le joueur doit classer des éléments dans le bon ordre chronologique ou logique.
- **Champs requis** : `choices` et le tableau `correctOrder: ["id_c2", "id_c1", "id_c3"]`.

### 4. `multiStep` (Plusieurs étapes)
Une mission découpée en plusieurs sous-questions successives.
- **Champs requis** : tableau `steps` (où chaque step contient `question` et `choices`).

### 5. `documentComparison` (Comparaison)
Le joueur doit trouver une différence ou associer des informations entre deux documents.
- **Champs requis** : un tableau de `documents` au lieu d'un seul `document`, plus une structure `singleChoice` pour la réponse.

> [!NOTE]
> Types de missions **prévus pour le futur** : `inventorySelection`, `guidedCloze`, `consequenceChoice`.

## Parcours Pédagogiques (Tracks)

Le jeu propose deux parcours parallèles :
- `a2-b1` : Parcours guidé pour consolider les bases.
- `b1-b2` : Parcours vers l'autonomie universitaire.

Pour assigner une mission à un ou plusieurs parcours, utilisez le champ `tracks` :

```typescript
{
  id: "m_exemple",
  title: "Exemple",
  level: "A2", // Conservé à titre indicatif
  tracks: ["a2-b1"], // Visible uniquement dans le parcours A2/B1
  // ...
}
```

> [!NOTE]
> Si le champ `tracks` n'est **pas défini**, le moteur considérera par défaut que la mission appartient au parcours `b1-b2` (ce qui assure la rétrocompatibilité des anciennes missions).

### Créer une mission commune
Si une mission doit être accessible à la fois dans les deux parcours (ex: une mission de la salle d'arcade), ajoutez les deux valeurs :
```typescript
  tracks: ["a2-b1", "b1-b2"],
```

### Associer une mission à une salle précise
À partir de la V2, le pôle "Salles de cours" générique n'existe plus. Vous devez lier la mission au `locationId` spécifique d'une salle :
- `salle_beffroi` (Grammaire)
- `salle_cathedrale` (Projets / FOU)
- `salle_gambetta` (Réunions / Certifications)
- `salle_hortillonnages` (Phonétique / Labo)
- `salle_jules_verne` (Compréhension Écrite)
- `salle_fou` (Niveau 2)

## 2. Définir un Groupe de Missions (`src/data/narrativeLevels.ts`)

Les niveaux sont gérés par des groupes de missions.

```typescript
export const MISSION_GROUPS: Record<string, MissionGroup> = {
  'mon-groupe': {
    id: 'mon-groupe',
    title: 'Mon groupe de missions',
    requiredCompletedCount: 3, // Il faut réussir 3 missions sur les 5 ci-dessous
    missionIds: ['m1', 'm2', 'm3', 'm4', 'm5'],
    unlocksWhenCompleted: [
      { type: 'advanceNarrativeLevel', level: 3 }
    ]
  }
};
```

## 3. Conditions de Déblocage (Prerequisites)

Vous pouvez verrouiller une mission, un lieu, ou un niveau grâce aux conditions. Les plus courantes :
- `{ type: "missionCompleted", missionId: "id_mission" }`
- `{ type: "missionsCompletedInGroup", groupId: "installation-ispa", count: 5 }`
- `{ type: "statAtLeast", stat: "comprehension", value: 10 }`
- `{ type: "narrativeLevelReached", level: 2 }`

Si vous inventez une condition absente du type `UnlockCondition`, ajoutez-la d'abord dans `src/types/progression.ts`, puis gérez sa logique de validation dans `src/engine/unlockEngine.ts` (fonction `evaluateCondition`).

## 4. Ajouter un Mini-Jeu d'Arcade (`src/data/arcadeGames.ts`)

Pour le Niveau 3 (Gamification), l'architecture des mini-jeux est prévue dans le fichier `src/data/arcadeGames.ts`.

Pour ajouter un nouveau mini-jeu :
1. Ajoutez un objet `ArcadeGameMetadata` dans la constante `ARCADE_GAMES`.
2. Définissez le statut selon votre besoin :
   - `external` : pour un jeu hébergé ailleurs (nécessite `externalUrl`).
   - `planned` : pour un jeu prévu (affichera "Bientôt disponible").
   - `internal` : (futur) pour un jeu React codé dans `src/components/arcade/games/`.
3. Configurez les conditions de déblocage avec le champ `unlockConditions` (ex: `{ type: "narrativeLevelReached", level: 3 }`).
4. À terme, les scores pourront être utilisés comme prérequis de mission (ex: `{ type: "arcadeBestScoreAtLeast", gameId: "jeu-verbes", score: 1000 }` - *à implémenter dans unlockEngine.ts*).
