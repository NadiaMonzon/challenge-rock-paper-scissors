import { inject } from '@angular/core';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { PlayerSessionService } from './PlayerSessionService';

export class JoinPlayerCommand {
  private playerRepository = inject(PlayerRepository);
  private playerSession = inject(PlayerSessionService);

  execute(name: string): void {
    const player = this.playerRepository.findOrCreate(name);
    this.playerSession.setCurrentPlayer(player);
  }
}
