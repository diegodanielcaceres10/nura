import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./login/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard-page').then((m) => m.DashboardPage),
  },
  { path: '**', redirectTo: 'login' },
];
