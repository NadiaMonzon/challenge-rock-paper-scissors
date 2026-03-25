import { inject } from '@angular/core';
import { SetCurrentPlayerCommand } from '../../auth/commands/SetCurrentPlayerCommand';
import { CurrentPlayerStore } from '../../auth/store/CurrentPlayerStore';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';

export class SavePlayerScoreService {
  private playerStore = inject(CurrentPlayerStore);
  private setCurrentPlayer = inject(SetCurrentPlayerCommand);
  private playerRepository = inject(PlayerRepository);

  execute(): void {
    const currentPlayer = this.playerStore.currentPlayer();
    if (!currentPlayer) return;

    const playerWithIncrementedScore = {
      ...currentPlayer,
      score: currentPlayer.score + 1,
    };

    this.playerRepository.save(playerWithIncrementedScore);
    this.setCurrentPlayer.execute(playerWithIncrementedScore);
  }
}
