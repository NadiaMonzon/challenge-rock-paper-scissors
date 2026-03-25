import { inject } from '@angular/core';
import type { UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { PlayerSessionService } from '../services/PlayerSessionService';

export const isPlayerLoggedInGuard = (): boolean | UrlTree => {
  const playerSession = inject(PlayerSessionService);
  const router = inject(Router);
  return playerSession.currentPlayer() !== null || router.createUrlTree(['/']);
};
