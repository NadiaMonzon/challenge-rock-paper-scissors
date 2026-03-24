import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PlayerSessionService } from '../../player/services/PlayerSessionService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav-component.html',
  imports: [RouterLink, RouterOutlet],
})
export class NavComponent {
  protected playerSession = inject(PlayerSessionService);
}
