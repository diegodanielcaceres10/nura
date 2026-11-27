import { CanMatchFn, RedirectFunction, UrlSegment } from '@angular/router';
import { LocaleService, SUPPORTED_LOCALES } from '../services/locale/locale.service';

const supportedLocales = new Set<string>(SUPPORTED_LOCALES);

export const supportedLocaleCanMatch: CanMatchFn = (_, segments) => {
  const locale = segments[0]?.path?.toLowerCase();
  return !!locale && supportedLocales.has(locale);
};

export const redirectToStartupLocale: RedirectFunction = ({ url }) => {
  const locale = LocaleService.resolveStartupLocale();
  const path = url.map((segment: UrlSegment) => segment.path).join('/');
  return `/${locale}${path ? '/' + path : ''}`;
};
