import { TestBed } from '@angular/core/testing';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { FakePlayerRepository } from '../../player/repositories/FakePlayerRepository';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { CurrentPlayerStore } from '../store/CurrentPlayerStore';
import { JoinPlayerCommand } from './JoinPlayerCommand';
import { SetCurrentPlayerCommand } from './SetCurrentPlayerCommand';

describe('JoinPlayerCommand', () => {
  let command: JoinPlayerCommand;
  let fakeRepository: FakePlayerRepository;

  beforeEach(() => {
    fakeRepository = new FakePlayerRepository();

    TestBed.configureTestingModule({
      providers: [
        JoinPlayerCommand,
        SetCurrentPlayerCommand,
        CurrentPlayerStore,
        { provide: PlayerRepository, useValue: fakeRepository },
        { provide: StorageRepository, useClass: FakeStorageRepository },
      ],
    });

    command = TestBed.inject(JoinPlayerCommand);
  });

  it('should call playerRepository.findOrCreate with the given name', () => {
    const fakeRepositorySpy = vitest.spyOn(fakeRepository, 'findOrCreate');
    command.execute(['Alice']);
    expect(fakeRepositorySpy).toHaveBeenCalledExactlyOnceWith('Alice');
  });

  it('should set the current player in the session', () => {
    const playerSession = TestBed.inject(CurrentPlayerStore);
    const fakePlayer = { name: 'Alice' } as PlayerModel;
    vitest.spyOn(fakeRepository, 'findOrCreate').mockReturnValue(fakePlayer);
    command.execute(['Alice']);
    expect(playerSession.currentPlayer()).toBe(fakePlayer);
  });

  it('should create both players when two names are provided', () => {
    const fakeRepositorySpy = vitest.spyOn(fakeRepository, 'findOrCreate');

    command.execute(['Alice', 'Bob']);

    expect(fakeRepositorySpy).toHaveBeenNthCalledWith(1, 'Alice');
    expect(fakeRepositorySpy).toHaveBeenNthCalledWith(2, 'Bob');
  });

  it('should ignore empty player names', () => {
    const fakeRepositorySpy = vitest.spyOn(fakeRepository, 'findOrCreate');

    command.execute(['Alice', '   ']);

    expect(fakeRepositorySpy).toHaveBeenCalledTimes(1);
    expect(fakeRepositorySpy).toHaveBeenCalledWith('Alice');
  });

  it('should do nothing when all names are empty', () => {
    const fakeRepositorySpy = vitest.spyOn(fakeRepository, 'findOrCreate');
    const playerSession = TestBed.inject(CurrentPlayerStore);

    command.execute(['  ', '   ']);

    expect(fakeRepositorySpy).not.toHaveBeenCalled();
    expect(playerSession.currentPlayer()).toBeNull();
  });
});
