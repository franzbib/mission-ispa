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
      { type: 'missionGroupCompleted', groupId: 'installation-ispa' }
    ],
    unlockedLocations: ['salle_fou', 'certifications', 'multimedia', 'cafe_etudiants', 'bu', 'orientation', 'cathedrale', 'lys_dor'],
    discoveredLocations: [],
    mainMissionGroups: ['autonomie-ispa']
  },
  3: {
    id: 'niveau_3',
    number: 3,
    title: 'Niveau 3',
    subtitle: 'Réviser autrement',
    description: 'Après avoir consolidé son autonomie universitaire, l\'étudiant accède à la salle de jeu, un espace où les compétences linguistiques peuvent être travaillées sous forme de défis rapides.',
    entryConditions: [
      { type: 'narrativeLevelReached', level: 2 },
      { type: 'missionCompleted', missionId: 'm15_fiche_orientation' }
    ],
    unlockedLocations: ['salle_jeu'],
    discoveredLocations: [],
    mainMissionGroups: []
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
    ]
  },
  'installation-ispa-a2-b1': {
    id: 'installation-ispa-a2-b1',
    title: 'Installation ISPA (A2/B1)',
    description: 'Comprendre les documents simples, valider le dossier, repérer les salles.',
    requiredCompletedCount: 5,
    missionIds: [
      'm1_accueil_delphine_a2',
      'm4_premier_cours_a2',
      'm2_dossier_incomplet_a2',
      'm5_emploi_du_temps_a2',
      'm6_reglement_absences_a2',
      'm7_message_francois_a2',
      'm3_justificatif_oublie_a2'
    ],
    unlocksWhenCompleted: [
      { type: 'advanceNarrativeLevel', level: 2 }
    ]
  },
  'autonomie-ispa': {
    id: 'autonomie-ispa',
    title: 'Vers l\'Autonomie',
    description: 'Participer aux cours avancés et à la vie universitaire.',
    requiredCompletedCount: 4,
    missionIds: [
      'm9_introduction_fou',
      'm10_tableau_certifications',
      'm11_convocation_tcf',
      'm12_message_mathias',
      'm13_activite_yaqiu',
      'm14_mail_margaux',
      'm15_fiche_orientation'
    ],
    unlocksWhenCompleted: [
      { type: 'advanceNarrativeLevel', level: 3 }
    ]
  },
  'autonomie-ispa-a2-b1': {
    id: 'autonomie-ispa-a2-b1',
    title: 'Autonomie ISPA (A2/B1)',
    description: 'Comprendre des documents de la vie universitaire et de la vie quotidienne.',
    requiredCompletedCount: 5,
    missionIds: [
      'm9_introduction_fou_a2',
      'm10_tableau_certifications_a2',
      'm11_convocation_tcf_a2',
      'm12_message_mathias_a2',
      'm13_activite_yaqiu_a2',
      'm15_fiche_orientation_a2'
    ],
    unlocksWhenCompleted: [
      { type: 'advanceNarrativeLevel', level: 3 }
    ]
  }
};
