import type { GameMove } from '../models/GameMove';
import type { GameResult } from '../models/GameResult';

const WINNING_MOVES: Record<GameMove, GameMove[]> = {
  rock: ['scissors', 'lizard'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  lizard: ['paper', 'spock'],
  spock: ['rock', 'scissors'],
};

export class GetWinnerService {
  execute(playerMove: GameMove, machineMove: GameMove): GameResult {
    if (playerMove === machineMove) return 'tie';
    return WINNING_MOVES[playerMove].includes(machineMove) ? 'win' : 'lose';
  }
}
