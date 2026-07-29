import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LanguageSelectorPage } from './language-selector/language-selector-page';
import { PortfolioPage } from './portfolio/portfolio-page';
import { routes } from './app.routes';

describe('app routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('should render the language selector at the root path', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/', LanguageSelectorPage);

    expect(TestBed.inject(Router).url).toBe('/');
    expect(harness.routeNativeElement?.querySelector('.lang-selector')).toBeTruthy();
  });

  it.each(['es', 'en', 'pt'])('should render the portfolio for supported locale "%s"', async (locale) => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(`/${locale}`, PortfolioPage);

    expect(TestBed.inject(Router).url).toBe(`/${locale}`);
    expect(harness.routeNativeElement?.querySelector('app-header-component')).toBeTruthy();
    expect(harness.routeNativeElement?.querySelector('app-home-component')).toBeTruthy();
  });

  it('should redirect unsupported locales to the language selector', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fr', LanguageSelectorPage);

    expect(TestBed.inject(Router).url).toBe('/');
    expect(harness.routeNativeElement?.querySelector('.lang-selector')).toBeTruthy();
  });
});
