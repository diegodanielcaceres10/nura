import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { LocaleService } from './app/i18n/locale.service';

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

const bootstrap = async (): Promise<void> => {
  const locale = LocaleService.resolveStartupLocale(navigator.language);
  document.documentElement.lang = locale;
  (globalThis as { $localize?: { locale?: string } }).$localize = (globalThis as { $localize?: { locale?: string } }).$localize ?? {};
  if ((globalThis as { $localize?: { locale?: string } }).$localize) {
    (globalThis as { $localize?: { locale?: string } }).$localize!.locale = locale;
  }

  await loadLocaleTranslations(locale);
  const { App } = await import('./app/app');
  const providers = [...(appConfig.providers ?? []), { provide: LOCALE_ID, useValue: locale }];
  await bootstrapApplication(App, { ...appConfig, providers });
};

bootstrap().catch((err) => console.error(err));
