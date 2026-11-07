import { describe, expect, it } from 'vitest';
import { serverRoutes } from './app.routes.server';

/**
 * Server routes spec.
 *
 * In short: it guarantees that the build prerenders one page per supported language, so
 * a language that the router accepts never ends up without its static HTML.
 *
 * Guarantees
 * - The :lang route is prerendered once for each supported language, with no repeats.
 *
 * Not covered
 * - The prerender output itself: that is produced and checked by the build.
 */

const langRoute = serverRoutes.find((route) => route.path === ':lang');

describe('serverRoutes', () => {
  it('prerenders the :lang route once for each supported language', async () => {
    const getPrerenderParams = (langRoute as { getPrerenderParams?: () => Promise<Record<string, string>[]> }).getPrerenderParams;

    const params = (await getPrerenderParams?.()) ?? [];

    expect(params.map((param) => param['lang']).sort()).toEqual(['de', 'en', 'es', 'fr', 'it', 'pt']);
  });
});
