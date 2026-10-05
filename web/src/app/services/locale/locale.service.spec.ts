import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppLocale, LocaleService } from './locale.service';

const setUrl = (url: string): void => window.history.replaceState({}, '', url);

const setBrowserLanguages = (languages: string[], language = languages[0] ?? ''): void => {
  vi.stubGlobal('navigator', { languages, language });
};

// jsdom cannot navigate and location.assign is not spy-able, so location is swapped for a plain object.
const stubNavigation = () => {
  const assign = vi.fn<(url: string) => void>();
  const { href, origin, pathname, search, hash } = window.location;
  vi.stubGlobal('location', { href, origin, pathname, search, hash, assign });
  return assign;
};

const redirectTarget = (assign: ReturnType<typeof stubNavigation>): URL => {
  expect(assign).toHaveBeenCalledTimes(1);
  return new URL(assign.mock.calls[0][0]);
};

const createService = (doc: unknown = document): LocaleService => {
  TestBed.configureTestingModule({ providers: [{ provide: DOCUMENT, useValue: doc }] });
  return TestBed.inject(LocaleService);
};

/**
 * LocaleService spec.
 *
 * In short: it guarantees that the app opens in the right language and that the URL
 * always carries the right locale segment, in the browser, under a base href and in SSR.
 *
 * Guarantees
 * - Startup locale: path (/pt) > ?lang= > browser languages > default 'es'. Unsupported
 *   values are skipped instead of blocking later sources; regional codes and casing are
 *   normalized (pt-BR, EN, PT-br).
 * - getCurrentLocale: reads <html lang> and normalizes it; falls back to 'es' for invalid
 *   or empty values and for a document without documentElement.
 * - changeLocale: redirects to the right URL. It adds or replaces the locale segment, keeps
 *   the rest of the path, the other params and the hash, and drops `lang`. Unsupported
 *   locales become 'es'.
 * - syncLocalePath: fixes the URL without reloading; leaves it alone when it is already
 *   correct or when it is the landing page without a locale.
 * - Base href (/nura/): every method respects the base; URLs outside it are not rewritten.
 * - SSR: without window it does not read the URL, touch the history or throw.
 *
 * Not covered
 * - Real browser navigation: location is stubbed because jsdom cannot navigate.
 * - Integration with the router, main.ts and the language selector (their specs mock this
 *   service) and the Cypress e2e specs, which do not check locale behavior.
 * - An upper-case locale in the path (/PT), which the service does not recognize.
 * - Translation loading.
 */
describe('LocaleService', () => {
  beforeEach(() => {
    setUrl('/');
    document.documentElement.lang = '';
    TestBed.resetTestingModule();
    // Empty by default so the real browser language never leaks into a test.
    setBrowserLanguages([]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('resolveStartupLocale', () => {
    it.each<[string, string]>([
      ['/pt', 'pt'],
      ['/en/', 'en'],
      ['/en/work/3', 'en'],
    ])('reads the locale from the first path segment (%s)', (url, expected) => {
      setUrl(url);

      expect(LocaleService.resolveStartupLocale()).toBe(expected);
    });

    it('prefers the path locale over the query param and the browser language', () => {
      setUrl('/pt?lang=es');
      setBrowserLanguages(['en-US']);

      expect(LocaleService.resolveStartupLocale()).toBe('pt');
    });

    it('prefers the query param over the browser language', () => {
      setUrl('/?lang=pt');
      setBrowserLanguages(['en-US']);

      expect(LocaleService.resolveStartupLocale()).toBe('pt');
    });

    it.each<[string, string]>([
      ['pt-BR', 'pt'],
      ['EN', 'en'],
    ])('normalizes the query param value %s', (value, expected) => {
      setUrl(`/?lang=${value}`);

      expect(LocaleService.resolveStartupLocale()).toBe(expected);
    });

    it('skips an unsupported query param and uses the browser language', () => {
      setUrl('/?lang=fr');
      setBrowserLanguages(['pt-BR']);

      expect(LocaleService.resolveStartupLocale()).toBe('pt');
    });

    it('falls back to the default when the query param and the browser language are both unsupported', () => {
      setUrl('/?lang=fr');
      setBrowserLanguages(['de-DE']);

      expect(LocaleService.resolveStartupLocale()).toBe('es');
    });

    it('ignores a first path segment that is not a locale and uses the browser language', () => {
      setUrl('/about');
      setBrowserLanguages(['pt-BR']);

      expect(LocaleService.resolveStartupLocale()).toBe('pt');
    });

    describe('browser language', () => {
      it.each<[string[], string]>([
        [['pt-BR', 'pt'], 'pt'],
        [['de-DE', 'pt-BR'], 'pt'],
        [['en-US', 'pt-BR'], 'en'],
        [['PT-br'], 'pt'],
      ])('picks the first supported language of %j', (languages, expected) => {
        setBrowserLanguages(languages);

        expect(LocaleService.resolveStartupLocale()).toBe(expected);
      });

      it('uses navigator.language when navigator.languages is empty', () => {
        setBrowserLanguages([], 'pt-BR');

        expect(LocaleService.resolveStartupLocale()).toBe('pt');
      });

      it('falls back to the default when no browser language is supported', () => {
        setBrowserLanguages(['de-DE']);

        expect(LocaleService.resolveStartupLocale()).toBe('es');
      });

      it('falls back to the default when the browser reports nothing', () => {
        expect(LocaleService.resolveStartupLocale()).toBe('es');
      });
    });
  });

  describe('getCurrentLocale', () => {
    it.each<[string, string]>([
      ['pt-BR', 'pt'],
      ['EN', 'en'],
      ['  pt ', 'pt'],
      ['de-DE', 'es'],
      ['', 'es'],
    ])('maps <html lang="%s"> to %s', (lang, expected) => {
      document.documentElement.lang = lang;

      expect(createService().getCurrentLocale()).toBe(expected);
    });

    it('falls back to the default when the document has no documentElement', () => {
      expect(createService({}).getCurrentLocale()).toBe('es');
    });
  });

  describe('changeLocale', () => {
    it.each<[string, string, string]>([
      ['/', 'en', '/en/'],
      ['/about', 'en', '/en/about'],
      ['/pt/about', 'en', '/en/about'],
      ['/pt', 'en', '/en/'],
      ['/', 'pt-BR', '/pt/'],
      ['/', 'fr-FR', '/es/'],
    ])('from %s to %s redirects to %s', (from, locale, expectedPath) => {
      setUrl(from);
      const assign = stubNavigation();

      createService().changeLocale(locale);

      expect(redirectTarget(assign).pathname).toBe(expectedPath);
    });

    it('drops the lang param and keeps the other params and the hash', () => {
      setUrl('/about?lang=pt&utm=1#top');
      const assign = stubNavigation();

      createService().changeLocale('en');

      const target = redirectTarget(assign);
      expect(target.pathname).toBe('/en/about');
      expect(target.search).toBe('?utm=1');
      expect(target.hash).toBe('#top');
    });
  });

  describe('syncLocalePath', () => {
    it('adds the locale segment, drops the lang param and keeps the other params and the hash', () => {
      setUrl('/about?lang=pt&utm=1#section');

      LocaleService.syncLocalePath('pt');

      expect(window.location.pathname).toBe('/pt/about');
      expect(window.location.search).toBe('?utm=1');
      expect(window.location.hash).toBe('#section');
    });

    it('replaces a different locale segment', () => {
      setUrl('/en/about');

      LocaleService.syncLocalePath('pt');

      expect(window.location.pathname).toBe('/pt/about');
    });

    it.each(['/pt/about', '/pt/'])('does not rewrite the URL when %s is already correct', (url) => {
      setUrl(url);
      const replaceState = vi.spyOn(window.history, 'replaceState');

      LocaleService.syncLocalePath('pt');

      expect(replaceState).not.toHaveBeenCalled();
    });

    it('leaves the landing page without a locale untouched', () => {
      const replaceState = vi.spyOn(window.history, 'replaceState');

      LocaleService.syncLocalePath('es');

      expect(replaceState).not.toHaveBeenCalled();
      expect(window.location.pathname).toBe('/');
    });

    it('falls back to the default locale for an unsupported value', () => {
      setUrl('/about');

      LocaleService.syncLocalePath('fr' as AppLocale);

      expect(window.location.pathname).toBe('/es/about');
    });
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

    it('reads the locale segment that follows the base path', () => {
      setUrl('/nura/pt/about');
      setBrowserLanguages(['en-US']);

      expect(LocaleService.resolveStartupLocale()).toBe('pt');
    });

    it('syncLocalePath inserts the locale after the base path', () => {
      setUrl('/nura/about');

      LocaleService.syncLocalePath('pt');

      expect(window.location.pathname).toBe('/nura/pt/about');
    });

    it('syncLocalePath replaces an existing locale segment and keeps the base path', () => {
      setUrl('/nura/es/about');

      LocaleService.syncLocalePath('en');

      expect(window.location.pathname).toBe('/nura/en/about');
    });

    it('changeLocale keeps the base path', () => {
      setUrl('/nura/pt/about');
      const assign = stubNavigation();

      createService().changeLocale('en');

      expect(redirectTarget(assign).pathname).toBe('/nura/en/about');
    });

    it('syncLocalePath leaves a URL outside the base untouched', () => {
      setUrl('/other/path');
      const replaceState = vi.spyOn(window.history, 'replaceState');

      LocaleService.syncLocalePath('pt');

      expect(replaceState).not.toHaveBeenCalled();
      expect(window.location.pathname).toBe('/other/path');
    });

    it('changeLocale sends a URL outside the base to the locale landing under the base', () => {
      setUrl('/other/path');
      const assign = stubNavigation();

      createService().changeLocale('pt');

      expect(redirectTarget(assign).pathname).toBe('/nura/pt/');
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

    it('resolveStartupLocale returns the default locale without reading the URL', () => {
      history.replaceState({}, '', '/pt?lang=en');

      expect(SsrLocaleService.resolveStartupLocale()).toBe('es');
    });

    it('syncLocalePath does not touch the browser history', () => {
      history.replaceState({}, '', '/about');
      const replaceSpy = vi.spyOn(history, 'replaceState');

      SsrLocaleService.syncLocalePath('pt');

      expect(replaceSpy).not.toHaveBeenCalled();
    });

    it('changeLocale returns without touching window', async () => {
      const { Injector, runInInjectionContext } = await import('@angular/core');
      const { DOCUMENT: SsrDocument } = await import('@angular/common');
      const injector = Injector.create({ providers: [{ provide: SsrDocument, useValue: document }] });
      const service = runInInjectionContext(injector, () => new SsrLocaleService());

      // Reaching window.location would throw a TypeError because window is undefined here.
      expect(() => service.changeLocale('pt')).not.toThrow();
    });
  });
});
