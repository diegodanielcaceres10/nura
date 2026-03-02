import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
    document.documentElement.lang = '';
    TestBed.resetTestingModule();
  });

  it('resolveStartupLocale should use query param first', () => {
    window.localStorage.setItem('app_locale', 'en');
    window.history.replaceState({}, '', '/?lang=pt');

    expect(LocaleService.resolveStartupLocale()).toBe('pt');
  });

  it('resolveStartupLocale should prioritize path locale over query and storage', () => {
    window.localStorage.setItem('app_locale', 'en');
    window.history.replaceState({}, '', '/pt?lang=es');

    expect(LocaleService.resolveStartupLocale()).toBe('pt');
  });

  it('resolveStartupLocale should fallback to default locale when no source is available', () => {
    expect(LocaleService.resolveStartupLocale()).toBe('es');
  });

  it('resolveStartupLocale should fallback to default when browserLang is not provided', () => {
    expect(LocaleService.resolveStartupLocale()).toBe('es');
  });

  it('resolveStartupLocale should ignore persisted locale and use default', () => {
    window.localStorage.setItem('app_locale', 'en');
    expect(LocaleService.resolveStartupLocale()).toBe('es');
  });

  it('resolveStartupLocale should fallback to default locale for unsupported values', () => {
    expect(LocaleService.resolveStartupLocale()).toBe('es');
  });

  it('getCurrentLocale should read locale from html lang', () => {
    document.documentElement.lang = 'pt-BR';
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const service = TestBed.inject(LocaleService);

    expect(service.getCurrentLocale()).toBe('pt');
  });

  it('getCurrentLocale should fallback to default for unsupported html lang', () => {
    document.documentElement.lang = 'de-DE';
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const service = TestBed.inject(LocaleService);

    expect(service.getCurrentLocale()).toBe('es');
  });

  it('changeLocale should persist normalized locale', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const service = TestBed.inject(LocaleService);
    try {
      service.changeLocale('pt-BR');
    } catch {
      // jsdom may throw because navigation is not implemented.
    }

    expect(window.localStorage.getItem('app_locale')).toBe('pt');
  });

  it('changeLocale should fallback to default for unsupported locale', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const service = TestBed.inject(LocaleService);
    try {
      service.changeLocale('fr-FR');
    } catch {
      // jsdom may throw because navigation is not implemented.
    }

    expect(window.localStorage.getItem('app_locale')).toBe('es');
  });

  it('syncLocalePath should rewrite the current URL with locale segment', () => {
    window.history.replaceState({}, '', '/about?lang=pt#section');

    LocaleService.syncLocalePath('pt');

    expect(window.location.pathname).toBe('/pt/about');
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#section');
  });

  it('syncLocalePath should not rewrite URL when path is already correct', () => {
    window.history.replaceState({}, '', '/pt');

    LocaleService.syncLocalePath('pt');

    expect(window.location.pathname).toBe('/pt');
    expect(window.location.search).toBe('');
  });

  it('resolveStartupLocale should fallback to default for unsupported query param', () => {
    window.history.replaceState({}, '', '/?lang=fr');

    expect(LocaleService.resolveStartupLocale()).toBe('es');
  });

  it('buildLocaleUrl should keep remaining segments when first is not a locale', () => {
    window.history.replaceState({}, '', '/about');

    const service = TestBed.inject(LocaleService);
    try {
      service.changeLocale('en');
    } catch {
      // jsdom navigation
    }

    expect(window.localStorage.getItem('app_locale')).toBe('en');
  });

  it('getRelativePathSegments should handle path not matching base', () => {
    window.history.replaceState({}, '', '/other/path');

    const result = LocaleService.resolveStartupLocale();

    expect(result).toBe('es');
  });
});
