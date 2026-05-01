import type { CharacterState } from '../types/gameState';
import type { ArcadeGameMetadata, ArcadeScore, ArcadeReward } from '../types/arcade';
import { ARCADE_GAMES } from '../data/arcadeGames';
import { evaluateCondition } from './unlockEngine';

/**
 * Returns all arcade games that are considered "available" for the player.
 * A game is available if its unlock conditions are met.
 */
export function getAvailableArcadeGames(gameState: CharacterState): ArcadeGameMetadata[] {
  return ARCADE_GAMES.filter((game) => isArcadeGameAvailable(game, gameState));
}

/**
 * Evaluates whether a specific arcade game is available based on its unlockConditions.
 */
export function isArcadeGameAvailable(game: ArcadeGameMetadata, gameState: CharacterState): boolean {
  if (game.status === 'disabled') return false;
  if (!game.unlockConditions || game.unlockConditions.length === 0) return true;
  
  return game.unlockConditions.every(cond => evaluateCondition(cond, gameState));
}

/**
 * Retrieves the best score for a specific arcade game from the state.
 */
export function getBestScore(gameId: string, gameState: CharacterState): ArcadeScore | undefined {
  return gameState.arcade?.bestScores[gameId];
}

/**
 * Computes theoretical rewards based on a score result and the game's reward policy.
 * (Note: Does not apply them automatically to the state yet).
 */
export function computeArcadeRewards(_score: number, _accuracy: number | undefined, _game: ArcadeGameMetadata): ArcadeReward[] {
  // In the future, this will read from a rewardPolicy list.
  // For now, returning an empty array to maintain structure.
  return [];
}

/**
 * Formats an arcade score for display.
 */
export function formatArcadeScore(score: number | undefined): string {
  if (score === undefined || score === null) return "Aucun score";
  return new Intl.NumberFormat('fr-FR').format(score) + " pts";
}
