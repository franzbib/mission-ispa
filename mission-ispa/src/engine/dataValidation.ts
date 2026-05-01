import { MISSIONS } from '../data/missions';
import { LOCATIONS } from '../data/locations';
import { CHAPTERS } from '../data/chapters';

/**
 * Validateur de données exécuté au démarrage en mode développement.
 * Il vérifie la cohérence des relations entre entités (lieux, missions, chapitres)
 * pour éviter les plantages silencieux dus aux fautes de frappe.
 */
export function validateGameData(): void {
  if (!import.meta.env.DEV) return;

  console.log('--- Début de la validation des données du jeu ---');
  let errors = 0;

  // 1. Vérification des Lieux
  const locationIds = new Set<string>();
  LOCATIONS.forEach(loc => {
    if (locationIds.has(loc.id)) {
      console.warn(`[VALIDATION ERROR] Lieu dupliqué: ${loc.id}`);
      errors++;
    }
    locationIds.add(loc.id);
  });

  // 2. Vérification des Missions
  const missionIds = new Set<string>();
  MISSIONS.forEach(mission => {
    if (missionIds.has(mission.id)) {
      console.warn(`[VALIDATION ERROR] Mission dupliquée: ${mission.id}`);
      errors++;
    }
    missionIds.add(mission.id);

    // Vérifier l'existence du locationId
    if (mission.locationId && !locationIds.has(mission.locationId)) {
      console.warn(`[VALIDATION ERROR] Mission "${mission.id}" réfère à un lieu inexistant: "${mission.locationId}"`);
      errors++;
    }

    // Vérifier les chapitres
    if (mission.chapterId && !CHAPTERS[mission.chapterId]) {
      console.warn(`[VALIDATION ERROR] Mission "${mission.id}" réfère à un chapitre inexistant: "${mission.chapterId}"`);
      errors++;
    }

    // Vérifier la cohérence des choix multiSelect / ordering
    if (mission.correctSelection || mission.correctOrder) {
      const allChoicesIds = new Set((mission.choices || []).map(c => c.id));
      const targetList = mission.correctSelection || mission.correctOrder || [];
      targetList.forEach(cId => {
        if (!allChoicesIds.has(cId)) {
          console.warn(`[VALIDATION ERROR] Mission "${mission.id}" a une réponse attendue invalide: "${cId}" ne fait pas partie de ses choix.`);
          errors++;
        }
      });
    }
  });

  // 3. Vérification croisée des prérequis
  MISSIONS.forEach(mission => {
    if (mission.prerequisites) {
      mission.prerequisites.forEach(prereq => {
        if (prereq.type === 'missionCompleted' && !missionIds.has(prereq.missionId)) {
          console.warn(`[VALIDATION ERROR] Mission "${mission.id}" a un prérequis vers une mission inexistante: "${prereq.missionId}"`);
          errors++;
        }
        if (prereq.type === 'missionsCompleted') {
          prereq.missionIds.forEach(id => {
            if (!missionIds.has(id)) {
              console.warn(`[VALIDATION ERROR] Mission "${mission.id}" a un prérequis de groupe vers une mission inexistante: "${id}"`);
              errors++;
            }
          });
        }
      });
    }
  });

  if (errors === 0) {
    console.log('--- ✅ Toutes les données sont cohérentes ---');
  } else {
    console.log(`--- ❌ ${errors} erreurs de cohérence trouvées dans les données ---`);
  }
}
