import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

const SUPPORTED_LOCALES = ['en', 'es', 'pt'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: AppLocale = 'es';
const LOCALE_PARAM = 'lang';
const LOCALE_STORAGE_KEY = 'app_locale';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);

  getCurrentLocale(): AppLocale {
    const fromHtml = this.document?.documentElement?.lang?.trim().toLowerCase();
    return this.normalizeLocale(fromHtml);
  }

  static resolveStartupLocale(): AppLocale {
    if (!isBrowser) {
      return DEFAULT_LOCALE;
    }

    const pathLocale = this.readPathLocale();
    if (pathLocale) return pathLocale;

    const queryLocale = this.readQueryLocale();
    if (queryLocale) return queryLocale;

    return DEFAULT_LOCALE;
  }

  changeLocale(locale: string): void {
    if (!isBrowser) return;

    const normalized = this.normalizeLocale(locale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, normalized);
    const targetUrl = LocaleService.buildLocaleUrl(normalized);
    window.location.assign(targetUrl.toString());
  }

  private normalizeLocale(locale: string | null | undefined): AppLocale {
    return LocaleService.normalizeStatic(locale ?? '');
  }

  private static normalizeStatic(locale: string): AppLocale {
    const short = locale.split('-')[0] as AppLocale;
    return SUPPORTED_LOCALES.includes(short) ? short : DEFAULT_LOCALE;
  }

  private static readQueryLocale(): AppLocale | null {
    if (!isBrowser) return null;

    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(LOCALE_PARAM);
    if (!fromQuery) return null;

    return this.normalizeStatic(fromQuery);
  }

  static syncLocalePath(locale: AppLocale): void {
    if (!isBrowser) return;

    const normalized = this.normalizeStatic(locale);
    const current = new URL(window.location.href);
    const target = this.buildLocaleUrl(normalized);

    if (target.pathname !== current.pathname || target.search !== current.search) {
      window.history.replaceState({}, '', `${target.pathname}${target.search}${target.hash}`);
    }
  }

  private static readPathLocale(): AppLocale | null {
    if (!isBrowser) return null;

    const segments = this.getRelativePathSegments();
    const first = segments[0];
    if (!first) return null;

    return SUPPORTED_LOCALES.includes(first as AppLocale) ? (first as AppLocale) : null;
  }

  private static buildLocaleUrl(locale: AppLocale): URL {
    if (!isBrowser) {
      return new URL('http://localhost');
    }

    const current = new URL(window.location.href);
    const baseSegments = this.getBasePathSegments();
    const relativeSegments = this.getRelativePathSegments();

    const remaining = relativeSegments[0] && SUPPORTED_LOCALES.includes(relativeSegments[0] as AppLocale) ? relativeSegments.slice(1) : relativeSegments;

    const nextPath = [''].concat(baseSegments, [locale], remaining).join('/');

    current.pathname = nextPath;
    current.searchParams.delete(LOCALE_PARAM);

    return current;
  }

  private static getRelativePathSegments(): string[] {
    if (!isBrowser) return [];

    const baseSegments = this.getBasePathSegments();
    const pathSegments = window.location.pathname.split('/').filter(Boolean);

    const sameBase = baseSegments.every((segment, index) => pathSegments[index] === segment);

    return sameBase ? pathSegments.slice(baseSegments.length) : pathSegments;
  }

  private static getBasePathSegments(): string[] {
    if (!isBrowser) return [];

    const baseEl = document.querySelector('base');
    const baseHref = baseEl?.getAttribute('href') ?? '/';
    const baseUrl = new URL(baseHref, window.location.origin);

    return baseUrl.pathname.split('/').filter(Boolean);
  }
}
