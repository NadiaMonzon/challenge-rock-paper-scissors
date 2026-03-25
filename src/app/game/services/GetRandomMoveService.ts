import type { GameMove } from '../models/GameMove';

const MOVES: GameMove[] = ['rock', 'paper', 'scissors'];

export class GetRandomMoveService {
  execute(): GameMove {
    return MOVES[Math.floor(Math.random() * MOVES.length)] as GameMove;
  }
}
