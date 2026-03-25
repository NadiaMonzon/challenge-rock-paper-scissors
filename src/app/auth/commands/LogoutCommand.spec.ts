import { TestBed } from '@angular/core/testing';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { CURRENT_PLAYER_KEY, CurrentPlayerStore } from '../store/CurrentPlayerStore';
import { LogoutCommand } from './LogoutCommand';

describe('LogoutCommand', () => {
  let command: LogoutCommand;
  let store: CurrentPlayerStore;
  let fakeStorage: FakeStorageRepository;

  const player: PlayerModel = { id: 1, name: 'Alice', score: 0 };

  beforeEach(() => {
    fakeStorage = new FakeStorageRepository();
    fakeStorage.set(CURRENT_PLAYER_KEY, player);

    TestBed.configureTestingModule({
      providers: [
        LogoutCommand,
        CurrentPlayerStore,
        { provide: StorageRepository, useValue: fakeStorage },
      ],
    });

    command = TestBed.inject(LogoutCommand);
    store = TestBed.inject(CurrentPlayerStore);
  });

  it('should set currentPlayer signal to null', () => {
    command.execute();
    expect(store.currentPlayer()).toBeNull();
  });

  it('should persist null in storage', () => {
    command.execute();
    expect(fakeStorage.get(CURRENT_PLAYER_KEY)).toBeNull();
  });
});
