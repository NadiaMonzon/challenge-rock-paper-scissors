import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/page/home-page').then((m) => m.HomePage) },
  {
    path: '',
    loadComponent: () => import('./nav/component/nav-component').then((m) => m.NavComponent),
    children: [
      {
        path: 'game',
        loadComponent: () => import('./game/page/game-page').then((m) => m.GamePage),
      },
    ],
  },
];
