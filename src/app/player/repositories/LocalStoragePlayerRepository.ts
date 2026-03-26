import { inject } from '@angular/core';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import type { GetPlayerListParams } from '../models/GetPlayerListParams';
import type { PlayerModel } from '../models/PlayerModel';
import type { PlayerRepository } from './PlayerRepository';

export const PLAYERS_KEY = 'players';

export class LocalStoragePlayerRepository implements PlayerRepository {
  private storageRepository = inject(StorageRepository);

  findOrCreate(name: string): PlayerModel {
    const players = this.storageRepository.get<PlayerModel[]>(PLAYERS_KEY) ?? [];
    const existing = players.find((p) => p.name === name);
    if (existing) return existing;

    const newPlayer: PlayerModel = { id: Date.now(), name, score: 0 };
    this.storageRepository.set(PLAYERS_KEY, [...players, newPlayer]);
    return newPlayer;
  }

  save(player: PlayerModel): void {
    const playersList = this.storageRepository.get<PlayerModel[]>(PLAYERS_KEY) ?? [];
    this.storageRepository.set(
      PLAYERS_KEY,
      playersList.map((storedPlayer) => (storedPlayer.id === player.id ? player : storedPlayer)),
    );
  }

  getAllPlayers(params: GetPlayerListParams): PlayerModel[] {
    const players = this.storageRepository.get<PlayerModel[]>(PLAYERS_KEY) ?? [];

    if (!params.sort) return players;

    const { by, order } = params.sort;
    const sortedPlayers = [...players].sort((a, b) => {
      if (by === 'name') return a.name.localeCompare(b.name);
      return a.score - b.score;
    });

    return order === 'asc' ? sortedPlayers : sortedPlayers.reverse();
  }
}
