import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'player/:id',
    loadComponent: () =>
      import('./pages/player/player.component').then((m) => m.PlayerComponent),
  },
  { path: '**', redirectTo: '' },
];
