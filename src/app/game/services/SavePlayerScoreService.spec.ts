import { TestBed } from '@angular/core/testing';
import { SetCurrentPlayerCommand } from '../../auth/commands/SetCurrentPlayerCommand';
import { CurrentPlayerStore } from '../../auth/store/CurrentPlayerStore';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { FakePlayerRepository } from '../../player/repositories/FakePlayerRepository';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { SavePlayerScoreService } from './SavePlayerScoreService';

describe('SavePlayerScoreService', () => {
  let service: SavePlayerScoreService;
  let playerStore: CurrentPlayerStore;
  let fakePlayerRepository: FakePlayerRepository;

  const player: PlayerModel = {
    id: '1',
    name: 'Alice',
    score: 2,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    fakePlayerRepository = new FakePlayerRepository();

    TestBed.configureTestingModule({
      providers: [
        SavePlayerScoreService,
        SetCurrentPlayerCommand,
        CurrentPlayerStore,
        { provide: PlayerRepository, useValue: fakePlayerRepository },
        { provide: StorageRepository, useClass: FakeStorageRepository },
      ],
    });

    service = TestBed.inject(SavePlayerScoreService);
    playerStore = TestBed.inject(CurrentPlayerStore);
  });

  describe('when there is no current player', () => {
    it('should do nothing', () => {
      const saveSpy = vitest.spyOn(fakePlayerRepository, 'save');
      expect(() => service.execute()).not.toThrow();
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('when there is a current player', () => {
    beforeEach(() => {
      playerStore.currentPlayer.set(player);
    });

    it('should increment the player score by 1', () => {
      service.execute();
      expect(playerStore.currentPlayer()?.score).toBe(3);
    });

    it('should call playerRepository.save with the updated player', () => {
      const saveSpy = vitest.spyOn(fakePlayerRepository, 'save');
      service.execute();
      expect(saveSpy).toHaveBeenCalledExactlyOnceWith({ ...player, score: 3 });
    });
  });
});
