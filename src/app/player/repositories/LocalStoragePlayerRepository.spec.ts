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

  describe('getAllPlayers', () => {
    beforeEach(() => {
      storageRepository.set<PlayerModel[]>(PLAYERS_KEY, [
        { id: '1', name: 'Charlie', score: 20, createdAt: new Date().toISOString() },
        { id: '2', name: 'Alice', score: 10, createdAt: new Date().toISOString() },
        { id: '3', name: 'Bob', score: 30, createdAt: new Date().toISOString() },
      ]);
    });

    it('should return players unsorted when no sort param is given', () => {
      const players = repository.getAllPlayers({});

      expect(players.map((p) => p.name)).toEqual(['Charlie', 'Alice', 'Bob']);
    });

    it('should sort by name asc', () => {
      const players = repository.getAllPlayers({ sort: { by: 'name', order: 'asc' } });
      expect(players.map((p) => p.name)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should sort by name desc', () => {
      const players = repository.getAllPlayers({ sort: { by: 'name', order: 'desc' } });
      expect(players.map((p) => p.name)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should sort by score asc', () => {
      const players = repository.getAllPlayers({ sort: { by: 'score', order: 'asc' } });
      expect(players.map((p) => p.score)).toEqual([10, 20, 30]);
    });

    it('should sort by score desc', () => {
      const players = repository.getAllPlayers({ sort: { by: 'score', order: 'desc' } });
      expect(players.map((p) => p.score)).toEqual([30, 20, 10]);
    });

    it('should not mutate the stored array when sorting', () => {
      repository.getAllPlayers({ sort: { by: 'name', order: 'asc' } });
      const raw = storageRepository.get<PlayerModel[]>(PLAYERS_KEY)!;
      expect(raw.map((p) => p.name)).toEqual(['Charlie', 'Alice', 'Bob']);
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
