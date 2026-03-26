import { MACHINE_COUNTER_MOVES } from '../models/CounterMoves';
import type { GameMove } from '../models/GameMove';

const CLASSIC_MOVES: GameMove[] = ['rock', 'paper', 'scissors'];
const LIZARD_SPOCK_MOVES: GameMove[] = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

export class GetRandomMoveService {
  execute(hasLizardSpock: boolean, playerMove?: GameMove, difficulty = 0.6): GameMove {
    const moves = hasLizardSpock ? LIZARD_SPOCK_MOVES : CLASSIC_MOVES;

    if (playerMove && Math.random() < difficulty) {
      return this.selectCounterMove(playerMove, hasLizardSpock);
    }

    const randomIndex = Math.floor(Math.random() * moves.length);

    return moves[randomIndex] as GameMove;
  }

  private selectCounterMove(playerMove: GameMove, hasLizardSpock: boolean): GameMove {
    const counters = MACHINE_COUNTER_MOVES[playerMove].filter((counterMove) =>
      hasLizardSpock ? true : CLASSIC_MOVES.includes(counterMove),
    );
    const randomIndex = Math.floor(Math.random() * counters.length);
    return counters[randomIndex] as GameMove;
  }
}
