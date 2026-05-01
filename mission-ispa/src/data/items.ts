export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ITEMS: Record<string, Item> = {
  plan_amiens: {
    id: 'plan_amiens',
    name: 'Plan d\'Amiens',
    description: 'Une carte détaillée de la ville avec les lignes de bus Amétis.',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
  },
  carte_etudiant: {
    id: 'carte_etudiant',
    name: 'Carte Étudiante ISPA',
    description: 'Votre sésame pour accéder à la BU, au café des étudiants et au cours de FOU.',
    icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2'
  },
  carnet_vocabulaire: {
    id: 'carnet_vocabulaire',
    name: 'Carnet de vocabulaire',
    description: 'Un petit carnet pour noter les expressions françaises utiles.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  liste_pieces: {
    id: 'liste_pieces',
    name: 'Fiche des pièces manquantes',
    description: 'Une note du secrétariat listant les pièces nécessaires pour finaliser votre dossier : une photo d\'identité et une assurance.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  emploi_du_temps: {
    id: 'emploi_du_temps',
    name: 'Emploi du temps',
    description: 'Le planning de vos cours à l\'ISPA. Indispensable pour savoir dans quelle salle vous rendre.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  }
};
