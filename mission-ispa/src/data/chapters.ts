import type { Chapter } from '../types/progression';

export const CHAPTERS: Record<string, Chapter> = {
  prologue: {
    id: 'prologue',
    title: 'Prologue',
    subtitle: 'Bienvenue à Amiens',
    narrativeSummary: 'Arriver et comprendre où aller pour finaliser votre inscription.',
    order: 0
  },
  chap1: {
    id: 'chap1',
    title: 'Chapitre 1',
    subtitle: 'Le dossier administratif',
    narrativeSummary: 'Il faut régulariser votre situation avant de profiter de la vie étudiante.',
    order: 1
  },
  chap2: {
    id: 'chap2',
    title: 'Chapitre 2',
    subtitle: 'Devenir étudiant autonome',
    narrativeSummary: 'La Bibliothèque et le Resto U sont désormais vos nouveaux repères.',
    order: 2
  },
  chap3: {
    id: 'chap3',
    title: 'Chapitre 3',
    subtitle: 'Comprendre les autres',
    narrativeSummary: 'Les relations avec les camarades et les professeurs nécessitent quelques ajustements culturels.',
    order: 3
  },
  chap4: {
    id: 'chap4',
    title: 'Chapitre 4',
    subtitle: 'Lire pour réussir',
    narrativeSummary: 'Préparation aux exigences universitaires et découverte du patrimoine.',
    order: 4
  },
  final: {
    id: 'final',
    title: 'Épilogue',
    subtitle: 'Préparer l\'évaluation',
    narrativeSummary: 'Dernière ligne droite avant le bilan de compétences.',
    order: 5
  }
};
