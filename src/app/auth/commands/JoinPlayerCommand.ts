import { inject } from '@angular/core';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';
import { SetCurrentPlayerCommand } from './SetCurrentPlayerCommand';

export class JoinPlayerCommand {
  private playerRepository = inject(PlayerRepository);
  private setCurrentPlayerCommand = inject(SetCurrentPlayerCommand);

  execute(names: string[]): void {
    const validNames = names.map((name) => name.trim()).filter((name) => name.length > 0);

    if (validNames.length === 0) {
      return;
    }

    const currentPlayerName = validNames[0]!;
    const otherPlayerNames = validNames.slice(1);
    const player = this.playerRepository.findOrCreate(currentPlayerName);

    for (const otherPlayerName of otherPlayerNames) {
      this.playerRepository.findOrCreate(otherPlayerName);
    }

    this.setCurrentPlayerCommand.execute(player);
  }
}
