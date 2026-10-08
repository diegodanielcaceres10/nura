import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ExperiencesComponent } from './experiences.component';

describe('ExperiencesComponent', () => {
  let component: ExperiencesComponent;
  let fixture: ComponentFixture<ExperiencesComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [ExperiencesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

    expect(descriptionCounts).toEqual([10, 7]);
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
});
