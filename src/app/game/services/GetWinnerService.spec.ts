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
    ['rock', 'paper', 'lose'],
    ['rock', 'rock', 'tie'],
    ['paper', 'rock', 'win'],
    ['paper', 'scissors', 'lose'],
    ['paper', 'paper', 'tie'],
    ['scissors', 'paper', 'win'],
    ['scissors', 'rock', 'lose'],
    ['scissors', 'scissors', 'tie'],
  ])('%s vs %s should be %s', (playerMove, machineMove, expected) => {
    expect(service.execute(playerMove, machineMove)).toBe(expected);
  });
});
