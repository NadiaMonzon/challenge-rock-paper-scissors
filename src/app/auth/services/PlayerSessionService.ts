import { inject, Injectable, signal } from '@angular/core';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';

const CURRENT_PLAYER_KEY = 'currentPlayer';

@Injectable({ providedIn: 'root' })
export class PlayerSessionService {
  private storageRepository = inject(StorageRepository);

  readonly currentPlayer = signal<PlayerModel | null>(
    this.storageRepository.get<PlayerModel>(CURRENT_PLAYER_KEY),
  );

  setCurrentPlayer(player: PlayerModel): void {
    this.storageRepository.set(CURRENT_PLAYER_KEY, player);
    this.currentPlayer.set(player);
  }

  logout(): void {
    this.currentPlayer.set(null);
  }
}
