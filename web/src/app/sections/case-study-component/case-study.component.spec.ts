import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CaseStudyComponent } from './case-study.component';

describe('CaseStudyComponent', () => {
  let component: CaseStudyComponent;
  let fixture: ComponentFixture<CaseStudyComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [CaseStudyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the case study section and title', () => {
    const native = fixture.nativeElement as HTMLElement;
    const section = native.querySelector<HTMLElement>('.case-study');

    expect(section?.getAttribute('aria-labelledby')).toBe('case-study-title');
    expect(native.querySelector('app-title-component')).not.toBeNull();
  });

  it('should introduce the section around the latest challenges', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('h2.title__text')?.textContent).toContain('Latest Challenges');
    expect(native.querySelector('.title__subtitle')?.textContent).toContain('What I faced and what I did');
    expect(native.querySelector('.title__intro')?.textContent).toContain('Four recent problems from my work');
  });

  it('should render four case study articles with stable case identifiers', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.case-study__card'));

    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.dataset['case'])).toEqual(['01', '02', '03', '04']);
  });

  it('should render the category and transformation subtitle for every case study', () => {
    const native = fixture.nativeElement as HTMLElement;
    const categories = Array.from(native.querySelectorAll('.case-study__tag')).map((tag) => tag.textContent?.trim());
    const subtitles = Array.from(native.querySelectorAll('.case-study__subtitle')).map((subtitle) => subtitle.textContent?.trim());

    expect(categories).toEqual(['Web / Backend', 'Infrastructure', 'Mobile', 'Infrastructure']);
    expect(subtitles).toEqual(['US workflow → Brazil workflow', '1h → 5m', 'Ionic 3 + Cordova → Ionic 8 + Capacitor', 'Azure Blob Storage → Cloudflare R2']);
  });

  it('should list the case studies from most to least important', () => {
    const native = fixture.nativeElement as HTMLElement;
    const titles = Array.from(native.querySelectorAll('h3.case-study__title')).map((title) => title.textContent?.trim() ?? '');
    const expectedOrder = ['Adapting a Legacy System to a New Market', 'Automating Builds and Deployments with CI/CD', 'Migrating a Mobile App to Ionic 8 and Capacitor', 'Moving Production Storage from Azure to Cloudflare R2'];

    expect(titles).toHaveLength(expectedOrder.length);
    expectedOrder.forEach((expectedTitle, index) => {
      expect(titles[index]).toContain(expectedTitle);
    });
  });

  it('should render a title and description for every case study', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.case-study__card'));

    for (const card of cards) {
      expect(card.querySelector('h3.case-study__title')?.textContent?.trim()).not.toBe('');
      expect(card.querySelector('.case-study__card-description')?.textContent?.trim()).not.toBe('');
    }
  });

  it('should render all six case study metrics with their values', () => {
    const native = fixture.nativeElement as HTMLElement;
    const metrics = Array.from(native.querySelectorAll('.case-study__metric'));
    const metricValues = Array.from(native.querySelectorAll('.case-study__metric-value')).map((value) => value.textContent?.trim());

    expect(metrics).toHaveLength(6);
    expect(metricValues).toEqual(['-60%', '60 min → 5 min', '4–6', 'Ionic 3 → 8', 'Cordova → Capacitor', '50%']);
  });

  it('should keep decorative elements hidden from assistive technologies', () => {
    const native = fixture.nativeElement as HTMLElement;
    const serialNumbers = native.querySelectorAll('.case-study__number[aria-hidden="true"]');
    const icons = native.querySelectorAll('.case-study__icon[aria-hidden="true"]');

    expect(serialNumbers).toHaveLength(4);
    expect(icons).toHaveLength(4);
  });
});
