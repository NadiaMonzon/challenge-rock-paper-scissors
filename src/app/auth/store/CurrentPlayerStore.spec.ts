import { TestBed } from '@angular/core/testing';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { CURRENT_PLAYER_KEY, CurrentPlayerStore } from './CurrentPlayerStore';

describe('CurrentPlayerStore', () => {
  let store: CurrentPlayerStore;
  let fakeStorage: FakeStorageRepository;

  beforeEach(() => {
    fakeStorage = new FakeStorageRepository();

    TestBed.configureTestingModule({
      providers: [CurrentPlayerStore, { provide: StorageRepository, useValue: fakeStorage }],
    });

    store = TestBed.inject(CurrentPlayerStore);
  });

  describe('when there is no player in storage', () => {
    it('should initialize currentPlayer as null', () => {
      expect(store.currentPlayer()).toBeNull();
    });
  });

  describe('when there is a player in storage', () => {
    it('should initialize currentPlayer from storage', () => {
      const player = { id: 1, name: 'Alice', score: 0, moveHistory: [] };
      fakeStorage.set(CURRENT_PLAYER_KEY, player);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [CurrentPlayerStore, { provide: StorageRepository, useValue: fakeStorage }],
      });

      store = TestBed.inject(CurrentPlayerStore);
      expect(store.currentPlayer()).toEqual(player);
    });
  });
});
