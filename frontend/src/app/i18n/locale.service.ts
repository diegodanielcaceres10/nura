import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

const SUPPORTED_LOCALES = ['en', 'es', 'pt'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: AppLocale = 'es';
const LOCALE_PARAM = 'lang';
const LOCALE_STORAGE_KEY = 'app_locale';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);

  getCurrentLocale(): AppLocale {
    const fromHtml = this.document.documentElement.lang?.trim().toLowerCase();
    return this.normalizeLocale(fromHtml);
  }

  static resolveStartupLocale(browserLang?: string): AppLocale {
    const queryLocale = this.readQueryLocale();
    if (queryLocale) {
      return queryLocale;
    }

    const persisted = this.readPersistedLocale();
    if (persisted) {
      return persisted;
    }

    const browser = (browserLang ?? '').trim().toLowerCase();
    return this.normalizeStatic(browser);
  }

  changeLocale(locale: string): void {
    const normalized = this.normalizeLocale(locale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, normalized);

    const url = new URL(window.location.href);
    url.searchParams.set(LOCALE_PARAM, normalized);
    window.location.assign(url.toString());
  }

  private normalizeLocale(locale: string | null | undefined): AppLocale {
    return LocaleService.normalizeStatic(locale ?? '');
  }

  private static normalizeStatic(locale: string): AppLocale {
    const short = locale.split('-')[0] as AppLocale;
    return SUPPORTED_LOCALES.includes(short) ? short : DEFAULT_LOCALE;
  }

  private static readQueryLocale(): AppLocale | null {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(LOCALE_PARAM);
    if (!fromQuery) {
      return null;
    }

    return this.normalizeStatic(fromQuery);
  }

  private static readPersistedLocale(): AppLocale | null {
    try {
      const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      return value ? this.normalizeStatic(value) : null;
    } catch {
      return null;
    }
  }
}
