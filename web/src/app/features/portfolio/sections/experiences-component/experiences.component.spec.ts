import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CaseStudiesService } from '../../../../core/services/case-studies/case-studies.service';
import { ExperiencesComponent } from './experiences.component';

/**
 * ExperiencesComponent spec.
 *
 * Guarantees:
 * - The component and its section/title render.
 * - One card per role is shown (Cesla Tech Lead, Cesla Frontend Engineer, Apex), without a duration label.
 * - Each card has a summary, and every responsibility key resolves to real text (no empty or "-" bullets),
 *   with the expected number of bullets (Tech Lead 4, Frontend Engineer 4, Apex 3).
 * - The Cesla stats are shown once, on the most recent Cesla card, and stay aligned with its achievements.
 * - Each card shows its technology stack, and the roles and periods follow the CV (no gap or overlap).
 * - The timeline marks 2026, 2024, 2021 and 2020, so the Cesla promotion is visible.
 * - Only the mobile migration, recurring bugs and codebase modernization bullets link to their case pages,
 *   inline and without extra markup around the bullet.
 */
describe('ExperiencesComponent', () => {
  let component: ExperiencesComponent;
  let fixture: ComponentFixture<ExperiencesComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    document.documentElement.lang = 'en';

    await TestBed.configureTestingModule({
      imports: [ExperiencesComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.lang = '';
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the section and title', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.experiences')).not.toBeNull();
    expect(native.querySelector('app-title-component')).not.toBeNull();
  });

  it('should render one card per role with its company and no duration label', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const companies = cards.map((card) => card.querySelector('.experiences__company')?.textContent?.trim());

    expect(cards).toHaveLength(3);
    expect(companies).toEqual(['Cesla', 'Cesla', 'Apex America']);
    expect(native.querySelector('.experiences__duration')).toBeNull();
  });

  it('should render all experience responsibilities without empty descriptions', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const descriptionCounts = cards.map((card) => card.querySelectorAll('.experiences__description').length);
    const descriptions = Array.from(native.querySelectorAll('.experiences__description')).map((description) => description.textContent?.trim());

    expect(descriptionCounts).toEqual([4, 4, 3]);
    expect(descriptions.every((description) => description && description !== '-')).toBe(true);
  });

  it('should render a summary for every experience card', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const summaries = cards.map((card) => card.querySelector('.experiences__summary')?.textContent?.trim() ?? '');

    expect(summaries.every((summary) => summary.length > 0)).toBe(true);
    expect(summaries[0]).toContain('Technical reference of the team');
    expect(summaries[1]).toContain('Developed mobile apps and web modules');
    expect(summaries[2]).toContain('multi-tenant bot');
  });

  it('should show the Cesla stats aligned with the achievements', () => {
    const native = fixture.nativeElement as HTMLElement;
    const firstCard = native.querySelector<HTMLElement>('article.experiences__card');
    const values = Array.from(firstCard?.querySelectorAll('.experiences__stat-value') ?? []).map((value) => value.textContent?.trim());
    const labels = Array.from(firstCard?.querySelectorAll('.experiences__stat-label') ?? []).map((label) => label.textContent?.trim());

    expect(values).toEqual(['~40', '+1000', '5', '5']);
    expect(labels).toEqual(['Clients', 'Users', 'Mobile Apps', 'APIs']);
    expect(native.querySelectorAll('.experiences__stats-panel')).toHaveLength(1);
  });

  it('should render the technology stack for each experience', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const technologyCounts = cards.map((card) => card.querySelectorAll('.experiences__tech-tag').length);
    const technologies = Array.from(native.querySelectorAll('.experiences__tech-tag')).map((tag) => tag.textContent?.trim());

    expect(technologyCounts).toEqual([11, 6, 10]);
    expect(technologies).toContain('Angular');
    expect(technologies).toContain('Ionic');
  });

  it('should present the roles and periods of the CV: Cesla Tech Lead, Cesla Frontend Engineer and Apex Frontend Developer', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const roles = cards.map((card) => card.querySelector('.experiences__role')?.textContent?.trim());
    const periods = cards.map((card) => (card.querySelector('.experiences__period')?.textContent ?? '').replace(/\s+/g, ' ').trim());

    expect(roles).toEqual(['Tech Lead', 'Frontend Engineer', 'Frontend Developer']);
    expect(periods).toEqual(['Nov 2024 – Feb 2026', 'May 2021 – Oct 2024', 'Jan 2020 – Mar 2021']);
  });

  it('should mark 2026, 2024, 2021 and 2020 on the timeline', () => {
    const native = fixture.nativeElement as HTMLElement;
    const years = Array.from(native.querySelectorAll('.experiences__timeline-year')).map((year) => year.textContent?.trim());

    expect(years).toEqual(['', '2026', '2024', '2021', '2020']);
  });

  it('should hide decorative timeline and metric icons from assistive technologies', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelectorAll('.experiences__period i[aria-hidden="true"]')).toHaveLength(3);
    expect(native.querySelectorAll('.experiences__stat-icon[aria-hidden="true"]')).toHaveLength(4);
  });

  it('should link only the mobile migration, recurring bugs and codebase modernization bullets to their localized case pages', () => {
    const native = fixture.nativeElement as HTMLElement;
    const links = Array.from(native.querySelectorAll<HTMLAnchorElement>('a.experiences__case-link'));
    const [techLeadCard, frontendCard] = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const techLeadBullets = Array.from(techLeadCard?.querySelectorAll('.experiences__description') ?? []);
    const frontendBullets = Array.from(frontendCard?.querySelectorAll('.experiences__description') ?? []);

    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/en/case-studies/legacy-mobile-migration', '/en/case-studies/recurring-bugs-reduction', '/en/case-studies/legacy-codebase-modernization']);
    expect(techLeadBullets[0]?.contains(links[0] ?? null)).toBe(true);
    expect(techLeadBullets[2]?.contains(links[1] ?? null)).toBe(true);
    expect(frontendBullets[0]?.contains(links[2] ?? null)).toBe(true);
  });

  it('should name each bullet link with the read-case action and hide its arrow from assistive technologies', () => {
    const native = fixture.nativeElement as HTMLElement;
    const links = Array.from(native.querySelectorAll<HTMLAnchorElement>('a.experiences__case-link'));

    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.textContent).toContain('Read the case');
      expect(link.getAttribute('aria-label')).toContain('Read the case');
      expect(link.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('should point the bullet links to existing case studies', () => {
    const cases = TestBed.inject(CaseStudiesService);

    expect(cases.getBySlug('cicd-pipeline-automation')).toBeDefined();
    expect(cases.getBySlug('legacy-codebase-modernization')).toBeDefined();
    expect(cases.getBySlug('cloud-storage-migration')).toBeDefined();
    expect(cases.getBySlug('recurring-bugs-reduction')).toBeDefined();
    expect(cases.getBySlug('legacy-mobile-migration')).toBeDefined();
  });
});
