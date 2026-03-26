import type { Routes } from '@angular/router';
import { isPlayerLoggedInGuard } from './auth/guards/is-player-logged-in.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/page/home-page').then((m) => m.HomePage) },
  {
    path: '',
    loadComponent: () => import('./nav/component/nav-component').then((m) => m.NavComponent),
    canActivateChild: [isPlayerLoggedInGuard],
    children: [
      {
        path: 'game',
        loadComponent: () => import('./game/page/game-page').then((m) => m.GamePage),
      },
      {
        path: 'stats',
        loadComponent: () => import('./stats/page/stats-page').then((m) => m.StatsPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
