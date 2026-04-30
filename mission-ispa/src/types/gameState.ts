export interface CharacterState {
  name: string;
  profile: string;
  level: 'A2' | 'B1' | 'B2';
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
  completedMissions: string[];
  currentChapterId: string;
  currentNarrativeLevel: number;
}
