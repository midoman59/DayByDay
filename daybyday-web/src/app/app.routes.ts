import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'today', pathMatch: 'full' },
  {
    path: 'today',
    loadComponent: () => import('./features/today/today.component').then((m) => m.TodayComponent),
  },
  {
    path: 'today/add',
    loadComponent: () => import('./features/today/add/today-add.component').then((m) => m.TodayAddComponent),
  },
  {
    path: 'backlog',
    loadComponent: () => import('./features/backlog/backlog.component').then((m) => m.BacklogComponent),
  },
  {
    path: 'backlog/new',
    loadComponent: () => import('./features/backlog/item-edit/item-edit.component').then((m) => m.ItemEditComponent),
  },
  {
    path: 'backlog/:id/edit',
    loadComponent: () => import('./features/backlog/item-edit/item-edit.component').then((m) => m.ItemEditComponent),
  },
  { path: '**', redirectTo: 'today' },
];
