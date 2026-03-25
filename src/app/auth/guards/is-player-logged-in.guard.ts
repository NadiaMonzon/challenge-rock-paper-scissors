import { inject } from '@angular/core';
import type { UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { CurrentPlayerStore } from '../store/CurrentPlayerStore';

export const isPlayerLoggedInGuard = (): boolean | UrlTree => {
  const playerSession = inject(CurrentPlayerStore);
  const router = inject(Router);
  return playerSession.currentPlayer() !== null || router.createUrlTree(['/']);
};
