import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LogoutCommand } from '../../auth/commands/LogoutCommand';
import { PlayerSessionService } from '../../auth/services/PlayerSessionService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav-component.html',
  styleUrl: './nav-component.scss',
  imports: [RouterOutlet],
  providers: [LogoutCommand],
})
export class NavComponent {
  protected playerSession = inject(PlayerSessionService);
  private logoutCommand = inject(LogoutCommand);
  private router = inject(Router);

  protected onLogout(): void {
    this.logoutCommand.execute();
    this.router.navigate(['/']);
  }
}
