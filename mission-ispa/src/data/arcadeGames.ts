import type { ArcadeGameMetadata } from '../types/arcade';

export const ARCADE_GAMES: ArcadeGameMetadata[] = [
  {
    id: "jeu-verbes",
    title: "Jeu des verbes",
    subtitle: "Réviser les temps verbaux en mode arcade",
    description: "Un mini-jeu de rapidité pour reconnaître les temps verbaux et classer les formes conjuguées.",
    status: "external",
    externalUrl: "https://jeu-verbes.vercel.app/",
    kind: "verbs",
    cefrLevels: ["A2", "B1", "B2"],
    pedagogicalFocus: ["conjugaison", "temps verbaux", "reconnaissance rapide"],
    grammarFocus: ["présent", "passé composé", "imparfait", "futur", "conditionnel"],
    unlockConditions: [{ type: "narrativeLevelReached", level: 3 }],
    rewardPolicyId: "verbs-basic",
    tags: ["grammaire", "rapidité", "verbes"]
  },
  {
    id: "tetris-grammatical",
    title: "Tetris grammatical",
    description: "Classer rapidement des formes linguistiques dans les bonnes catégories.",
    status: "planned",
    kind: "grammar",
    cefrLevels: ["A2", "B1", "B2"],
    pedagogicalFocus: ["catégories grammaticales", "syntaxe"],
    unlockConditions: [{ type: "narrativeLevelReached", level: 3 }],
    tags: ["grammaire", "réflexes"]
  },
  {
    id: "arcade-lexicale",
    title: "Arcade lexicale",
    description: "Réviser les champs lexicaux utiles à la vie universitaire.",
    status: "planned",
    kind: "lexicon",
    cefrLevels: ["A2", "B1"],
    pedagogicalFocus: ["vocabulaire universitaire", "logement", "démarches"],
    unlockConditions: [{ type: "narrativeLevelReached", level: 3 }],
    tags: ["lexique", "vocabulaire"]
  },
  {
    id: "defi-fou",
    title: "Défi FOU",
    description: "Identifier rapidement des consignes, des registres et des types de documents universitaires.",
    status: "planned",
    kind: "methodology",
    cefrLevels: ["B2"],
    pedagogicalFocus: ["FOU", "méthodologie", "registres"],
    unlockConditions: [{ type: "narrativeLevelReached", level: 3 }],
    tags: ["fou", "université"]
  }
];
