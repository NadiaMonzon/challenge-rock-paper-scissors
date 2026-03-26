import type { GameMove } from '../models/GameMove';
import type { GameResult } from '../models/GameResult';
import { GetWinnerService } from './GetWinnerService';

describe('GetWinnerService', () => {
  let service: GetWinnerService;

  beforeEach(() => {
    service = new GetWinnerService();
  });

  it.each<[GameMove, GameMove, GameResult]>([
    ['rock', 'scissors', 'win'],
    ['rock', 'lizard', 'win'],
    ['rock', 'paper', 'lose'],
    ['rock', 'spock', 'lose'],
    ['rock', 'rock', 'tie'],
    ['paper', 'rock', 'win'],
    ['paper', 'spock', 'win'],
    ['paper', 'scissors', 'lose'],
    ['paper', 'lizard', 'lose'],
    ['paper', 'paper', 'tie'],
    ['scissors', 'paper', 'win'],
    ['scissors', 'lizard', 'win'],
    ['scissors', 'rock', 'lose'],
    ['scissors', 'spock', 'lose'],
    ['scissors', 'scissors', 'tie'],
    ['lizard', 'paper', 'win'],
    ['lizard', 'spock', 'win'],
    ['lizard', 'rock', 'lose'],
    ['lizard', 'scissors', 'lose'],
    ['lizard', 'lizard', 'tie'],
    ['spock', 'rock', 'win'],
    ['spock', 'scissors', 'win'],
    ['spock', 'paper', 'lose'],
    ['spock', 'lizard', 'lose'],
    ['spock', 'spock', 'tie'],
  ])('%s vs %s should be %s', (playerMove, machineMove, expected) => {
    expect(service.execute(playerMove, machineMove)).toBe(expected);
  });
});
