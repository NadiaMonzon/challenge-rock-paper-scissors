import { Component, computed, inject, signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { SetCurrentPlayerCommand } from '../../auth/commands/SetCurrentPlayerCommand';
import { CurrentPlayerStore } from '../../auth/store/CurrentPlayerStore';
import { LocalStoragePlayerRepository } from '../../player/repositories/LocalStoragePlayerRepository';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';
import type { GameMove } from '../models/GameMove';
import type { GameResult } from '../models/GameResult';
import { GetRandomMoveService } from '../services/GetRandomMoveService';
import { GetWinnerService } from '../services/GetWinnerService';
import { SavePlayerScoreService } from '../services/SavePlayerScoreService';

const CLASSIC_MOVES: GameMove[] = ['rock', 'paper', 'scissors'];
const LIZARD_SPOCK_MOVES: GameMove[] = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.html',
  styleUrl: './game-page.scss',
  imports: [RouterLinkWithHref],
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

  protected gameModes = [
    { label: 'Classic', value: 'classic' },
    { label: 'Lizard-Spock', value: 'lizard-spock' },
  ] as const;
  protected selectedGameMode = signal<'classic' | 'lizard-spock'>('classic');
  protected availableMoves = computed(() => {
    const hasLizardSpock = this.selectedGameMode() === 'lizard-spock';
    return hasLizardSpock ? LIZARD_SPOCK_MOVES : CLASSIC_MOVES;
  });

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

    this.determineGameOutcome(player1Move);
  }

  private determineGameOutcome(player1Move: GameMove): void {
    setTimeout(() => {
      const hasLizardSpock = this.selectedGameMode() === 'lizard-spock';
      const machineMove = this.getRandomMoveService.execute(hasLizardSpock);
      this.oppponentMove.set(machineMove);
      const gameResult = this.getWinnerService.execute(player1Move, machineMove);
      this.result.set(gameResult);
      this.isRevealing.set(false);

      if (gameResult === 'win') {
        this.savePlayerScoreService.execute();
      }

      if (gameResult === 'lose') {
        navigator.vibrate?.(300);
      }
    }, 1000);
  }

  protected onSelectGameMode(mode: 'classic' | 'lizard-spock'): void {
    this.selectedGameMode.set(mode);
    this.player1Move.set(null);
    this.oppponentMove.set(null);
    this.result.set(null);
  }
}
