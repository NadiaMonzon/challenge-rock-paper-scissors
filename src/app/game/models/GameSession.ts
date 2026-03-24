import type { GameMove } from './GameMove';

export interface GameSession {
  id: number;
  player1: string;
  lastMachineMove: GameMove | null;
}
