import { CanMatchFn, RedirectFunction, Routes, UrlSegment } from '@angular/router';
import { LocaleService, SUPPORTED_LOCALES } from './core/services/locale/locale.service';

const supportedLangs = new Set<string>(SUPPORTED_LOCALES);

const supportedLangRoute: CanMatchFn = (_, segments) => {
  const lang = segments[0]?.path?.toLowerCase();
  return !!lang && supportedLangs.has(lang);
};

const redirectWithLocale: RedirectFunction = ({ url }) => {
  const locale = LocaleService.resolveStartupLocale();
  const path = url.map((segment: UrlSegment) => segment.path).join('/');
  return `/${locale}${path ? '/' + path : ''}`;
};

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/language-selector/language-selector.page').then((m) => m.LanguageSelectorPage), pathMatch: 'full' },
  { path: ':lang/work/:id', loadComponent: () => import('./features/work/work-page').then((m) => m.WorkPage), canMatch: [supportedLangRoute] },
  { path: ':lang/case-studies/:slug', loadComponent: () => import('./features/case-study/case-study-page').then((m) => m.CaseStudyPage), canMatch: [supportedLangRoute] },
  { path: ':lang', loadComponent: () => import('./features/portfolio/portfolio-page').then((m) => m.PortfolioPage), canMatch: [supportedLangRoute] },
  { path: '**', redirectTo: redirectWithLocale },
];
