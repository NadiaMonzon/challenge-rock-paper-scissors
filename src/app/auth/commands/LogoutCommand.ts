import { inject } from '@angular/core';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';
import { CURRENT_PLAYER_KEY, PlayerSessionService } from '../services/PlayerSessionService';

export class LogoutCommand {
  private storageRepository = inject(StorageRepository);
  private playerSession = inject(PlayerSessionService);

  execute(): void {
    this.storageRepository.set(CURRENT_PLAYER_KEY, null);
    this.playerSession.currentPlayer.set(null);
  }
}
