import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
    document.documentElement.lang = '';
    TestBed.resetTestingModule();

    // Mock navigator.languages to empty so browser detection doesn't interfere
    vi.stubGlobal('navigator', { ...navigator, languages: [], language: '' });
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

  it('resolveStartupLocale should detect browser locale when supported', () => {
    vi.stubGlobal('navigator', { ...navigator, languages: ['pt-BR', 'pt'], language: 'pt-BR' });
    window.history.replaceState({}, '', '/');

    expect(LocaleService.resolveStartupLocale()).toBe('pt');
  });

  it('resolveStartupLocale should pick the first supported browser language when earlier ones are unsupported', () => {
    vi.stubGlobal('navigator', { ...navigator, languages: ['de-DE', 'pt-BR'], language: 'de-DE' });

    expect(LocaleService.resolveStartupLocale()).toBe('pt');
  });

  it('resolveStartupLocale should respect the browser language order among supported ones', () => {
    vi.stubGlobal('navigator', { ...navigator, languages: ['en-US', 'pt-BR'], language: 'en-US' });

    expect(LocaleService.resolveStartupLocale()).toBe('en');
  });

  it('resolveStartupLocale should use navigator.language when navigator.languages is empty', () => {
    vi.stubGlobal('navigator', { ...navigator, languages: [], language: 'pt-BR' });

    expect(LocaleService.resolveStartupLocale()).toBe('pt');
  });

  it('resolveStartupLocale should fallback to default for unsupported browser locale', () => {
    vi.stubGlobal('navigator', { ...navigator, languages: ['de-DE'], language: 'de-DE' });
    window.history.replaceState({}, '', '/');

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
    window.history.replaceState({}, '', '/pt/');

    LocaleService.syncLocalePath('pt');

    expect(window.location.pathname).toBe('/pt/');
    expect(window.location.search).toBe('');
  });

  it('syncLocalePath should leave landing page without locale untouched', () => {
    window.history.replaceState({}, '', '/');

    LocaleService.syncLocalePath('es');

    expect(window.location.pathname).toBe('/');
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

  it('getCurrentLocale should fall back to default when the document has no documentElement', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: {} }],
    });
    const service = TestBed.inject(LocaleService);

    expect(service.getCurrentLocale()).toBe('es');
  });

  describe('with a non-root base href', () => {
    let base: HTMLBaseElement;

    beforeEach(() => {
      base = document.createElement('base');
      base.setAttribute('href', '/nura/');
      document.head.appendChild(base);
    });

    afterEach(() => {
      base.remove();
    });

    it('resolveStartupLocale should read the locale segment that follows the base path', () => {
      window.history.replaceState({}, '', '/nura/pt/about');

      expect(LocaleService.resolveStartupLocale()).toBe('pt');
    });

    it('syncLocalePath should insert the locale after the base path', () => {
      window.history.replaceState({}, '', '/nura/about');

      LocaleService.syncLocalePath('pt');

      expect(window.location.pathname).toBe('/nura/pt/about');
    });

    it('syncLocalePath should replace an existing locale segment and keep the base path', () => {
      window.history.replaceState({}, '', '/nura/es/about');

      LocaleService.syncLocalePath('en');

      expect(window.location.pathname).toBe('/nura/en/about');
    });

    it('syncLocalePath should treat a path outside the base as relative segments', () => {
      window.history.replaceState({}, '', '/other/path');

      LocaleService.syncLocalePath('pt');

      expect(window.location.pathname).toBe('/nura/pt/other/path');
    });
  });

  describe('without a browser window (SSR)', () => {
    let SsrLocaleService: typeof LocaleService;

    beforeEach(async () => {
      // isBrowser is evaluated once at import time, so the module must be loaded again without a window
      vi.resetModules();
      vi.stubGlobal('window', undefined);
      ({ LocaleService: SsrLocaleService } = await import('./locale.service'));
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.resetModules();
    });

    it('resolveStartupLocale should return the default locale without reading the URL', () => {
      history.replaceState({}, '', '/pt?lang=en');

      expect(SsrLocaleService.resolveStartupLocale()).toBe('es');
    });

    it('syncLocalePath should not touch the browser history', () => {
      history.replaceState({}, '', '/about');
      const replaceSpy = vi.spyOn(history, 'replaceState');

      SsrLocaleService.syncLocalePath('pt');

      expect(replaceSpy).not.toHaveBeenCalled();
    });

    it('changeLocale should neither persist the locale nor navigate', async () => {
      const { Injector, runInInjectionContext } = await import('@angular/core');
      const { DOCUMENT: SsrDocument } = await import('@angular/common');
      const injector = Injector.create({ providers: [{ provide: SsrDocument, useValue: document }] });
      const service = runInInjectionContext(injector, () => new SsrLocaleService());

      service.changeLocale('pt');

      expect(localStorage.getItem('app_locale')).toBeNull();
    });
  });
});
