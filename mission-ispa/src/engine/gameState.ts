import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CharacterState } from '../types/gameState';

interface GameStore extends CharacterState {
  setName: (name: string) => void;
  setProfile: (profile: string, initialStats: CharacterState['stats']) => void;
  updateStat: (stat: keyof CharacterState['stats'], amount: number) => void;
  updateCondition: (condition: keyof CharacterState['conditions'], amount: number) => void;
  unlockLocation: (locationId: string) => void;
  completeMission: (missionId: string) => void;
  advanceChapter: (chapterId: string) => void;
  advanceNarrativeLevel: (level: number) => void;
  addItem: (itemId: string) => void;
  resetGame: () => void;
}

const initialState: CharacterState = {
  name: '',
  profile: '',
  level: 'B1',
  stats: {
    comprehension: 10,
    grammar: 10,
    lexicon: 10,
    autonomy: 10,
    sociability: 10,
    organization: 10,
  },
  conditions: {
    energy: 100,
    stress: 0,
    money: 50,
    reputation: 0,
  },
  inventory: [],
  unlockedLocations: ['ispa', 'bu', 'ru'], // Lieux par défaut (sera ignoré si calculé via engine, mais on garde pour rétrocompatibilité temporaire)
  completedMissions: [],
  currentChapterId: 'prologue',
  currentNarrativeLevel: 1,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,
      setName: (name) => set({ name }),
      setProfile: (profile, initialStats) => set({ profile, stats: initialStats }),
      updateStat: (stat, amount) => set((state) => ({
        stats: { ...state.stats, [stat]: state.stats[stat] + amount }
      })),
      updateCondition: (condition, amount) => set((state) => {
        let newValue = state.conditions[condition] + amount;
        if (condition === 'energy' || condition === 'stress') {
          newValue = Math.max(0, Math.min(100, newValue));
        }
        return { conditions: { ...state.conditions, [condition]: newValue } };
      }),
      unlockLocation: (locationId) => set((state) => ({
        unlockedLocations: [...new Set([...state.unlockedLocations, locationId])]
      })),
      completeMission: (missionId) => set((state) => {
        // Find mission to check for unlocks (chapter, items, etc)
        // Since we cannot easily import MISSIONS here due to circular deps or store logic,
        // we handle unlocks via effects or in the MissionModal before calling completeMission.
        // Actually, we can just record it here. The UI will use advanceChapter explicitly if needed.
        return {
          completedMissions: [...new Set([...state.completedMissions, missionId])]
        };
      }),
      advanceChapter: (chapterId) => set({ currentChapterId: chapterId }),
      advanceNarrativeLevel: (level) => set({ currentNarrativeLevel: level }),
      addItem: (itemId) => set((state) => ({
        inventory: [...new Set([...state.inventory, itemId])]
      })),
      resetGame: () => set(initialState),
    }),
    {
      name: 'mission-ispa-save',
    }
  )
);
