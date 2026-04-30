import type { NarrativeLevel, MissionGroup } from '../types/progression';

export const NARRATIVE_LEVELS: Record<number, NarrativeLevel> = {
  1: {
    id: 'niveau_1',
    number: 1,
    title: 'Niveau 1',
    subtitle: 'Arriver, comprendre, s\'installer',
    description: 'Vous venez d\'arriver à Amiens. Vous devez comprendre les informations essentielles, régulariser votre dossier et découvrir les premiers cours.',
    entryConditions: [],
    unlockedLocations: ['ispa', 'crous', 'gare'],
    discoveredLocations: [],
    mainMissionGroups: ['installation-ispa']
  },
  2: {
    id: 'niveau_2',
    number: 2,
    title: 'Niveau 2',
    subtitle: 'Devenir autonome à l\'ISPA',
    description: 'Vous n\'êtes plus seulement un nouvel arrivant. Entrez dans la formation : cours FOU, méthodologie, certifications, et activités culturelles.',
    entryConditions: [
      { type: 'missionCompleted', missionId: 'm8_validation_dossier' }
    ],
    unlockedLocations: ['salle_fou', 'certifications', 'multimedia', 'cafe_etudiants', 'bu', 'orientation', 'cathedrale'],
    discoveredLocations: [],
    mainMissionGroups: ['autonomie-ispa']
  }
};

export const MISSION_GROUPS: Record<string, MissionGroup> = {
  'installation-ispa': {
    id: 'installation-ispa',
    title: 'Installation à l\'ISPA',
    description: 'Comprendre les premiers documents, régulariser son dossier, se repérer dans l\'école et entrer dans les cours.',
    requiredCompletedCount: 5,
    missionIds: [
      'm1_accueil_delphine',
      'm4_premier_cours',
      'm2_dossier_incomplet',
      'm5_emploi_du_temps',
      'm6_reglement_absences',
      'm7_message_francois',
      'm3_justificatif_oublie'
    ],
    unlocksWhenCompleted: [
      { type: 'advanceNarrativeLevel', level: 2 }
    ],
    narrativeLevelUnlocked: 2
  }
};
