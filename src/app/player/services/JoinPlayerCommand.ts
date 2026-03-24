import { inject } from '@angular/core';
import { PlayerRepository } from '../repositories/PlayerRepository';

export class JoinPlayerCommand {
  private playerRepository = inject(PlayerRepository);

  execute(name: string): void {
    this.playerRepository.findOrCreate(name);
  }
}
