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

  it('should render the timeline years in chronological order', () => {
    const native = fixture.nativeElement as HTMLElement;
    const years = Array.from(native.querySelectorAll('.experiences__timeline-year')).map((year) => year.textContent?.trim());

    expect(years).toEqual(['2020', '2021', '2026']);
  });

  it('should render the two experience cards with their companies and durations', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const companies = cards.map((card) => card.querySelector('.experiences__company')?.textContent?.trim());
    const durations = cards.map((card) => card.querySelector('.experiences__duration')?.textContent?.trim());

    expect(cards).toHaveLength(2);
    expect(companies).toEqual(['Apex America · Cognitive', 'WS Solutions · Cesla']);
    expect(durations).toEqual(['1.2 years', '4.8 years']);
  });

  it('should render all experience responsibilities without empty descriptions', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const descriptionCounts = cards.map((card) => card.querySelectorAll('.experiences__description').length);
    const descriptions = Array.from(native.querySelectorAll('.experiences__description')).map((description) => description.textContent?.trim());

    expect(descriptionCounts).toEqual([7, 13]);
    expect(descriptions.every((description) => description && description !== '-')).toBe(true);
  });

  it('should render the technology stack for each experience', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const technologyCounts = cards.map((card) => card.querySelectorAll('.experiences__tech-tag').length);
    const technologies = Array.from(native.querySelectorAll('.experiences__tech-tag')).map((tag) => tag.textContent?.trim());

    expect(technologyCounts).toEqual([6, 12]);
    expect(technologies).toContain('AngularJS');
    expect(technologies).toContain('Cloudflare R2');
  });

  it('should render KPI stats only for the experience that provides them', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.experiences__card'));
    const metricValues = Array.from(cards[1].querySelectorAll('.experiences__stat-value')).map((value) => value.textContent?.trim());

    expect(cards[0].querySelector('.experiences__stats')).toBeNull();
    expect(metricValues).toEqual(['40+', '+1000', '>95%', '5', '5', '50%']);
  });

  it('should hide decorative timeline and metric icons from assistive technologies', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelectorAll('.experiences__period i[aria-hidden="true"]')).toHaveLength(2);
    expect(native.querySelectorAll('.experiences__stat-icon[aria-hidden="true"]')).toHaveLength(6);
  });
});
