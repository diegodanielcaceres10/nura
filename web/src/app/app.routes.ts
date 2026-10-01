import { CanMatchFn, RedirectFunction, Routes, UrlSegment } from '@angular/router';
import { LanguageSelectorPage } from './language-selector/language-selector.page';
import { PortfolioPage } from './portfolio/portfolio-page';
import { WorkPage } from './work/work-page';
import { LocaleService } from './services/locale/locale.service';

const supportedLangs = new Set(['es', 'en', 'pt']);

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
  { path: '', component: LanguageSelectorPage, pathMatch: 'full' },
  { path: ':lang/work/:id', component: WorkPage, canMatch: [supportedLangRoute] },
  { path: ':lang', component: PortfolioPage, canMatch: [supportedLangRoute] },
  { path: '**', redirectTo: redirectWithLocale },
];
