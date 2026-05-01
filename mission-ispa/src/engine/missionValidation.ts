import type { Mission, Choice, StatEffect, MissionStep } from '../types/mission';

export interface ValidationResult {
  correct: boolean;
  feedbackText: string;
  effectsToApply: StatEffect[];
}

interface ValidationContext {
  mission: Mission;
  currentStep: MissionStep | null;
  actualChoiceId: string | null;
  selectedChoicesIds: string[];
  orderingChoiceIds: string[];
  choices: Choice[];
}

export function validateMissionAnswer(context: ValidationContext): ValidationResult {
  const { mission, currentStep, actualChoiceId, selectedChoicesIds, orderingChoiceIds, choices } = context;
  
  let correct = false;
  let selectedChoice: Choice | null = null;
  let feedbackText = "";
  let effectsToApply = mission.successEffects || [];

  const getExpectedMultiSelectAnswers = () => {
    const correctIds = mission.correctSelection || [];
    return correctIds
      .map(id => choices.find(choice => choice.id === id)?.text)
      .filter((text): text is string => Boolean(text));
  };

  const getExpectedOrderingAnswers = () => {
    const correctIds = currentStep?.correctOrder || mission.correctOrder || [];
    return correctIds
      .map(id => choices.find(choice => choice.id === id)?.text)
      .filter((text): text is string => Boolean(text));
  };

  if (mission.missionType === 'singleChoice' || !mission.missionType) {
    selectedChoice = choices.find(c => c.id === actualChoiceId) || null;
    if (selectedChoice) {
      correct = !!selectedChoice.isCorrect;
      feedbackText = selectedChoice.feedback || (correct ? "Bonne réponse !" : "Mauvaise réponse.");
      effectsToApply = selectedChoice.effects;
    }
  } else if (mission.missionType === 'multiSelect') {
    const correctIds = mission.correctSelection || [];
    const isExactlyCorrect = selectedChoicesIds.length === correctIds.length && selectedChoicesIds.every(id => correctIds.includes(id));
    correct = isExactlyCorrect;
    const expectedAnswers = getExpectedMultiSelectAnswers();
    feedbackText = correct
      ? "C'est exact ! Vous avez sélectionné les bonnes informations."
      : `La sélection n'est pas complète ou contient une erreur. Réponses attendues : ${expectedAnswers.join(', ')}.`;
    effectsToApply = correct ? (mission.successEffects || []) : (mission.failureEffects || [{ target: 'stress', amount: 5 }]);
  } else if (mission.missionType === 'multiStep') {
    selectedChoice = choices.find(c => c.id === actualChoiceId) || null;
    if (selectedChoice) {
      correct = !!selectedChoice.isCorrect;
      feedbackText = selectedChoice.feedback || (correct ? "C'est exact." : "Non, essayez encore.");
      effectsToApply = selectedChoice.effects;
    }
  } else if (mission.missionType === 'ordering') {
    const correctOrder = currentStep?.correctOrder || mission.correctOrder || [];
    correct = correctOrder.length > 0 && orderingChoiceIds.length === correctOrder.length && orderingChoiceIds.every((id, index) => id === correctOrder[index]);
    const expectedAnswers = getExpectedOrderingAnswers();
    feedbackText = correct
      ? "C'est exact ! L'ordre est correct."
      : `L'ordre n'est pas encore correct. Ordre attendu : ${expectedAnswers.join(' > ')}.`;
    effectsToApply = correct ? (mission.successEffects || []) : (mission.failureEffects || [{ target: 'stress', amount: 5 }]);
  } else if (mission.missionType === 'documentComparison') {
    selectedChoice = choices.find(c => c.id === actualChoiceId) || null;
    if (selectedChoice) {
      correct = !!selectedChoice.isCorrect;
      feedbackText = selectedChoice.feedback || (correct ? "Bien vu !" : "Erreur d'analyse.");
      effectsToApply = selectedChoice.effects;
    }
  } else {
    correct = false;
    feedbackText = "Ce type de mission est prévu mais pas encore implémenté.";
    effectsToApply = [];
  }

  return { correct, feedbackText, effectsToApply };
}
