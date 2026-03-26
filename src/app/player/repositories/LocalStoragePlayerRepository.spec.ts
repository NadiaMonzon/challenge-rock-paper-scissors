import { TestBed } from '@angular/core/testing';
import { FakeStorageRepository } from '../../shared/storage/repositories/FakeStorageRepository';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import type { PlayerModel } from '../models/PlayerModel';
import { LocalStoragePlayerRepository, PLAYERS_KEY } from './LocalStoragePlayerRepository';

describe('LocalStoragePlayerRepository', () => {
  let repository: LocalStoragePlayerRepository;
  let storageRepository: FakeStorageRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStoragePlayerRepository,
        { provide: StorageRepository, useClass: FakeStorageRepository },
      ],
    });

    repository = TestBed.inject(LocalStoragePlayerRepository);
    storageRepository = TestBed.inject(StorageRepository) as FakeStorageRepository;
  });

  describe('when the player does not exist', () => {
    it('should return a new player with the given name', () => {
      const player = repository.findOrCreate('Alice');
      expect(player.name).toBe('Alice');
    });

    it('should return a new player with score 0', () => {
      const player = repository.findOrCreate('Alice');
      expect(player.score).toBe(0);
    });

    it('should persist the new player in storage', () => {
      repository.findOrCreate('Alice');
      const players = storageRepository.get<PlayerModel[]>(PLAYERS_KEY);
      expect(players?.length).toBe(1);
      expect(players?.[0]?.name).toBe('Alice');
    });
  });

  describe('when the player already exists', () => {
    let existing: PlayerModel;

    beforeEach(() => {
      existing = repository.findOrCreate('Alice');
    });

    it('should return the existing player', () => {
      const result = repository.findOrCreate('Alice');
      expect(result).toEqual(existing);
    });

    it('should not create a duplicate in storage', () => {
      repository.findOrCreate('Alice');
      const players = storageRepository.get<PlayerModel[]>(PLAYERS_KEY);
      expect(players?.length).toBe(1);
    });
  });
});
