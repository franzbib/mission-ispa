import type { CharacterState } from "./gameState";
import type { UnlockCondition, MissionPriority, UnlockReward } from "./progression";

export interface StatEffect {
  target: keyof CharacterState['stats'] | keyof CharacterState['conditions'];
  amount: number;
}

export interface Choice {
  id: string;
  text: string;
  isCorrect?: boolean;
  feedback?: string;
  effects: StatEffect[];
  unlocksLocation?: string;
  givesItem?: string;
}

export interface MissionStep {
  id: string;
  question: string;
  choices: Choice[];
  correctSelection?: string[];
  correctOrder?: string[];
}

export type MissionType =
  | "singleChoice"
  | "multiStep"
  | "multiSelect"
  | "ordering"
  | "documentComparison"
  | "inventorySelection"
  | "guidedCloze"
  | "consequenceChoice";

export interface MissionDocument {
  title: string;
  sourceType: string;
  body: string;
  bodyZh?: string;
  visualStyle?: 'mail' | 'paper' | 'poster' | 'note';
}

export interface Mission {
  id: string;
  title: string;
  level: "A2" | "B1" | "B2";
  narrativeLevel?: 1 | 2 | 3;
  chapterId?: string; // Keep for backward compatibility or optional narrative flow
  arcId?: string;
  missionGroupId?: string;
  locationId: string;
  
  missionType: MissionType;
  type: "mail" | "affiche" | "document" | "dialogue" | "dossier"; // Keeping existing type for backward compat
  
  difficulty: 1 | 2 | 3 | 4 | 5;
  narrativePriority?: MissionPriority;
  isNodeMission?: boolean;
  isNodeQuest?: boolean; // Backward compat
  
  narrativeContext: string;
  narrativeContextZh?: string;
  
  // Documents
  document?: MissionDocument;
  documents?: MissionDocument[];
  
  // Simple question structure (for singleChoice)
  question?: string;
  questionZh?: string;
  choices?: Choice[];
  
  // Complex question structures
  steps?: MissionStep[];
  correctSelection?: string[]; // For multiSelect (array of choice ids)
  correctOrder?: string[]; // For ordering (array of choice ids)
  
  // Progression
  optionalGroupId?: string;
  prerequisites?: UnlockCondition[];
  unlocksWhenCompleted?: UnlockReward[];
  unlocks?: {
    missions?: string[];
    locationsToDiscover?: string[];
    locationsToUnlock?: string[];
    items?: string[];
    chapter?: string;
  };
  
  requiredItems?: string[];
  requiredStats?: { stat: keyof CharacterState['stats'], min: number }[];
  
  // Feedback and effects for complex missions
  successEffects?: StatEffect[];
  failureEffects?: StatEffect[];
  partialSuccessEffects?: StatEffect[];
  
  tags: string[];
  pedagogicalFocus?: string[];
  grammarFocus?: string[];
  lexicalFocus?: string[];
  realWorldAnchor?: string;
  estimatedDuration?: number;
}
