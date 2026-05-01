/**
 * Constantes globales du jeu Mission ISPA.
 * Centralise les valeurs clés pour éviter les erreurs de frappe (magic strings).
 */

export const PEDAGOGICAL_TRACKS = {
  A2_B1: 'a2-b1',
  B1_B2: 'b1-b2'
} as const;

export const STATS = {
  COMPREHENSION: 'comprehension',
  GRAMMAR: 'grammar',
  LEXICON: 'lexicon',
  AUTONOMY: 'autonomy',
  SOCIABILITY: 'sociability',
  ORGANIZATION: 'organization'
} as const;

export const MISSION_TYPES = {
  SINGLE_CHOICE: 'singleChoice',
  MULTI_SELECT: 'multiSelect',
  MULTI_STEP: 'multiStep',
  DOCUMENT_COMPARISON: 'documentComparison',
  ORDERING: 'ordering',
  // Prévus mais non implémentés :
  INVENTORY_SELECTION: 'inventorySelection',
  GUIDED_CLOZE: 'guidedCloze',
  CONSEQUENCE_CHOICE: 'consequenceChoice'
} as const;

export const UNSUPPORTED_MISSION_TYPES = [
  MISSION_TYPES.INVENTORY_SELECTION,
  MISSION_TYPES.GUIDED_CLOZE,
  MISSION_TYPES.CONSEQUENCE_CHOICE
];
