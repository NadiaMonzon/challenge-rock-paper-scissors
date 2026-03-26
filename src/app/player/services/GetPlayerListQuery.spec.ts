import type { GetPlayerListParams } from '../models/GetPlayerListParams';
import type { PlayerModel } from '../models/PlayerModel';
import { FakePlayerRepository } from '../repositories/FakePlayerRepository';
import { GetPlayerListQuery } from './GetPlayerListQuery';

describe('GetPlayerListQuery', () => {
  let query: GetPlayerListQuery;
  let fakePlayerRepository: FakePlayerRepository;

  beforeEach(() => {
    fakePlayerRepository = new FakePlayerRepository();
    query = new GetPlayerListQuery(fakePlayerRepository);
  });

  it('should call getAllPlayers with the given options', () => {
    const options: GetPlayerListParams = { sort: { by: 'score', order: 'desc' } };
    const getAllPlayersSpy = vitest.spyOn(fakePlayerRepository, 'getAllPlayers');

    query.execute(options);

    expect(getAllPlayersSpy).toHaveBeenCalledExactlyOnceWith(options);
  });

  it('should return the players provided by the repository', () => {
    const players: PlayerModel[] = [
      { id: 1, name: 'Alice', score: 10 },
      { id: 2, name: 'Bob', score: 8 },
    ];
    vitest.spyOn(fakePlayerRepository, 'getAllPlayers').mockReturnValue(players);

    const result = query.execute({ sort: { by: 'name', order: 'asc' } });

    expect(result).toEqual(players);
  });
});
