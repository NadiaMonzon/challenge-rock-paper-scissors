import { TestBed } from '@angular/core/testing';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import type { PlayerModel } from '../models/PlayerModel';
import { FakePlayerRepository } from '../repositories/FakePlayerRepository';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { JoinPlayerCommand } from './JoinPlayerCommand';
import { PlayerSessionService } from './PlayerSessionService';

describe('JoinPlayerCommand', () => {
  let command: JoinPlayerCommand;
  let fakeRepository: FakePlayerRepository;

  beforeEach(() => {
    fakeRepository = new FakePlayerRepository();

    TestBed.configureTestingModule({
      providers: [
        JoinPlayerCommand,
        { provide: PlayerRepository, useValue: fakeRepository },
        { provide: StorageRepository, useClass: FakeStorageRepository },
      ],
    });

    command = TestBed.inject(JoinPlayerCommand);
  });

  it('should call playerRepository.findOrCreate with the given name', () => {
    const fakeRepositorySpy = vitest.spyOn(fakeRepository, 'findOrCreate');
    command.execute('Alice');
    expect(fakeRepositorySpy).toHaveBeenCalledExactlyOnceWith('Alice');
  });

  it('should set the current player in the session', () => {
    const playerSession = TestBed.inject(PlayerSessionService);
    const fakePlayer = { name: 'Alice' } as PlayerModel;
    vitest.spyOn(fakeRepository, 'findOrCreate').mockReturnValue(fakePlayer);
    command.execute('Alice');
    expect(playerSession.currentPlayer()).toBe(fakePlayer);
  });
});
