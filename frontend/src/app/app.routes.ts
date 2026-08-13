import { CanMatchFn, Routes } from '@angular/router';
import { LanguageSelectorPage } from './language-selector/language-selector.page';
import { PortfolioPage } from './portfolio/portfolio-page';

const supportedLangs = new Set(['es', 'en', 'pt']);

const supportedLangRoute: CanMatchFn = (_, segments) => {
  const lang = segments[0]?.path?.toLowerCase();
  return !!lang && supportedLangs.has(lang);
};

export const routes: Routes = [
  { path: '', component: LanguageSelectorPage, pathMatch: 'full' },
  { path: ':lang', component: PortfolioPage, canMatch: [supportedLangRoute] },
  { path: '**', redirectTo: '' },
];
