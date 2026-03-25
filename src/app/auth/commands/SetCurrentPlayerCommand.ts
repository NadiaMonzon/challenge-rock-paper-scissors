import { inject } from '@angular/core';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { CURRENT_PLAYER_KEY, CurrentPlayerStore } from '../store/CurrentPlayerStore';

export class SetCurrentPlayerCommand {
  private storageRepository = inject(StorageRepository);
  private playerSession = inject(CurrentPlayerStore);

  execute(player: PlayerModel): void {
    this.storageRepository.set(CURRENT_PLAYER_KEY, player);
    this.playerSession.currentPlayer.set(player);
  }
}
