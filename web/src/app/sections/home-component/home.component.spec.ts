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

  it('should render one level-one heading with the professional role', () => {
    const native = fixture.nativeElement as HTMLElement;
    const heading = native.querySelector('h1.home__title');

    expect(heading).not.toBeNull();
    expect(heading?.textContent).toContain('Diego Daniel Caceres');
    expect(heading?.textContent).toContain('Senior Frontend Engineer');
    expect(heading?.textContent).toContain('Angular & TypeScript Specialist');
  });

  it('should link the primary and secondary CTAs to the localized projects and contact sections', () => {
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

  it('should render the technology badges with their accessible names', () => {
    const native = fixture.nativeElement as HTMLElement;
    const badges = Array.from(native.querySelectorAll<HTMLImageElement>('.home__tech-badge-icon'));

    expect(badges.map((badge) => badge.alt)).toEqual(['Angular', 'Ionic', 'Typescript', 'Cloud']);
  });

  it('should render the metrics section with an accessible heading and five metric items', () => {
    const native = fixture.nativeElement as HTMLElement;
    const section = native.querySelector<HTMLElement>('.stats');
    const heading = native.querySelector<HTMLElement>('#stats-title');
    const items = native.querySelectorAll('.stats__item');

    expect(section?.getAttribute('aria-labelledby')).toBe('stats-title');
    expect(heading?.tagName).toBe('H2');
    expect(items).toHaveLength(5);
  });

  it('should render the technology categories and name every technology icon', () => {
    const native = fixture.nativeElement as HTMLElement;
    const categoryLabels = Array.from(native.querySelectorAll('.tech-stack__category-label')).map((label) => label.textContent?.trim());
    const technologyIcons = Array.from(native.querySelectorAll<HTMLImageElement>('.tech-stack__icon'));

    expect(categoryLabels).toEqual(['Frontend', 'Mobile', 'Backend', 'Cloud & DevOps']);
    expect(technologyIcons).toHaveLength(11);
    expect(technologyIcons.every((icon) => icon.alt.length > 0)).toBe(true);
  });
});
