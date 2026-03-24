import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  imports: [RouterLink, FormsModule],
})
export class HomePage {
  name = signal('');
  isValid = computed(() => this.name().trim().length > 0);

  public onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }
}
