import type { GameMove } from '../models/GameMove';
import { GetRandomMoveService } from './GetRandomMoveService';

const VALID_MOVES: GameMove[] = ['rock', 'paper', 'scissors'];

describe('GetRandomMoveService', () => {
  let service: GetRandomMoveService;

  beforeEach(() => {
    service = new GetRandomMoveService();
  });

  it('should return a valid game move', () => {
    const move = service.execute(false);
    expect(VALID_MOVES).toContain(move);
  });

  it('should return one of the 5 possible moves over multiple calls', () => {
    for (let i = 0; i < 50; i++) {
      expect(VALID_MOVES).toContain(service.execute(false));
    }
  });
});
