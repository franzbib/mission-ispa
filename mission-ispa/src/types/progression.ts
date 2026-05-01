import type { CharacterState, PedagogicalTrack } from './gameState';

export type StatName = keyof CharacterState['stats'] | keyof CharacterState['conditions'];

export type UnlockCondition =
  | { type: "missionCompleted"; missionId: string }
  | { type: "missionsCompleted"; missionIds: string[]; mode: "all" | "any"; count?: number }
  | { type: "itemOwned"; itemId: string }
  | { type: "statAtLeast"; stat: StatName; value: number }
  | { type: "statBelow"; stat: StatName; value: number }
  | { type: "narrativeLevelReached"; level: number }
  | { type: "chapterReached"; chapterId: string }
  | { type: "locationUnlocked"; locationId: string }
  | { type: "courseUnlocked"; courseId: string }
  | { type: "missionGroupCompleted"; groupId: string; count?: number }
  | { type: "missionsCompletedInGroup"; groupId: string; count: number };

export type UnlockReward =
  | { type: "unlockMission"; missionId: string }
  | { type: "unlockLocation"; locationId: string }
  | { type: "discoverLocation"; locationId: string }
  | { type: "unlockCourse"; courseId: string }
  | { type: "giveItem"; itemId: string }
  | { type: "advanceNarrativeLevel"; level: number }
  | { type: "unlockMissionGroup"; groupId: string };

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  narrativeSummary: string;
  order: number;
}

export interface NarrativeLevel {
  id: string;
  number: 1 | 2 | 3;
  title: string;
  subtitle: string;
  description: string;
  entryConditions: UnlockCondition[];
  unlockedLocations: string[];
  discoveredLocations: string[];
  mainMissionGroups: Record<PedagogicalTrack, string>;
  nodeMissionId: Record<PedagogicalTrack, string>;
}

export interface MissionGroup {
  id: string;
  title: string;
  description: string;
  requiredCompletedCount: number;
  missionIds: string[];
  unlocksWhenCompleted: UnlockReward[];
  narrativeLevelUnlocked?: number;
}

export type LocationVisibilityState = "hidden" | "discovered" | "unlocked" | "completed";

export type MissionPriority = "main" | "side" | "remediation" | "exploration" | "node";

export interface ItemData {
  id: string;
  name: string;
  description: string;
  iconType: 'document' | 'key' | 'id-card' | 'book' | 'generic';
  color?: string;
}

export interface LocationData {
  id: string;
  name: string;
  cx: number;
  cy: number;
  color: string;
  icon: string;
  labelOffsetX?: number;
  labelOffsetY?: number;
  labelAnchor?: "start" | "middle" | "end";
  labelPosition?: "top" | "bottom" | "left" | "right";
  descriptionBeforeDiscovery?: string;
  descriptionWhenLocked?: string;
  descriptionWhenUnlocked: string;
  revealConditions?: UnlockCondition[];
  unlockConditions?: UnlockCondition[];
}

export interface Course {
  id: string;
  title: string;
  type: string;
  level: string;
  description: string;
  teacherNpcId: string;
  skills: string[];
  unlockConditions?: UnlockCondition[];
  relatedMissions?: string[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarStyle?: string;
  icon?: string;
}
