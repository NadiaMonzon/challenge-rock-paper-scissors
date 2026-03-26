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

  it.each<[GameMove, GameMove[]]>([
    ['rock', ['paper', 'spock']],
    ['paper', ['scissors', 'lizard']],
    ['scissors', ['rock', 'spock']],
    ['lizard', ['rock', 'scissors']],
    ['spock', ['paper', 'lizard']],
  ])(
    'should return a winning counter move against %s when difficulty is 1 in lizard-spock mode',
    (playerMove, counters) => {
      vitest
        .spyOn(Math, 'random')
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.1);

      const move = service.execute(true, playerMove, 1);

      expect(counters).toContain(move);
    },
  );

  it.each<[GameMove, GameMove]>([
    ['rock', 'paper'],
    ['paper', 'scissors'],
    ['scissors', 'rock'],
  ])(
    'should return a classic winning counter against %s when difficulty is 1 in classic mode',
    (playerMove, expectedCounter) => {
      vitest
        .spyOn(Math, 'random')
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.1);

      const move = service.execute(false, playerMove, 1);

      expect(move).toBe(expectedCounter);
    },
  );

  it('should keep random behavior when difficulty is 0 even if player move is provided', () => {
    vitest.spyOn(Math, 'random').mockReturnValue(0.41);

    const move = service.execute(true, 'rock', 0);

    expect(move).toBe('scissors');
  });
});
