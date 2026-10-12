import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CaseStudiesService } from '../../services/case-studies/case-studies.service';
import { ExperiencesComponent } from './experiences.component';

/**
 * ExperiencesComponent spec.
 *
 * Guarantees:
 * - The component and its section/title render.
 * - One card per company (Cesla, Apex) is shown, without a duration label.
 * - Every responsibility key resolves to real text (no empty or "-" bullets),
 *   and each card renders the expected number of bullets (Cesla 10, Apex 8).
 * - The Cesla stats stay aligned with its achievements.
 * - Each card shows its technology stack, and the Cesla role and period are correct.
 * - Only the Cesla codebase modernization bullet links to its case page, inline and without extra markup
 *   around the bullet.
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

  it('should render the two experience cards with their companies and no duration label', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const companies = cards.map((card) => card.querySelector('.experiences__company')?.textContent?.trim());

    expect(cards).toHaveLength(2);
    expect(companies).toEqual(['WS Solutions · Cesla', 'Apex America']);
    expect(native.querySelector('.experiences__duration')).toBeNull();
  });

  it('should render all experience responsibilities without empty descriptions', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const descriptionCounts = cards.map((card) => card.querySelectorAll('.experiences__description').length);
    const descriptions = Array.from(native.querySelectorAll('.experiences__description')).map((description) => description.textContent?.trim());

    expect(descriptionCounts).toEqual([10, 8]);
    expect(descriptions.every((description) => description && description !== '-')).toBe(true);
  });

  it('should show the Cesla stats aligned with the achievements', () => {
    const native = fixture.nativeElement as HTMLElement;
    const firstCard = native.querySelector<HTMLElement>('article.experiences__card');
    const values = Array.from(firstCard?.querySelectorAll('.experiences__stat-value') ?? []).map((value) => value.textContent?.trim());
    const labels = Array.from(firstCard?.querySelectorAll('.experiences__stat-label') ?? []).map((label) => label.textContent?.trim());

    expect(values).toEqual(['40+', '+1000', '60%', '5', '5', '50%']);
    expect(labels).toEqual(['Clients', 'Users', 'Less Code', 'Mobile Apps', 'APIs', 'Fewer Recurring Bugs']);
  });

  it('should render the technology stack for each experience', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const technologyCounts = cards.map((card) => card.querySelectorAll('.experiences__tech-tag').length);
    const technologies = Array.from(native.querySelectorAll('.experiences__tech-tag')).map((tag) => tag.textContent?.trim());

    expect(technologyCounts).toEqual([10, 9]);
    expect(technologies).toContain('Angular');
    expect(technologies).toContain('Ionic');
  });

  it('should present the Cesla experience as Frontend Engineer from May 2021 to Feb 2026', () => {
    const native = fixture.nativeElement as HTMLElement;
    const firstCard = native.querySelector<HTMLElement>('article.experiences__card');
    const role = firstCard?.querySelector('.experiences__role')?.textContent?.trim() ?? '';
    const period = firstCard?.querySelector('.experiences__period')?.textContent ?? '';

    expect(role).toBe('Frontend Engineer');
    expect(period).toContain('May 2021');
    expect(period).toContain('Feb 2026');
  });

  it('should hide decorative timeline and metric icons from assistive technologies', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelectorAll('.experiences__period i[aria-hidden="true"]')).toHaveLength(2);
    expect(native.querySelectorAll('.experiences__stat-icon[aria-hidden="true"]')).toHaveLength(6);
  });

  it('should link only the codebase modernization bullet to its localized case page', () => {
    const native = fixture.nativeElement as HTMLElement;
    const links = Array.from(native.querySelectorAll<HTMLAnchorElement>('a.experiences__case-link'));
    const firstCard = native.querySelector<HTMLElement>('article.experiences__card');
    const bullets = Array.from(firstCard?.querySelectorAll('.experiences__description') ?? []);

    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute('href')).toBe('/en/case-studies/legacy-codebase-modernization');
    expect(bullets[1]?.contains(links[0] ?? null)).toBe(true);
  });

  it('should name the bullet link with the read-case action and hide its arrow from assistive technologies', () => {
    const native = fixture.nativeElement as HTMLElement;
    const link = native.querySelector<HTMLAnchorElement>('a.experiences__case-link');

    expect(link?.textContent).toContain('Read the case');
    expect(link?.getAttribute('aria-label')).toContain('Read the case');
    expect(link?.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should point the bullet link to an existing case study', () => {
    expect(TestBed.inject(CaseStudiesService).getBySlug('legacy-codebase-modernization')).toBeDefined();
  });
});
