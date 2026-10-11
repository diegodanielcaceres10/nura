import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';

describe('routes', () => {
  it('declares the case-studies route before the language route', () => {
    const paths = routes.map((route) => route.path);

    expect(paths).toContain(':lang/case-studies/:slug');
    expect(paths.indexOf(':lang/case-studies/:slug')).toBeLessThan(paths.indexOf(':lang'));
  });

  it('only matches the case-studies route for supported languages', () => {
    const route = routes.find((item) => item.path === ':lang/case-studies/:slug');

    expect(route?.canMatch?.length).toBe(1);
  });
});
