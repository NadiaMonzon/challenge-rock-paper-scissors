import { TestBed } from '@angular/core/testing';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { CURRENT_PLAYER_KEY, CurrentPlayerStore } from '../store/CurrentPlayerStore';
import { SetCurrentPlayerCommand } from './SetCurrentPlayerCommand';

describe('SetCurrentPlayerCommand', () => {
  let command: SetCurrentPlayerCommand;
  let store: CurrentPlayerStore;
  let fakeStorage: FakeStorageRepository;

  const player: PlayerModel = {
    id: '1',
    name: 'Alice',
    score: 0,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    fakeStorage = new FakeStorageRepository();

    TestBed.configureTestingModule({
      providers: [
        SetCurrentPlayerCommand,
        CurrentPlayerStore,
        { provide: StorageRepository, useValue: fakeStorage },
      ],
    });

    command = TestBed.inject(SetCurrentPlayerCommand);
    store = TestBed.inject(CurrentPlayerStore);
  });

  it('should update the currentPlayer signal', () => {
    command.execute(player);
    expect(store.currentPlayer()).toBe(player);
  });

  it('should persist the player in storage', () => {
    command.execute(player);
    expect(fakeStorage.get(CURRENT_PLAYER_KEY)).toEqual(player);
  });
});
