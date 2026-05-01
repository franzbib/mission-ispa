import type { UnlockCondition } from './progression';

export type ArcadeGameStatus = "planned" | "external" | "internal" | "disabled";

export type ArcadeGameKind = "verbs" | "grammar" | "lexicon" | "reading" | "methodology" | "mixed";

export interface ArcadeGameMetadata {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  status: ArcadeGameStatus;
  kind: ArcadeGameKind;
  externalUrl?: string;
  internalComponentKey?: string;
  cefrLevels: ("A2" | "B1" | "B2")[];
  pedagogicalFocus: string[];
  grammarFocus?: string[];
  lexicalFocus?: string[];
  unlockConditions: UnlockCondition[];
  rewardPolicyId?: string;
  estimatedDurationMinutes?: number;
  tags: string[];
}

export interface ArcadeScore {
  gameId: string;
  playedAt: string;
  score: number;
  maxScore?: number;
  accuracy?: number;
  durationSeconds?: number;
  level?: "A2" | "B1" | "B2";
  details?: Record<string, unknown>;
}

export interface ArcadeRewardPolicy {
  id: string;
  description: string;
  thresholds: ArcadeRewardThreshold[];
}

export interface ArcadeRewardThreshold {
  minScore?: number;
  minAccuracy?: number;
  rewards: ArcadeReward[];
}

export interface ArcadeReward {
  type: "statEffect" | "conditionEffect" | "giveItem" | "unlockMission" | "unlockBadge";
  target?: string;
  amount?: number;
  itemId?: string;
  missionId?: string;
  badgeId?: string;
}

export interface MiniGameResult {
  gameId: string;
  score: number;
  maxScore?: number;
  accuracy?: number;
  durationSeconds?: number;
  level?: "A2" | "B1" | "B2";
  details?: Record<string, unknown>;
}
