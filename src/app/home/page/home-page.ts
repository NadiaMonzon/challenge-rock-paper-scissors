import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JoinPlayerCommand } from '../../auth/commands/JoinPlayerCommand';
import { LocalStoragePlayerRepository } from '../../player/repositories/LocalStoragePlayerRepository';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  providers: [
    { provide: PlayerRepository, useClass: LocalStoragePlayerRepository },
    JoinPlayerCommand,
  ],
})
export class HomePage {
  private router = inject(Router);
  private joinPlayerCommand = inject(JoinPlayerCommand);

  public name = signal('');
  public isValid = computed(() => this.name().trim().length > 0);

  public onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }

  public onJoin(): void {
    if (!this.isValid()) return;
    const name = this.name().trim();
    this.joinPlayerCommand.execute(name);
    this.router.navigate(['/game']);
  }
}
