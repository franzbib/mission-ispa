import type { Course } from '../types/progression';

export const COURSES: Course[] = [
  {
    id: 'c_ce',
    title: 'Compréhension Écrite',
    type: 'Linguistique',
    level: 'B1/B2',
    description: 'Apprendre à repérer des informations, comprendre des consignes et identifier l\'intention d\'un texte.',
    teacherNpcId: 'francois_c',
    skills: ['comprehension', 'lexicon']
  },
  {
    id: 'c_ee',
    title: 'Expression Écrite',
    type: 'Linguistique',
    level: 'B1/B2',
    description: 'Rédiger des mails simples, structurer une réponse, reformuler.',
    teacherNpcId: 'margaux_h',
    skills: ['grammar', 'lexicon']
  },
  {
    id: 'c_gram',
    title: 'Grammaire en contexte',
    type: 'Linguistique',
    level: 'B1/B2',
    description: 'Maîtrise des temps du passé, hypothèse, discours rapporté, conditionnel.',
    teacherNpcId: 'heidi_m',
    skills: ['grammar']
  },
  {
    id: 'c_fou',
    title: 'Français sur Objectif Universitaire (FOU)',
    type: 'Méthodologie',
    level: 'B2',
    description: 'Comprendre les attentes universitaires, distinguer résumé et synthèse, prise de notes.',
    teacherNpcId: 'margaux_h',
    skills: ['autonomy', 'comprehension', 'organization']
  },
  {
    id: 'c_tcf',
    title: 'Préparation TCF / DELF',
    type: 'Méthodologie',
    level: 'B1/B2',
    description: 'Préparation intensive aux formats des examens officiels.',
    teacherNpcId: 'rodolphe_d',
    skills: ['autonomy', 'organization']
  }
];
