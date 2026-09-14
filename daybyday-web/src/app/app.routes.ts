import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'timer',
    loadComponent: () => import('./features/timer/timer-page.component').then((m) => m.TimerPageComponent),
  },
  {
    path: 'standup',
    loadComponent: () => import('./features/standup/team-list/team-list.component').then((m) => m.TeamListComponent),
  },
  {
    path: 'standup/new',
    loadComponent: () => import('./features/standup/team-edit/team-edit.component').then((m) => m.TeamEditComponent),
  },
  {
    path: 'standup/:id/edit',
    loadComponent: () => import('./features/standup/team-edit/team-edit.component').then((m) => m.TeamEditComponent),
  },
  {
    path: 'standup/:id/session',
    loadComponent: () => import('./features/standup/session/standup-session.component').then((m) => m.StandupSessionComponent),
  },
  { path: '**', redirectTo: '' },
];
