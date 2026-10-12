/**
 * CaseStudyComponent spec.
 *
 * Guarantees: the section renders the five case studies in importance order, each with its
 * category, subtitle, title, description and metrics, and every card links to its case page.
 * Validates: DOM output only (headings, texts, metric values, aria-hidden decorations, hrefs).
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CaseStudyComponent } from './case-study.component';

describe('CaseStudyComponent', () => {
  let component: CaseStudyComponent;
  let fixture: ComponentFixture<CaseStudyComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [CaseStudyComponent],
      providers: [provideRouter([])],
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
    expect(native.querySelector('.title__intro')?.textContent).toContain('Five recent problems from my work');
  });

  it('should render five case study articles with stable case identifiers', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = Array.from(native.querySelectorAll<HTMLElement>('article.case-study__card'));

    expect(cards).toHaveLength(5);
    expect(cards.map((card) => card.dataset['case'])).toEqual(['01', '02', '03', '04', '05']);
  });

  it('should render the category and transformation subtitle for every case study', () => {
    const native = fixture.nativeElement as HTMLElement;
    const categories = Array.from(native.querySelectorAll('.case-study__tag')).map((tag) => tag.textContent?.trim());
    const subtitles = Array.from(native.querySelectorAll('.case-study__subtitle')).map((subtitle) => subtitle.textContent?.trim());

    expect(categories).toEqual(['Web / Backend', 'Infrastructure', 'Team / Process', 'Mobile', 'Infrastructure']);
    expect(subtitles).toEqual(['US workflow → LATAM workflow', '1h → 5m', 'Semester → semester', 'Ionic 3 + Cordova → Ionic 8 + Capacitor', 'Azure Blob Storage → Cloudflare R2']);
  });

  it('should list the case studies from most to least important', () => {
    const native = fixture.nativeElement as HTMLElement;
    const titles = Array.from(native.querySelectorAll('h3.case-study__title')).map((title) => title.textContent?.trim() ?? '');
    const expectedOrder = ['Adapting the Legacy System to a New Market', 'Automating Builds and Deployments with CI/CD', 'Reducing Recurring Bugs by 50%', 'Migrating a Mobile App to Ionic 8 and Capacitor', 'Moving Production Storage from Azure to Cloudflare R2'];

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

  it('should render all seven case study metrics with their values', () => {
    const native = fixture.nativeElement as HTMLElement;
    const metrics = Array.from(native.querySelectorAll('.case-study__metric'));
    const metricValues = Array.from(native.querySelectorAll('.case-study__metric-value')).map((value) => value.textContent?.trim());

    expect(metrics).toHaveLength(7);
    expect(metricValues).toEqual(['-60%', '60 min → 5 min', '4–6', '-50%', 'Ionic 3 → 8', 'Cordova → Capacitor', '50%']);
  });

  it('should keep decorative elements hidden from assistive technologies', () => {
    const native = fixture.nativeElement as HTMLElement;
    const serialNumbers = native.querySelectorAll('.case-study__number[aria-hidden="true"]');
    const icons = native.querySelectorAll('.case-study__icon[aria-hidden="true"]');

    expect(serialNumbers).toHaveLength(5);
    expect(icons).toHaveLength(5);
  });
});

describe('CaseStudyComponent links', () => {
  const SLUGS = ['legacy-codebase-modernization', 'cicd-pipeline-automation', 'recurring-bugs-reduction', 'legacy-mobile-migration', 'cloud-storage-migration'];

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));
    document.documentElement.lang = 'en';

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CaseStudyComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.lang = '';
  });

  it('links every card to its case page', () => {
    const fixture = TestBed.createComponent(CaseStudyComponent);
    fixture.detectChanges();
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.case-study__footer a.case-study__link'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual(SLUGS.map((slug) => `/en/case-studies/${slug}`));
  });

  it('shows the read-more label on every link', () => {
    const fixture = TestBed.createComponent(CaseStudyComponent);
    fixture.detectChanges();
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a.case-study__link'));

    expect(links).toHaveLength(5);
    for (const link of links) {
      expect(link.textContent).toContain('Read the case');
    }
  });
});
