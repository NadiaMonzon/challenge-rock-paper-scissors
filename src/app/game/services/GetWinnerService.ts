import { PLAYER_COUNTER_MOVES } from '../models/CounterMoves';
import type { GameMove } from '../models/GameMove';
import type { GameResult } from '../models/GameResult';

export class GetWinnerService {
  execute(playerMove: GameMove, machineMove: GameMove): GameResult {
    if (playerMove === machineMove) return 'tie';
    return PLAYER_COUNTER_MOVES[playerMove].includes(machineMove) ? 'win' : 'lose';
  }
}
