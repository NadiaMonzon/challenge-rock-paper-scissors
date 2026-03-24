import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStoragePlayerRepository } from '../../player/repositories/LocalStoragePlayerRepository';
import { PlayerRepository } from '../../player/repositories/PlayerRepository';
import { JoinPlayerCommand } from '../../player/services/JoinPlayerCommand';

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
    this.joinPlayerCommand.execute(this.name().trim());
    this.router.navigate(['/game']);
  }
}
