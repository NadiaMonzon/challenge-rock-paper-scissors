import { inject } from '@angular/core';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { CURRENT_PLAYER_KEY, CurrentPlayerStore } from '../store/CurrentPlayerStore';

export class LogoutCommand {
  private storageRepository = inject(StorageRepository);
  private playerSession = inject(CurrentPlayerStore);

  execute(): void {
    this.storageRepository.set(CURRENT_PLAYER_KEY, null);
    this.playerSession.currentPlayer.set(null);
  }
}
