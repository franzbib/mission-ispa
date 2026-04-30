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
