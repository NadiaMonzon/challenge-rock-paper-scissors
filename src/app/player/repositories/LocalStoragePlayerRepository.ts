import { inject } from '@angular/core';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import type { PlayerModel } from '../models/PlayerModel';
import type { PlayerRepository } from './PlayerRepository';

export class LocalStoragePlayerRepository implements PlayerRepository {
  private storageRepository = inject(StorageRepository);

  findOrCreate(name: string): PlayerModel {
    const players = this.storageRepository.get<PlayerModel[]>('players') ?? [];
    const existing = players.find((p) => p.name === name);
    if (existing) return existing;

    const newPlayer: PlayerModel = { id: Date.now(), name, score: 0 };
    this.storageRepository.set('players', [...players, newPlayer]);
    return newPlayer;
  }
}
