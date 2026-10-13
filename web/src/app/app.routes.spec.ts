import { TestBed } from '@angular/core/testing';
import { CanMatchFn, RedirectFunction, Route, Router, UrlSegment, provideRouter } from '@angular/router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { routes } from './app.routes';
import { LanguageSelectorPage } from './language-selector/language-selector.page';
import { PortfolioPage } from './portfolio/portfolio-page';
import { WorkPage } from './work/work-page';
import { CaseStudyPage } from './case-study/case-study-page';
import { LocaleService } from './services/locale/locale.service';

const langRoutes = routes.filter((route) => route.path?.startsWith(':lang'));
const wildcardRoute = routes.find((route) => route.path === '**') as Route;

// Both helpers are private to app.routes.ts, so they are exercised through the route config
const supportedLangRoute = langRoutes[0].canMatch?.[0] as CanMatchFn;
const redirectWithLocale = wildcardRoute.redirectTo as RedirectFunction;

const toSegments = (...paths: string[]): UrlSegment[] => paths.map((path) => new UrlSegment(path, {}));
const canMatch = (...paths: string[]): boolean => supportedLangRoute({} as Route, toSegments(...paths)) as boolean;
const redirect = (...paths: string[]): string => redirectWithLocale({ url: toSegments(...paths) } as never) as string;

describe('routes', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('declares the case-studies route before the language route', () => {
    const paths = routes.map((route) => route.path);

    expect(paths).toContain(':lang/case-studies/:slug');
    expect(paths.indexOf(':lang/case-studies/:slug')).toBeLessThan(paths.indexOf(':lang'));
  });

  it('only matches the case-studies route for supported languages', () => {
    const route = routes.find((item) => item.path === ':lang/case-studies/:slug');

    expect(route?.canMatch?.length).toBe(1);
  });

  describe('route table', () => {
    it('declares the expected paths in order, ending with the wildcard', () => {
      expect(routes.map((route) => route.path)).toEqual(['', ':lang/work/:id', ':lang/case-studies/:slug', ':lang', '**']);
    });

    it('maps each path to its page component', () => {
      const componentByPath = Object.fromEntries(routes.map((route) => [route.path, route.component]));

      expect(componentByPath['']).toBe(LanguageSelectorPage);
      expect(componentByPath[':lang/work/:id']).toBe(WorkPage);
      expect(componentByPath[':lang/case-studies/:slug']).toBe(CaseStudyPage);
      expect(componentByPath[':lang']).toBe(PortfolioPage);
    });

    it('matches the root path only when it is exactly empty', () => {
      const root = routes.find((route) => route.path === '');

      expect(root?.pathMatch).toBe('full');
      expect(root?.canMatch).toBeUndefined();
    });

    it('guards every language route with the same supported-language check', () => {
      expect(langRoutes).toHaveLength(3);
      langRoutes.forEach((route) => expect(route.canMatch).toEqual([supportedLangRoute]));
    });

    it('redirects through a function instead of a static path', () => {
      expect(typeof wildcardRoute.redirectTo).toBe('function');
      expect(wildcardRoute.component).toBeUndefined();
    });
  });

  describe('supportedLangRoute', () => {
    it.each(['es', 'en', 'pt'])('should match the supported language "%s"', (lang) => {
      expect(canMatch(lang)).toBe(true);
    });

    it('should match regardless of the casing', () => {
      expect(canMatch('ES')).toBe(true);
      expect(canMatch('Pt')).toBe(true);
    });

    it('should only look at the first segment', () => {
      expect(canMatch('en', 'work', '1')).toBe(true);
      expect(canMatch('work', 'en')).toBe(false);
    });

    it.each(['fr', 'de', 'es-ES', 'work', '123'])('should not match the unsupported language "%s"', (lang) => {
      expect(canMatch(lang)).toBe(false);
    });

    it('should not match when there are no segments or the first one is empty', () => {
      expect(canMatch()).toBe(false);
      expect(canMatch('')).toBe(false);
    });
  });

  describe('redirectWithLocale', () => {
    it('should redirect to the resolved startup locale when there is no path', () => {
      vi.spyOn(LocaleService, 'resolveStartupLocale').mockReturnValue('pt');

      expect(redirect()).toBe('/pt');
    });

    it('should prefix the locale to a single segment path', () => {
      vi.spyOn(LocaleService, 'resolveStartupLocale').mockReturnValue('en');

      expect(redirect('work')).toBe('/en/work');
    });

    it('should keep every segment of a nested path, in order', () => {
      vi.spyOn(LocaleService, 'resolveStartupLocale').mockReturnValue('es');

      expect(redirect('case-studies', 'my-slug', 'extra')).toBe('/es/case-studies/my-slug/extra');
    });

    it('should resolve the locale on every redirect', () => {
      const resolveStartupLocale = vi.spyOn(LocaleService, 'resolveStartupLocale').mockReturnValueOnce('en').mockReturnValueOnce('pt');

      expect(redirect('a')).toBe('/en/a');
      expect(redirect('a')).toBe('/pt/a');
      expect(resolveStartupLocale).toHaveBeenCalledTimes(2);
    });
  });

  // Only matching URLs are navigated: an unmatched URL hits the wildcard redirect, see the note in the delivery
  describe('navigation', () => {
    const navigate = async (url: string) => {
      TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
      const router = TestBed.inject(Router);
      await router.navigateByUrl(url);
      return router.routerState.snapshot.root.firstChild;
    };

    it.each([
      ['/', ''],
      ['/es', ':lang'],
      ['/en', ':lang'],
      ['/pt', ':lang'],
      ['/es/work/abc', ':lang/work/:id'],
      ['/pt/case-studies/some-slug', ':lang/case-studies/:slug'],
    ])('should resolve "%s" to the "%s" route', async (url, path) => {
      const match = await navigate(url);

      expect(match?.routeConfig?.path).toBe(path);
    });

    it('should expose the language and id params for a work page', async () => {
      const match = await navigate('/en/work/project-1');

      expect(match?.params).toEqual({ lang: 'en', id: 'project-1' });
    });

    it('should expose the language and slug params for a case study page', async () => {
      const match = await navigate('/pt/case-studies/my-case');

      expect(match?.params).toEqual({ lang: 'pt', slug: 'my-case' });
    });
  });
});
