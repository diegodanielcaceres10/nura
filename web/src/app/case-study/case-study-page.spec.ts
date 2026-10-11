import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CaseStudyItem } from '../sections/case-study-component/case-study.component';
import { CaseStudiesService } from '../services/case-studies/case-studies.service';
import { CaseStudyPage } from './case-study-page';

const fullCase: CaseStudyItem = {
  number: '02',
  category: 'Infrastructure',
  icon: 'fa-solid fa-infinity',
  title: 'CASE_STUDY_02_TITLE',
  subtitle: '1h → 5m',
  description: 'CASE_STUDY_02_DESCRIPTION',
  metrics: [{ icon: 'fa-regular fa-clock', value: '60 min → 5 min', label: 'CASE_STUDY_02_METRIC_01_LABEL' }],
  slug: 'cicd-pipeline-automation',
  detail: {
    context: 'CASE_DETAIL_CICD_PIPELINE_AUTOMATION_CONTEXT',
    challenge: 'CASE_DETAIL_CICD_PIPELINE_AUTOMATION_CHALLENGE',
    role: 'CASE_DETAIL_CICD_PIPELINE_AUTOMATION_ROLE',
    decisions: 'CASE_DETAIL_CICD_PIPELINE_AUTOMATION_DECISIONS',
    execution: 'CASE_DETAIL_CICD_PIPELINE_AUTOMATION_EXECUTION',
    results: 'CASE_DETAIL_CICD_PIPELINE_AUTOMATION_RESULTS',
    learnings: 'CASE_DETAIL_CICD_PIPELINE_AUTOMATION_LEARNINGS',
    stack: ['Ionic 5', 'Azure DevOps', 'Gradle'],
  },
};

const ORDER = ['context', 'challenge', 'role', 'decisions', 'execution', 'results', 'learnings'];

async function createPage(slug: string | null, cases: CaseStudyItem[] = [fullCase]): Promise<ComponentFixture<CaseStudyPage>> {
  await TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [CaseStudyPage],
    providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => slug } } } }, { provide: CaseStudiesService, useValue: { getAll: () => cases, getBySlug: (value: string) => cases.find((item) => item.slug === value) } }],
  }).compileComponents();

  const fixture = TestBed.createComponent(CaseStudyPage);
  fixture.detectChanges();
  return fixture;
}

const root = (fixture: ComponentFixture<CaseStudyPage>): HTMLElement => fixture.nativeElement as HTMLElement;

describe('CaseStudyPage', () => {
  beforeEach(() => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));
    document.documentElement.lang = 'es';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the case by slug from the route', async () => {
    const fixture = await createPage('cicd-pipeline-automation');

    expect(root(fixture).querySelector('.case-page__title')).not.toBeNull();
    expect(root(fixture).querySelector('.case-page__not-found')).toBeNull();
  });

  it.each(['does-not-exist', 'CICD-Pipeline-Automation', null])('shows not-found for the slug %j', async (slug) => {
    const fixture = await createPage(slug);

    expect(root(fixture).querySelector('.case-page__not-found')).not.toBeNull();
    expect(root(fixture).querySelector('.case-page__title')).toBeNull();
  });

  it('renders the sections in order: context, challenge, role, decisions, execution, results, learnings, stack', async () => {
    const fixture = await createPage('cicd-pipeline-automation');
    const sections = Array.from(root(fixture).querySelectorAll<HTMLElement>('[data-section]')).map((element) => element.dataset['section']);

    expect(sections).toEqual([...ORDER, 'stack']);
  });

  it('does not render a section whose key is empty', async () => {
    const withoutRole: CaseStudyItem = { ...fullCase, detail: { ...fullCase.detail, role: '' } };
    const fixture = await createPage('cicd-pipeline-automation', [withoutRole]);
    const sections = Array.from(root(fixture).querySelectorAll<HTMLElement>('[data-section]')).map((element) => element.dataset['section']);

    expect(sections).toEqual([...ORDER.filter((key) => key !== 'role'), 'stack']);
  });

  it('renders the stack as one chip per item', async () => {
    const fixture = await createPage('cicd-pipeline-automation');
    const chips = Array.from(root(fixture).querySelectorAll('.case-page__techs small')).map((chip) => chip.textContent?.trim());

    expect(chips).toEqual(['Ionic 5', 'Azure DevOps', 'Gradle']);
  });

  it('does not render the stack section when the stack is empty', async () => {
    const withoutStack: CaseStudyItem = { ...fullCase, detail: { ...fullCase.detail, stack: [] } };
    const fixture = await createPage('cicd-pipeline-automation', [withoutStack]);

    expect(root(fixture).querySelector('.case-page__techs')).toBeNull();
  });

  it('renders one h1 and one h2 per rendered section, stack included', async () => {
    const fixture = await createPage('cicd-pipeline-automation');

    expect(root(fixture).querySelectorAll('h1').length).toBe(1);
    expect(root(fixture).querySelectorAll('h2').length).toBe(ORDER.length + 1);
  });

  it('renders the metrics of the card', async () => {
    const fixture = await createPage('cicd-pipeline-automation');

    expect(root(fixture).querySelector('.case-page__metric-value')?.textContent?.trim()).toBe('60 min → 5 min');
  });

  it('goBack navigates to the language root with the case-study fragment', async () => {
    document.documentElement.lang = 'en';
    const fixture = await createPage('cicd-pipeline-automation');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    (fixture.componentInstance as unknown as { goBack: () => void }).goBack();

    expect(navigate).toHaveBeenCalledWith(['/', 'en'], { fragment: 'case-study' });
  });

  it('the back button calls goBack', async () => {
    const fixture = await createPage('cicd-pipeline-automation');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    root(fixture).querySelector<HTMLButtonElement>('.case-page__back')?.click();

    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
