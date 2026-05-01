import type { LocationData } from '../types/progression';

export const LOCATIONS: LocationData[] = [
  // ==========================================
  // Pôle Accueil ISPA (Centre-Haut)
  // ==========================================
  { 
    id: 'ispa', 
    name: 'ISPA Accueil', 
    cx: 400, 
    cy: 160, 
    labelOffsetY: -45,
    color: '#d97706', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    descriptionWhenUnlocked: 'L\'accueil de l\'ISPA. Le premier contact pour s\'orienter.',
    unlockConditions: []
  },
  { 
    id: 'secretariat', 
    name: 'Secrétariat', 
    cx: 500, 
    cy: 160, 
    labelOffsetY: -45,
    color: '#0284c7', 
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    descriptionWhenLocked: 'Tu dois d\'abord lire le message d\'accueil avant de venir ici.',
    descriptionWhenUnlocked: 'Ici, on valide ton dossier administratif.',
    revealConditions: [],
    unlockConditions: [{ type: "missionCompleted", missionId: "m1_accueil_delphine" }]
  },
  { 
    id: 'hall', 
    name: 'Hall ISPA', 
    cx: 400, 
    cy: 260, 
    labelOffsetY: 45,
    color: '#f59e0b', 
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    descriptionWhenUnlocked: 'Le grand hall avec les panneaux d\'affichage et les emplois du temps.',
    unlockConditions: []
  },

  // ==========================================
  // Pôle Salles de cours ISPA (Gauche)
  // ==========================================
  { 
    id: 'salle_jules_verne', 
    name: 'Salle Jules Verne', 
    cx: 180, 
    cy: 220, 
    labelAnchor: 'end',
    labelOffsetX: -35,
    labelOffsetY: 0,
    color: '#10b981', 
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    descriptionWhenLocked: 'Tu ne sais pas encore dans quelle salle tu as cours.',
    descriptionWhenUnlocked: 'Salle dédiée notamment à la Compréhension Écrite.',
    revealConditions: [],
    unlockConditions: [{ type: "missionCompleted", missionId: "m4_premier_cours" }]
  },
  { 
    id: 'salle_beffroi', 
    name: 'Salle Beffroi', 
    cx: 250, 
    cy: 140, 
    labelAnchor: 'end',
    labelOffsetX: -35,
    labelOffsetY: 0,
    color: '#10b981', 
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    descriptionWhenLocked: 'Tu ne sais pas encore dans quelle salle tu as cours.',
    descriptionWhenUnlocked: 'Salle dédiée à la Grammaire et à la structure.',
    revealConditions: [],
    unlockConditions: [{ type: "missionCompleted", missionId: "m4_premier_cours" }]
  },
  { 
    id: 'salle_hortillonnages', 
    name: 'Salle Hortillonnages', 
    cx: 250, 
    cy: 290, 
    labelOffsetY: 45,
    color: '#10b981', 
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    descriptionWhenLocked: 'Tu ne sais pas encore dans quelle salle tu as cours.',
    descriptionWhenUnlocked: 'Anciennement le Labo Langues, salle dédiée à la Phonétique.',
    revealConditions: [],
    unlockConditions: [{ type: "missionCompleted", missionId: "m4_premier_cours" }]
  },
  { 
    id: 'salle_cathedrale', 
    name: 'Salle Cathédrale', 
    cx: 150, 
    cy: 290, 
    labelAnchor: 'end',
    labelOffsetX: -35,
    labelOffsetY: 0,
    color: '#10b981', 
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    descriptionWhenLocked: 'Tu ne sais pas encore dans quelle salle tu as cours.',
    descriptionWhenUnlocked: 'Grande salle pour des cours magistraux ou projets.',
    revealConditions: [],
    unlockConditions: [{ type: "missionCompleted", missionId: "m4_premier_cours" }]
  },
  { 
    id: 'salle_gambetta', 
    name: 'Salle Gambetta', 
    cx: 320, 
    cy: 310, 
    labelOffsetY: 45,
    color: '#10b981', 
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    descriptionWhenLocked: 'Tu ne sais pas encore dans quelle salle tu as cours.',
    descriptionWhenUnlocked: 'Salle de réunion ou d\'examens officiels.',
    revealConditions: [],
    unlockConditions: [{ type: "missionCompleted", missionId: "m4_premier_cours" }]
  },

  // ==========================================
  // Niveau 2 - Autonomie et Extérieurs
  // ==========================================
  { 
    id: 'salle_fou', 
    name: 'Salle FOU', 
    cx: 310, 
    cy: 140, 
    labelAnchor: 'start',
    labelOffsetX: 35,
    labelOffsetY: 0,
    color: '#c026d3', 
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    descriptionWhenLocked: 'Réservé aux étudiants du Niveau 2.',
    descriptionWhenUnlocked: 'Salle dédiée au Français sur Objectif Universitaire.',
    revealConditions: [{ type: "narrativeLevelReached", level: 2 }],
    unlockConditions: [{ type: "narrativeLevelReached", level: 2 }]
  },
  { 
    id: 'certifications', 
    name: 'Espace Certifications', 
    cx: 620, 
    cy: 160, 
    labelOffsetY: 45,
    color: '#eab308', 
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    descriptionWhenLocked: 'Débloqué au Niveau 2.',
    descriptionWhenUnlocked: 'Informations TCF, DELF, DALF.',
    revealConditions: [{ type: "narrativeLevelReached", level: 2 }],
    unlockConditions: [{ type: "narrativeLevelReached", level: 2 }]
  },
  { 
    id: 'orientation', 
    name: 'Bureau Orientation', 
    cx: 500, 
    cy: 260, 
    labelOffsetY: 45,
    color: '#06b6d4', 
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    descriptionWhenLocked: 'Débloqué au Niveau 2.',
    descriptionWhenUnlocked: 'Aide à la poursuite d\'études supérieures.',
    revealConditions: [{ type: "narrativeLevelReached", level: 2 }],
    unlockConditions: [{ type: "narrativeLevelReached", level: 2 }]
  },

  // ==========================================
  // Ville / Périphérie
  // ==========================================
  { 
    id: 'crous', 
    name: 'Logement (CROUS)', 
    cx: 100, 
    cy: 550, 
    labelOffsetY: -45,
    color: '#8b5cf6', 
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    descriptionWhenUnlocked: 'Ta chambre d\'étudiant. Tu y gères tes papiers et tes mails personnels.',
    unlockConditions: []
  },
  { 
    id: 'cafe_etudiants', 
    name: 'Café des Étudiants', 
    cx: 400, 
    cy: 550, 
    labelOffsetY: 45,
    color: '#10b981', 
    icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z',
    descriptionWhenLocked: 'Débloqué au Niveau 2.',
    descriptionWhenUnlocked: 'Lieu de rencontre et de détente.',
    revealConditions: [{ type: "narrativeLevelReached", level: 2 }],
    unlockConditions: [{ type: "narrativeLevelReached", level: 2 }]
  },
  { 
    id: 'lys_dor', 
    name: 'Lys d\'Or', 
    cx: 280, 
    cy: 480, 
    labelAnchor: 'end',
    labelOffsetX: -35,
    labelOffsetY: 0,
    color: '#ef4444', 
    icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z',
    descriptionWhenLocked: 'Débloqué au Niveau 2.',
    descriptionWhenUnlocked: 'Un excellent restaurant asiatique très apprécié des étudiants.',
    revealConditions: [{ type: "narrativeLevelReached", level: 2 }],
    unlockConditions: [{ type: "narrativeLevelReached", level: 2 }]
  },
  { 
    id: 'bu', 
    name: 'Bibliothèque Universitaire', 
    cx: 900, 
    cy: 120, 
    labelOffsetY: 45,
    color: '#3b82f6', 
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    descriptionWhenLocked: 'Débloqué au Niveau 2.',
    descriptionWhenUnlocked: 'Un temple du silence et du savoir.',
    revealConditions: [{ type: "narrativeLevelReached", level: 2 }],
    unlockConditions: [{ type: "narrativeLevelReached", level: 2 }]
  },
  { 
    id: 'cathedrale', 
    name: 'Cathédrale', 
    cx: 850, 
    cy: 550, 
    labelAnchor: 'start',
    labelOffsetX: 35,
    labelOffsetY: 0,
    color: '#ec4899', 
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    descriptionWhenLocked: 'Débloqué au Niveau 2.',
    descriptionWhenUnlocked: 'Lieu des sorties culturelles proposées par l\'ISPA.',
    revealConditions: [{ type: "narrativeLevelReached", level: 2 }],
    unlockConditions: [{ type: "narrativeLevelReached", level: 2 }]
  },

  // ==========================================
  // Niveau 3 - Gamification
  // ==========================================
  { 
    id: 'salle_jeu', 
    name: 'Salle de jeu', 
    cx: 700, 
    cy: 350, 
    labelAnchor: 'start',
    labelOffsetX: 35,
    labelOffsetY: 0,
    color: '#ef4444', 
    icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    descriptionWhenLocked: 'Tu as entendu parler d\'une salle étrange où les étudiants peuvent réviser autrement, mais elle n\'est pas encore accessible.',
    descriptionWhenUnlocked: 'La salle de jeu rassemble des mini-jeux d\'arcade pédagogiques. On y révise le français en jouant.',
    revealConditions: [{ type: "narrativeLevelReached", level: 3 }],
    unlockConditions: [{ type: "narrativeLevelReached", level: 3 }]
  }
];
