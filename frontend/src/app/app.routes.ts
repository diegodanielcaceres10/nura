import { CanMatchFn, Routes } from '@angular/router';
import { PortfolioPage } from './portfolio-page';

const supportedLangs = new Set(['es', 'en', 'pt']);

const supportedLangRoute: CanMatchFn = (_, segments) => {
  const lang = segments[0]?.path?.toLowerCase();
  return !!lang && supportedLangs.has(lang);
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: PortfolioPage },
  { path: ':lang', component: PortfolioPage, canMatch: [supportedLangRoute] },
  { path: '**', redirectTo: 'es' },
];
