import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private router = inject(Router);

  public name = signal('');
  public isValid = computed(() => this.name().trim().length > 0);

  public onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }

  public onJoin(): void {
    if (!this.isValid()) return;
    this.router.navigate(['/game']);
  }
}
