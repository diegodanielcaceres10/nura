/**
 * HomeComponent spec.
 *
 * Guarantees: the hero keeps its heading, localized CTA links, images and tech badges,
 * and shows the headline case-study figures without rendering the case studies themselves.
 * Validates: DOM output only (headings, hrefs, alt texts, metric values and labels).
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleService } from '../../services/locale/locale.service';

describe('HomeComponent', () => {
  let component: unknown;
  let fixture: ComponentFixture<unknown>;
  let localeService: { getCurrentLocale: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    localeService = {
      getCurrentLocale: vi.fn(() => 'en'),
    };

    const { HomeComponent } = await import('./home.component');

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: LocaleService, useValue: localeService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the main content', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.home__title-name')?.textContent).toContain('Diego Daniel Caceres');
  });

  it('should not render the case studies, they belong to the portfolio page', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('app-case-study-component')).toBeNull();
  });

  it('should render one level-one heading with the professional role', () => {
    const native = fixture.nativeElement as HTMLElement;
    const heading = native.querySelector('h1.home__title');

    expect(heading).not.toBeNull();
    expect(heading?.textContent).toContain('Diego Daniel Caceres');
    expect(heading?.textContent).toContain('Senior Frontend Engineer');
    expect(heading?.textContent).toContain('Angular & TypeScript Specialist');
  });

  it('should link the primary and secondary CTAs to the localized case-study and contact sections', () => {
    const native = fixture.nativeElement as HTMLElement;
    const primaryCta = native.querySelector<HTMLAnchorElement>('.home__cta--primary');
    const secondaryCta = native.querySelector<HTMLAnchorElement>('.home__cta--secondary');

    expect(localeService.getCurrentLocale).toHaveBeenCalledOnce();
    expect(primaryCta?.getAttribute('href')).toBe('/en#case-study');
    expect(secondaryCta?.getAttribute('href')).toBe('/en#contact');
  });

  it('should render the profile and signature images with meaningful alternative text', () => {
    const native = fixture.nativeElement as HTMLElement;
    const profileImage = native.querySelector<HTMLImageElement>('.home__image');
    const signatureImage = native.querySelector<HTMLImageElement>('.home__signature img');

    expect(profileImage?.getAttribute('alt')).toBe('Diego Daniel Caceres Photo');
    expect(signatureImage?.getAttribute('alt')).toBe('Diego Daniel Caceres Logo');
  });

  it('should render the headline metrics with their value and label', () => {
    const native = fixture.nativeElement as HTMLElement;
    const items = Array.from(native.querySelectorAll('.home__metric'));

    expect(items.map((item) => item.querySelector('.home__metric-value')?.textContent?.trim())).toEqual(['60 min → 5 min', '-50%', '-50%', '-60%']);
    expect(items.every((item) => (item.querySelector('.home__metric-label')?.textContent ?? '').trim().length > 0)).toBe(true);
  });

  it('should render the technology badges with their accessible names', () => {
    const native = fixture.nativeElement as HTMLElement;
    const badges = Array.from(native.querySelectorAll<HTMLImageElement>('.home__tech-badge-icon'));

    expect(badges.map((badge) => badge.alt)).toEqual(['Angular', 'Ionic', 'Typescript', 'Cloud']);
  });
});
