import { Component, computed, inject, signal } from '@angular/core';
import { SetCurrentPlayerCommand } from '../../auth/commands/SetCurrentPlayerCommand';
import { CurrentPlayerStore } from '../../auth/store/CurrentPlayerStore';
import { LocalStoragePlayerRepository } from '../../player/repositories/LocalStoragePlayerRepository';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';
import type { GameMove } from '../models/GameMove';
import type { GameResult } from '../models/GameResult';
import { GetRandomMoveService } from '../services/GetRandomMoveService';
import { GetWinnerService } from '../services/GetWinnerService';
import { SavePlayerScoreService } from '../services/SavePlayerScoreService';

const MOVES: GameMove[] = ['rock', 'paper', 'scissors'];

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.html',
  styleUrl: './game-page.scss',
  providers: [
    GetWinnerService,
    GetRandomMoveService,
    SavePlayerScoreService,
    {
      provide: SetCurrentPlayerCommand,
      useClass: SetCurrentPlayerCommand,
      deps: [PlayerRepository, CurrentPlayerStore],
    },
    {
      provide: PlayerRepository,
      useClass: LocalStoragePlayerRepository,
      deps: [LocalStoragePlayerRepository],
    },
    LocalStoragePlayerRepository,
  ],
})
export class GamePage {
  private playerStore = inject(CurrentPlayerStore);
  private getWinnerService = inject(GetWinnerService);
  private getRandomMoveService = inject(GetRandomMoveService);
  private savePlayerScoreService = inject(SavePlayerScoreService);

  protected readonly moves = MOVES;
  protected player1Move = signal<GameMove | null>(null);
  protected oppponentMove = signal<GameMove | null>(null);
  protected result = signal<GameResult | null>(null);
  protected isRevealing = signal(false);

  protected playerName = computed(() => this.playerStore.currentPlayer()?.name ?? '');
  protected score = computed(() => this.playerStore.currentPlayer()?.score ?? 0);

  protected onSelectMove(player1Move: GameMove): void {
    if (this.isRevealing()) return;

    this.player1Move.set(player1Move);
    this.oppponentMove.set(null);
    this.result.set(null);
    this.isRevealing.set(true);

    setTimeout(() => {
      const machineMove = this.getRandomMoveService.execute();
      this.oppponentMove.set(machineMove);
      const gameResult = this.getWinnerService.execute(player1Move, machineMove);
      this.result.set(gameResult);
      this.isRevealing.set(false);

      if (gameResult === 'win') {
        this.savePlayerScoreService.execute();
      }
    }, 1000);
  }
}
