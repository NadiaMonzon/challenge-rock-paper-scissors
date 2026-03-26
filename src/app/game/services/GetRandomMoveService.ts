import type { GameMove } from '../models/GameMove';

export class GetRandomMoveService {
  execute(hasLizardSpock: boolean): GameMove {
    const CLASSIC_MOVES: GameMove[] = ['rock', 'paper', 'scissors'];
    const LIZARD_SPOCK_MOVES: GameMove[] = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

    const moves = hasLizardSpock ? LIZARD_SPOCK_MOVES : CLASSIC_MOVES;
    return moves[Math.floor(Math.random() * moves.length)] as GameMove;
  }
}
