import type { CharacterState } from '../types/gameState';
import type { UnlockCondition, LocationVisibilityState } from '../types/progression';
import type { Mission } from '../types/mission';
import { MISSIONS } from '../data/missions';
import { CHAPTERS } from '../data/chapters';
import { LOCATIONS } from '../data/locations';

export function evaluateCondition(condition: UnlockCondition, gameState: CharacterState): boolean {
  switch (condition.type) {
    case 'missionCompleted':
      return gameState.completedMissions.includes(condition.missionId);
    
    case 'missionsCompleted': {
      const completedCount = condition.missionIds.filter(id => gameState.completedMissions.includes(id)).length;
      if (condition.mode === 'all') return completedCount === condition.missionIds.length;
      if (condition.mode === 'any') return completedCount >= (condition.count || 1);
      return false;
    }
    
    case 'itemOwned':
      return gameState.inventory.includes(condition.itemId);
      
    case 'statAtLeast': {
      // Check if it's a stat or condition
      let value = 0;
      if (condition.stat in gameState.stats) {
        value = gameState.stats[condition.stat as keyof typeof gameState.stats];
      } else if (condition.stat in gameState.conditions) {
        value = gameState.conditions[condition.stat as keyof typeof gameState.conditions];
      }
      return value >= condition.value;
    }
    case 'statBelow': {
      let value = 0;
      if (condition.stat in gameState.stats) {
        value = gameState.stats[condition.stat as keyof typeof gameState.stats];
      } else if (condition.stat in gameState.conditions) {
        value = gameState.conditions[condition.stat as keyof typeof gameState.conditions];
      }
      return value < condition.value;
    }
      
    case 'narrativeLevelReached':
      return gameState.currentNarrativeLevel >= condition.level;

    case 'chapterReached': {
      const targetChapter = CHAPTERS[condition.chapterId];
      const currentChapter = CHAPTERS[gameState.currentChapterId];
      if (!targetChapter || !currentChapter) return false;
      return currentChapter.order >= targetChapter.order;
    }
      
    case 'locationUnlocked':
      return getLocationState(condition.locationId, gameState) === 'unlocked' || getLocationState(condition.locationId, gameState) === 'completed';

    case 'courseUnlocked':
      return (gameState.unlockedCourses || []).includes(condition.courseId);

    case 'missionsCompletedInGroup': {
       const groupMissions = MISSIONS.filter(m => m.missionGroupId === condition.groupId || m.optionalGroupId === condition.groupId);
       const completedInGroup = groupMissions.filter(m => gameState.completedMissions.includes(m.id)).length;
       return completedInGroup >= condition.count;
    }

    case 'missionGroupCompleted': {
       const groupMissions = MISSIONS.filter(m => m.optionalGroupId === condition.groupId || m.missionGroupId === condition.groupId);
       const completedInGroup = groupMissions.filter(m => gameState.completedMissions.includes(m.id)).length;
       return completedInGroup >= (condition.count || groupMissions.length);
    }

    default:
      return false;
  }
}

export function isMissionInCurrentTrack(mission: Mission, gameState: CharacterState): boolean {
  const currentTrack = gameState.pedagogicalTrack || 'b1-b2';
  
  if (mission.tracks && mission.tracks.length > 0) {
    return mission.tracks.includes(currentTrack);
  }
  
  // Par défaut, l'absence de 'tracks' signifie que c'est une mission B1/B2
  return currentTrack === 'b1-b2';
}

export function isMissionAvailable(mission: Mission, gameState: CharacterState): boolean {
  // Check pedagogical track
  if (!isMissionInCurrentTrack(mission, gameState)) return false;

  // If completed, it's not "available" to be played again in this UI
  if (gameState.completedMissions.includes(mission.id)) return false;
  
  // Check narrative level sequence
  if (mission.narrativeLevel && mission.narrativeLevel > gameState.currentNarrativeLevel) {
    return false;
  }

  // Check chapter sequence (backward compatibility)
  if (mission.chapterId && !mission.narrativeLevel) {
    const missionChap = CHAPTERS[mission.chapterId];
    const currentChap = CHAPTERS[gameState.currentChapterId];
    if (missionChap && currentChap && missionChap.order > currentChap.order) return false;
  }

  // Check custom prerequisites
  if (!mission.prerequisites || mission.prerequisites.length === 0) return true;
  return mission.prerequisites.every(cond => evaluateCondition(cond, gameState));
}

export function getLocationState(locationId: string, gameState: CharacterState): LocationVisibilityState {
  const loc = LOCATIONS.find(l => l.id === locationId);
  if (!loc) return 'hidden';

  // Check if all main missions in location are completed (optional enhancement)
  // For now, check if ANY mission exists and ALL are completed
  const locMissions = MISSIONS.filter(m => m.locationId === locationId);
  const allMissionsCompleted = locMissions.length > 0 && locMissions.every(m => gameState.completedMissions.includes(m.id));

  // Check unlock conditions
  let isUnlocked = true;
  if (loc.unlockConditions && loc.unlockConditions.length > 0) {
    isUnlocked = loc.unlockConditions.every(cond => evaluateCondition(cond, gameState));
  }

  if (isUnlocked) {
    return allMissionsCompleted ? 'completed' : 'unlocked';
  }

  // Check reveal conditions
  let isDiscovered = false;
  if (loc.revealConditions && loc.revealConditions.length > 0) {
    isDiscovered = loc.revealConditions.every(cond => evaluateCondition(cond, gameState));
  } else if (!loc.unlockConditions || loc.unlockConditions.length === 0) {
     isDiscovered = true;
  }

  return isDiscovered ? 'discovered' : 'hidden';
}

export function getMissingRequirementsLabel(conditions: UnlockCondition[] | undefined, gameState: CharacterState): string {
  if (!conditions || conditions.length === 0) return "";
  
  for (const cond of conditions) {
    if (!evaluateCondition(cond, gameState)) {
      switch (cond.type) {
        case 'missionCompleted': {
          const m = MISSIONS.find(m => m.id === cond.missionId);
          return `Nécessite la mission "${m?.title || 'inconnue'}".`;
        }
        case 'statAtLeast':
          return `Demande plus de ${cond.stat} (${cond.value} requis).`;
        case 'itemOwned':
          return `Il te manque un objet important.`;
        case 'chapterReached':
          return `Avance dans l'histoire principale.`;
        case 'locationUnlocked': {
           const l = LOCATIONS.find(l => l.id === cond.locationId);
           return `Tu dois avoir accès à : ${l?.name || 'un autre lieu'}.`;
        }
        case 'statBelow':
          return `Il faut avoir moins de ${cond.value} en ${cond.stat}.`;
        case 'narrativeLevelReached':
          return `Atteignez le Niveau ${cond.level} pour débloquer.`;
        case 'courseUnlocked':
          return `Un cours doit être débloqué.`;
        case 'missionsCompletedInGroup':
          return `Nécessite de terminer ${cond.count} mission(s) du groupe.`;
        case 'missionsCompleted':
          return `Termine d'abord d'autres missions.`;
        case 'missionGroupCompleted':
          return `Nécessite plus d'expérience dans ce domaine.`;
        default:
          return `Conditions non remplies.`;
      }
    }
  }
  return "Inaccessible pour le moment.";
}
