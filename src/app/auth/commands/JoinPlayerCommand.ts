import { inject } from '@angular/core';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';
import { SetCurrentPlayerCommand } from './SetCurrentPlayerCommand';

export class JoinPlayerCommand {
  private playerRepository = inject(PlayerRepository);
  private setCurrentPlayerCommand = inject(SetCurrentPlayerCommand);

  execute(name: string): void {
    const player = this.playerRepository.findOrCreate(name);
    this.setCurrentPlayerCommand.execute(player);
  }
}
