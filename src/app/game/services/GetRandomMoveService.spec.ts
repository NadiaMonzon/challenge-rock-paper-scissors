import type { GameMove } from '../models/GameMove';
import { GetRandomMoveService } from './GetRandomMoveService';

const CLASSIC_MOVES: GameMove[] = ['rock', 'paper', 'scissors'];
const LIZARD_SPOCK_MOVES: GameMove[] = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

describe('GetRandomMoveService', () => {
  let service: GetRandomMoveService;

  beforeEach(() => {
    service = new GetRandomMoveService();
  });

  afterEach(() => {
    vitest.restoreAllMocks();
  });

  it('should return a valid classic move when lizard-spock mode is disabled', () => {
    const move = service.execute(false);
    expect(CLASSIC_MOVES).toContain(move);
  });

  it.each([0, 0.5, 0.99])(
    'should never return lizard or spock in classic mode (Math.random=%s)',
    (randomValue) => {
      vitest.spyOn(Math, 'random').mockReturnValue(randomValue);

      const move = service.execute(false);

      expect(move).not.toBe('lizard');
      expect(move).not.toBe('spock');
    },
  );

  it.each<[number, GameMove]>([
    [0, 'rock'],
    [0.21, 'paper'],
    [0.41, 'scissors'],
    [0.61, 'lizard'],
    [0.81, 'spock'],
  ])(
    'should return %s index move (%s) when lizard-spock mode is enabled',
    (randomValue, expectedMove) => {
      vitest.spyOn(Math, 'random').mockReturnValue(randomValue);

      const move = service.execute(true);

      expect(LIZARD_SPOCK_MOVES).toContain(move);
      expect(move).toBe(expectedMove);
    },
  );
});
