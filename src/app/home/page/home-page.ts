import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JoinPlayerCommand } from '../../auth/commands/JoinPlayerCommand';
import { SetCurrentPlayerCommand } from '../../auth/commands/SetCurrentPlayerCommand';
import { LocalStoragePlayerRepository } from '../../player/repositories/LocalStoragePlayerRepository';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  providers: [
    { provide: PlayerRepository, useClass: LocalStoragePlayerRepository },
    SetCurrentPlayerCommand,
    JoinPlayerCommand,
  ],
})
export class HomePage {
  private router = inject(Router);
  private joinPlayerCommand = inject(JoinPlayerCommand);

  public playerCountOptions: { value: 1 | 2; label: string }[] = [
    { value: 1, label: '1 jugador' },
    { value: 2, label: '2 jugadores' },
  ];
  public player1Name = signal('');
  public player2Name = signal('');
  public selectedPlayerCount = signal<1 | 2>(1);

  public isPlayer1Valid = computed(() => this.player1Name().trim().length > 0);
  public isPlayer2Valid = computed(() => this.player2Name().trim().length > 0);
  public isFormValid = computed(() => {
    if (!this.isPlayer1Valid()) return false;
    if (this.selectedPlayerCount() === 2) return this.isPlayer2Valid();
    return true;
  });

  public onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.player1Name.set(input.value);
  }

  public onSelectPlayerCount(value: 1 | 2): void {
    this.selectedPlayerCount.set(value);
  }

  public onPlayer2NameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.player2Name.set(input.value);
  }

  public onJoin(): void {
    if (!this.isFormValid()) return;
    const playerNames = [this.player1Name().trim()];

    if (this.selectedPlayerCount() === 2) {
      playerNames.push(this.player2Name().trim());
    }

    this.joinPlayerCommand.execute(playerNames);
    this.router.navigate(['/game']);
  }
}
