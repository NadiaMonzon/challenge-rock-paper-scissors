import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PlayerSessionService } from '../../auth/services/PlayerSessionService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav-component.html',
  styleUrl: './nav-component.scss',
  imports: [RouterOutlet],
})
export class NavComponent {
  protected playerSession = inject(PlayerSessionService);
  private router = inject(Router);

  protected onLogout(): void {
    this.playerSession.logout();
    this.router.navigate(['/']);
  }
}
