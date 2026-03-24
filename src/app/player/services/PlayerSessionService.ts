import { Injectable, signal } from '@angular/core';
import type { PlayerModel } from '../models/PlayerModel';

@Injectable({ providedIn: 'root' })
export class PlayerSessionService {
  readonly currentPlayer = signal<PlayerModel | null>(null);

  setCurrentPlayer(player: PlayerModel): void {
    this.currentPlayer.set(player);
  }
}
