import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerSessionService } from '../services/PlayerSessionService';

export const isPlayerLoggedInGuard = () => {
  const playerSession = inject(PlayerSessionService);
  const router = inject(Router);
  return playerSession.currentPlayer() !== null || router.createUrlTree(['/']);
};
