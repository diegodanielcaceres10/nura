import { Routes } from '@angular/router';
import { redirectToStartupLocale, supportedLocaleCanMatch } from './core/routing/locale-routing';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/language-selector/language-selector.page').then((m) => m.LanguageSelectorPage), pathMatch: 'full' },
  { path: ':lang/work/:id', loadComponent: () => import('./features/work/work-page').then((m) => m.WorkPage), canMatch: [supportedLocaleCanMatch] },
  { path: ':lang/case-studies/:slug', loadComponent: () => import('./features/case-study/case-study-page').then((m) => m.CaseStudyPage), canMatch: [supportedLocaleCanMatch] },
  { path: ':lang', loadComponent: () => import('./features/portfolio/portfolio-page').then((m) => m.PortfolioPage), canMatch: [supportedLocaleCanMatch] },
  { path: '**', redirectTo: redirectToStartupLocale },
];
