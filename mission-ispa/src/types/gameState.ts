import type { ArcadeScore } from './arcade';

export type PedagogicalTrack = 'a2-b1' | 'b1-b2';

export interface CharacterState {
  name: string;
  profile: string;
  level: 'A2' | 'B1' | 'B2';
  pedagogicalTrack?: PedagogicalTrack;
  stats: {
    comprehension: number;
    grammar: number;
    lexicon: number;
    autonomy: number;
    sociability: number;
    organization: number;
  };
  conditions: {
    energy: number;
    stress: number;
    money: number;
    reputation: number;
  };
  inventory: string[];
  unlockedCourses: string[];
  // Conserved for backward compatibility with older saves and legacy actions.
  // The current source of truth for location visibility is unlockEngine.ts,
  // using revealConditions/unlockConditions from locations.ts.
  unlockedLocations: string[];
  completedMissions: string[];
  currentChapterId: string;
  currentNarrativeLevel: number;
  arcade?: {
    scores: ArcadeScore[];
    bestScores: Record<string, ArcadeScore>;
    unlockedArcadeGames?: string[];
  };
}
