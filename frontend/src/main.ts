import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { bootstrapApplication } from '@angular/platform-browser';
import { LocaleService } from './app/services/locale/locale.service';

const loadLocaleTranslations = async (locale: string): Promise<void> => {
  if (locale === 'en') {
    return;
  }

  const response = await fetch(`./assets/i18n/${locale}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load translations for locale "${locale}"`);
  }

  const translations = (await response.json()) as Record<string, string>;
  loadTranslations(translations);
};

const restoreSpaPathFromRedirect = (): void => {
  const url = new URL(window.location.href);
  const redirectedPath = url.searchParams.get('p');
  if (!redirectedPath) {
    return;
  }

  const basePath = new URL(document.baseURI).pathname.replace(/\/$/, '');
  const normalizedRedirect = redirectedPath.startsWith('/') ? redirectedPath : `/${redirectedPath}`;
  const nextPath = `${basePath}${normalizedRedirect}`.replace(/\/{2,}/g, '/');

  url.searchParams.delete('p');
  const nextSearch = url.searchParams.toString();
  const finalUrl = `${nextPath}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`;
  window.history.replaceState({}, '', finalUrl);
};

const bootstrap = async (): Promise<void> => {
  restoreSpaPathFromRedirect();
  const locale = LocaleService.resolveStartupLocale();
  LocaleService.syncLocalePath(locale);
  document.documentElement.lang = locale;
  (globalThis as { $localize?: { locale?: string } }).$localize = (globalThis as { $localize?: { locale?: string } }).$localize ?? {};
  if ((globalThis as { $localize?: { locale?: string } }).$localize) {
    (globalThis as { $localize?: { locale?: string } }).$localize!.locale = locale;
  }

  await loadLocaleTranslations(locale);
  const { appConfig } = await import('./app/app.config');
  const { App } = await import('./app/app');
  const providers = [...(appConfig.providers ?? []), { provide: LOCALE_ID, useValue: locale }];
  await bootstrapApplication(App, { ...appConfig, providers });
};

bootstrap().catch((err) => console.error(err));
