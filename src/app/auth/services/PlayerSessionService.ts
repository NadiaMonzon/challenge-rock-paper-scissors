import { inject, signal } from '@angular/core';
import type { PlayerModel } from '../../player/models/PlayerModel';
import { StorageRepository } from '../../shared/storage/repositories/StorageRepository';

const CURRENT_PLAYER_KEY = 'currentPlayer';

export { CURRENT_PLAYER_KEY };

export class PlayerSessionService {
  private storageRepository = inject(StorageRepository);

  readonly currentPlayer = signal<PlayerModel | null>(
    this.storageRepository.get<PlayerModel>(CURRENT_PLAYER_KEY),
  );
}
