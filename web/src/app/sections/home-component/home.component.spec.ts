/**
 * HomeComponent spec.
 *
 * Guarantees: the hero keeps its heading, localized CTA links, images and tech badges,
 * and shows the headline case-study figures without rendering the case studies themselves.
 * The CI/CD, recurring bugs, file traffic cost and codebase metrics link to their case pages without altering the metric layout.
 * Validates: DOM output only (headings, hrefs, alt texts, metric values and labels).
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CaseStudiesService } from '../../services/case-studies/case-studies.service';
import { LocaleService } from '../../services/locale/locale.service';
// Static import on purpose: specs run without isolation, so importing the component under the $localize stub
// would evaluate MESSAGES with raw ICU ids and break every spec that runs after this one.
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let localeService: { getCurrentLocale: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    localeService = {
      getCurrentLocale: vi.fn(() => 'en'),
    };

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

  it('should link the CI/CD, recurring bugs, file traffic cost and codebase metrics to their localized case pages', () => {
    const native = fixture.nativeElement as HTMLElement;
    const items = Array.from(native.querySelectorAll('.home__metric'));
    const hrefs = items.map((item) => item.querySelector<HTMLAnchorElement>('a.home__metric-link')?.getAttribute('href') ?? null);

    expect(hrefs).toEqual(['/en/case-studies/cicd-pipeline-automation', '/en/case-studies/recurring-bugs-reduction', '/en/case-studies/cloud-storage-migration', '/en/case-studies/legacy-codebase-modernization']);
  });

  it('should name each metric link with its figure, its label and the read-case action', () => {
    const native = fixture.nativeElement as HTMLElement;
    const links = Array.from(native.querySelectorAll<HTMLAnchorElement>('a.home__metric-link'));
    const names = links.map((link) => link.getAttribute('aria-label') ?? '');
    const arrows = Array.from(native.querySelectorAll('.home__metric-arrow'));

    expect(names).toHaveLength(4);
    expect(names[0]).toContain('60 min → 5 min');
    expect(names[1]).toContain('recurring bugs');
    expect(names[2]).toContain('file traffic cost');
    expect(names[3]).toContain('-60%');
    expect(names.every((name) => name.includes('Read the case'))).toBe(true);
    expect(arrows).toHaveLength(4);
    expect(arrows.every((arrow) => arrow.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('should point the metric links to existing case studies', () => {
    const cases = TestBed.inject(CaseStudiesService);

    expect(cases.getBySlug('cicd-pipeline-automation')).toBeDefined();
    expect(cases.getBySlug('recurring-bugs-reduction')).toBeDefined();
    expect(cases.getBySlug('cloud-storage-migration')).toBeDefined();
    expect(cases.getBySlug('legacy-codebase-modernization')).toBeDefined();
  });

  it('should render the technology badges with their accessible names', () => {
    const native = fixture.nativeElement as HTMLElement;
    const badges = Array.from(native.querySelectorAll<HTMLImageElement>('.home__tech-badge-icon'));

    expect(badges.map((badge) => badge.alt)).toEqual(['Angular', 'Ionic', 'Typescript', 'Cloud']);
  });

  it('should render the technical skills section with eyebrow, title, and all categories', () => {
    const native = fixture.nativeElement as HTMLElement;
    const title = native.querySelector('h2.home__skills-title');
    const eyebrow = native.querySelector('.home__skills-eyebrow');
    const categories = native.querySelectorAll('.home__skill-card');
    const categoryTitles = Array.from(native.querySelectorAll('.home__skill-card-title')).map((el) => el.textContent?.trim());
    const chips = Array.from(native.querySelectorAll('.home__skill-chip')).map((chip) => chip.textContent?.trim());

    expect(title).not.toBeNull();
    expect(eyebrow).not.toBeNull();
    expect(categories).toHaveLength(8);
    expect(categoryTitles).toHaveLength(8);
    expect(chips).toContain('Angular');
    expect(chips).toContain('Ionic');
    expect(chips).toContain('Vitest');
    expect(chips).toContain('Microfrontends');
    expect(chips).toContain('Node.js');
    expect(chips).toContain('Git');
    expect(chips).toContain('Claude Code');
    expect(chips).toContain('Scrum');
  });
});
