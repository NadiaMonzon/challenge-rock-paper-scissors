import type { GameMove } from '../../game/models/GameMove';

export interface PlayerModel {
  id: number;
  name: string;
  score: number;
  moveHistory: GameMove[];
}
