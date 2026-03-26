import type { GameMove } from './GameMove';

export const PLAYER_COUNTER_MOVES: Record<GameMove, GameMove[]> = {
  rock: ['scissors', 'lizard'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  lizard: ['paper', 'spock'],
  spock: ['rock', 'scissors'],
};

export const MACHINE_COUNTER_MOVES: Record<GameMove, GameMove[]> = {
  rock: ['paper', 'spock'],
  paper: ['scissors', 'lizard'],
  scissors: ['rock', 'spock'],
  lizard: ['rock', 'scissors'],
  spock: ['paper', 'lizard'],
};
