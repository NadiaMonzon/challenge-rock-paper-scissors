import { TestBed } from '@angular/core/testing';
import type { UrlTree } from '@angular/router';
import { provideRouter, Router } from '@angular/router';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { CURRENT_PLAYER_KEY, CurrentPlayerStore } from '../store/CurrentPlayerStore';
import { isPlayerLoggedInGuard } from './is-player-logged-in.guard';

describe('isPlayerLoggedInGuard', () => {
  let store: CurrentPlayerStore;
  let fakeStorage: FakeStorageRepository;

  const runGuard = (): boolean | UrlTree =>
    TestBed.runInInjectionContext(() => isPlayerLoggedInGuard());

  beforeEach(() => {
    fakeStorage = new FakeStorageRepository();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        CurrentPlayerStore,
        { provide: StorageRepository, useValue: fakeStorage },
      ],
    });

    store = TestBed.inject(CurrentPlayerStore);
  });

  describe('when the player is logged in', () => {
    it('should return true', () => {
      fakeStorage.set(CURRENT_PLAYER_KEY, { id: 1, name: 'Alice', score: 0, moveHistory: [] });
      store.currentPlayer.set({ id: 1, name: 'Alice', score: 0, moveHistory: [] });

      expect(runGuard()).toBe(true);
    });
  });

  describe('when there is no player', () => {
    it('should redirect to /', () => {
      const router = TestBed.inject(Router);
      const result = runGuard();

      expect(result).toEqual(router.createUrlTree(['/']));
    });
  });
});
