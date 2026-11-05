import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkPage } from './work-page';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectsService } from '../services/projects/projects.service';
import { ProjectItem } from '../sections/projects-component/projects.component';

const mockProject: ProjectItem = {
  id: 'ionic-plugin-lab',
  title: 'Ionic Plugin Lab',
  type: 'Mobile',
  shortDescription: 'Short desc',
  techStackMain: ['Ionic', 'Angular'],
  status: 'IN_PROGRESS',
  year: 2026,
  fullDescription: 'Full desc',
  keyFeatures: ['Feature 1'],
};

const fullProject: ProjectItem = {
  ...mockProject,
  id: 'full-project',
  title: 'Full Project',
  keyFeatures: ['Feature 1', 'Feature 2'],
  links: {
    repo: 'https://github.com/acme/full-project',
    demo: 'https://demo.acme.dev',
    landing: 'https://landing.acme.dev',
    npm: 'https://www.npmjs.com/package/full-project',
    androidAPK: 'https://acme.dev/full-project.apk',
  },
  techStackFull: [
    { category: 'Frontend', items: ['Angular', 'TypeScript'] },
    { category: 'Tooling', items: ['Vitest'] },
  ],
  challenges: ['Challenge 1', 'Challenge 2'],
  galleryPortrait: ['/img/1.png', '/img/2.png', '/img/3.png'],
  logo: 'assets/projects/full-project/logo.png',
};

const themedProject: ProjectItem = {
  ...mockProject,
  id: 'themed-project',
  title: 'Themed Project',
  cardTheme: {
    accent: '#34d399',
    gradient: { from: '#10302a', to: '#0b141f', angle: 145 },
    cover: { src: '/img/cover.png', position: 'center', overlay: 0.2 },
  },
};

const bothGalleriesProject: ProjectItem = {
  ...mockProject,
  id: 'both-galleries',
  title: 'Both Galleries',
  galleryPortrait: ['/img/portrait-1.png', '/img/portrait-2.png'],
  galleryLandscape: ['/img/landscape-1.png', '/img/landscape-2.png', '/img/landscape-3.png'],
};

async function createPage(routeId: string | null, projects: ProjectItem[]): Promise<ComponentFixture<WorkPage>> {
  await TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [WorkPage, RouterTestingModule],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => routeId } } },
      },
      {
        provide: ProjectsService,
        useValue: {
          getAll: () => projects,
          getById: (id: string) => projects.find((p) => p.id === id),
        },
      },
    ],
  }).compileComponents();

  const pageFixture = TestBed.createComponent(WorkPage);
  pageFixture.detectChanges();
  return pageFixture;
}

describe('WorkPage', () => {
  let component: WorkPage;
  let fixture: ComponentFixture<WorkPage>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => {
      return typeof message === 'string' ? message : (message[0] ?? '');
    });

    fixture = await createPage('ionic-plugin-lab', [mockProject]);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load project by id from route', () => {
    expect(component['project']()).toBeTruthy();
    expect(component['project']()?.id).toBe('ionic-plugin-lab');
  });

  it('should not show not-found state when project exists', () => {
    expect(component['notFound']()).toBe(false);
    expect(fixture.nativeElement.querySelector('.work__not-found')).toBeNull();
  });

  it('should show not-found state when project does not exist', async () => {
    const f = await createPage('nonexistent-id', [mockProject]);

    expect(f.componentInstance['notFound']()).toBe(true);
    expect(f.nativeElement.querySelector('.work__not-found')).not.toBeNull();
    expect(f.nativeElement.querySelector('.work__content')).toBeNull();
  });

  it('should show not-found state when the route has no id', async () => {
    const f = await createPage(null, [mockProject]);

    expect(f.componentInstance['project']()).toBeNull();
    expect(f.componentInstance['notFound']()).toBe(true);
    expect(f.nativeElement.querySelector('.work__not-found')).not.toBeNull();
    expect(f.nativeElement.querySelector('.work__content')).toBeNull();
  });

  it('should navigate back when goBack is called', () => {
    const navigateSpy = vi.spyOn(component['router'], 'navigate').mockResolvedValue(true);

    component['goBack']();

    expect(navigateSpy).toHaveBeenCalledWith(expect.any(Array), { fragment: 'projects' });
  });

  it('should navigate back when the back button is clicked', () => {
    const navigateSpy = vi.spyOn(component['router'], 'navigate').mockResolvedValue(true);
    const button = fixture.nativeElement.querySelector('.work__back') as HTMLButtonElement;

    button.click();

    expect(navigateSpy).toHaveBeenCalledWith(expect.any(Array), { fragment: 'projects' });
  });

  describe('project without optional data', () => {
    it('should render only the key features section', () => {
      const el: HTMLElement = fixture.nativeElement;

      expect(el.querySelectorAll('.work__features li').length).toBe(1);
      expect(el.querySelectorAll('.work__action').length).toBe(0);
      expect(el.querySelector('.work__stacks')).toBeNull();
      expect(el.querySelector('.work__challenges')).toBeNull();
      expect(el.querySelector('.work__gallery')).toBeNull();
    });

    it('should not render the actions container when the project has no links', () => {
      expect(fixture.nativeElement.querySelector('.work__actions')).toBeNull();
    });

    it('should not render the logo when the project has none', () => {
      expect(fixture.nativeElement.querySelector('.work__logo')).toBeNull();
    });

    it('should render only the repo action when the project has just a repo link', async () => {
      const repoOnly: ProjectItem = { ...mockProject, id: 'repo-only', links: { repo: 'https://github.com/acme/repo-only' } };

      const f = await createPage('repo-only', [repoOnly]);
      const actions = f.nativeElement.querySelectorAll('.work__action') as NodeListOf<HTMLAnchorElement>;

      expect(actions.length).toBe(1);
      expect(actions[0].getAttribute('href')).toBe('https://github.com/acme/repo-only');
    });

    it.each([
      ['demo', 'https://demo.acme.dev'],
      ['landing', 'https://landing.acme.dev'],
      ['npm', 'https://www.npmjs.com/package/acme'],
      ['androidAPK', 'https://acme.dev/acme.apk'],
    ] as const)('should render the %s action only when that link is present', async (key, url) => {
      const project: ProjectItem = {
        ...mockProject,
        id: 'one-extra-link',
        links: { repo: 'https://github.com/acme/repo', [key]: url },
      };

      const f = await createPage('one-extra-link', [project]);
      const hrefs = Array.from(f.nativeElement.querySelectorAll('.work__action') as NodeListOf<HTMLAnchorElement>).map((a) => a.getAttribute('href'));

      expect(hrefs).toEqual(['https://github.com/acme/repo', url]);
    });

    it('should not render empty optional sections', async () => {
      const emptyLists: ProjectItem = { ...mockProject, id: 'empty-lists', techStackFull: [], challenges: [], galleryPortrait: [] };

      const f = await createPage('empty-lists', [emptyLists]);
      const el: HTMLElement = f.nativeElement;

      expect(el.querySelector('.work__stacks')).toBeNull();
      expect(el.querySelector('.work__challenges')).toBeNull();
      expect(el.querySelector('.work__gallery')).toBeNull();
    });
  });

  describe('project with all optional data', () => {
    let el: HTMLElement;

    beforeEach(async () => {
      const f = await createPage('full-project', [fullProject]);
      el = f.nativeElement;
    });

    it('should render every external link with its href', () => {
      const actions = Array.from(el.querySelectorAll('.work__action')) as HTMLAnchorElement[];

      expect(actions.map((a) => a.getAttribute('href'))).toEqual(['https://github.com/acme/full-project', 'https://demo.acme.dev', 'https://landing.acme.dev', 'https://www.npmjs.com/package/full-project', 'https://acme.dev/full-project.apk']);
      actions.forEach((a) => {
        expect(a.getAttribute('target')).toBe('_blank');
        expect(a.getAttribute('rel')).toBe('noopener');
      });
    });

    it('should render the actions container when the project has links', () => {
      expect(el.querySelectorAll('.work__actions').length).toBe(1);
    });

    it('should mark only the Android APK link with the android modifier', () => {
      const android = el.querySelectorAll('.work__action--android');

      expect(android.length).toBe(1);
      expect(android[0].getAttribute('href')).toBe('https://acme.dev/full-project.apk');
    });

    it('should render tech stack groups with their categories and items', () => {
      const categories = Array.from(el.querySelectorAll('.work__stack-category')).map((c) => c.textContent?.trim());
      const items = Array.from(el.querySelectorAll('.work__techs small')).map((s) => s.textContent?.trim());

      expect(categories).toEqual(['Frontend', 'Tooling']);
      expect(items).toEqual(['Angular', 'TypeScript', 'Vitest']);
    });

    it('should render every key feature and challenge', () => {
      expect(el.querySelectorAll('.work__features li').length).toBe(2);
      expect(el.querySelectorAll('.work__challenges p').length).toBe(2);
    });

    it('should render the logo above the project card with the project title as alt', () => {
      const logo = el.querySelector('.work__aside > .work__logo img') as HTMLImageElement;
      const card = el.querySelector('.work__aside > app-project-card-component') as HTMLElement;

      expect(logo.getAttribute('src')).toBe('assets/projects/full-project/logo.png');
      expect(logo.getAttribute('alt')).toBe('Full Project');
      expect(logo.parentElement!.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('should render gallery images with src and the project title as alt', () => {
      const images = Array.from(el.querySelectorAll('.work__photo img')) as HTMLImageElement[];

      expect(images.map((i) => i.getAttribute('src'))).toEqual(['/img/1.png', '/img/2.png', '/img/3.png']);
      images.forEach((i) => expect(i.getAttribute('alt')).toBe('Full Project'));
    });
  });

  describe('gallery tabs', () => {
    const portraitSources = ['/img/portrait-1.png', '/img/portrait-2.png'];
    const landscapeSources = ['/img/landscape-1.png', '/img/landscape-2.png', '/img/landscape-3.png'];

    const photoSources = (root: ParentNode): (string | null)[] => Array.from(root.querySelectorAll('.work__photo img')).map((img) => img.getAttribute('src'));
    const tabsOf = (el: HTMLElement): HTMLButtonElement[] => Array.from(el.querySelectorAll('[role="tab"]'));
    const panelOf = (el: HTMLElement): HTMLElement => el.querySelector('.work__gallery-panel') as HTMLElement;
    const tabById = (el: HTMLElement, name: 'portrait' | 'landscape'): HTMLButtonElement => el.querySelector(`#work-gallery-tab-${name}`) as HTMLButtonElement;

    const pressKey = (f: ComponentFixture<WorkPage>, target: HTMLElement, key: string): KeyboardEvent => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      target.dispatchEvent(event);
      f.detectChanges();
      return event;
    };

    it('should render both tabs with the portrait one selected and only its photos', async () => {
      const f = await createPage('both-galleries', [bothGalleriesProject]);
      const el: HTMLElement = f.nativeElement;
      const [portraitTab, landscapeTab] = tabsOf(el);

      expect(el.querySelectorAll('[role="tablist"]').length).toBe(1);
      expect(tabsOf(el).length).toBe(2);
      expect(portraitTab.getAttribute('aria-selected')).toBe('true');
      expect(portraitTab.getAttribute('tabindex')).toBe('0');
      expect(landscapeTab.getAttribute('aria-selected')).toBe('false');
      expect(landscapeTab.getAttribute('tabindex')).toBe('-1');
      expect(photoSources(panelOf(el))).toEqual(portraitSources);
      expect(el.querySelector('.work__gallery--landscape')).toBeNull();
    });

    it('should link every tab to the tabpanel and label the panel with the selected tab', async () => {
      const f = await createPage('both-galleries', [bothGalleriesProject]);
      const el: HTMLElement = f.nativeElement;
      const panel = panelOf(el);

      expect(panel.getAttribute('role')).toBe('tabpanel');
      expect(panel.getAttribute('aria-labelledby')).toBe(tabById(el, 'portrait').id);
      tabsOf(el).forEach((tab) => expect(tab.getAttribute('aria-controls')).toBe(panel.id));
    });

    it('should show the landscape photos, with their real size, when the landscape tab is clicked', async () => {
      const f = await createPage('both-galleries', [bothGalleriesProject]);
      const el: HTMLElement = f.nativeElement;

      tabById(el, 'landscape').click();
      f.detectChanges();

      expect(tabById(el, 'landscape').getAttribute('aria-selected')).toBe('true');
      expect(tabById(el, 'landscape').getAttribute('tabindex')).toBe('0');
      expect(tabById(el, 'portrait').getAttribute('aria-selected')).toBe('false');
      expect(tabById(el, 'portrait').getAttribute('tabindex')).toBe('-1');
      expect(panelOf(el).getAttribute('aria-labelledby')).toBe(tabById(el, 'landscape').id);
      expect(photoSources(panelOf(el))).toEqual(landscapeSources);
      expect(el.querySelectorAll('.work__gallery').length).toBe(1);

      const images = Array.from(el.querySelectorAll('.work__gallery--landscape img')) as HTMLImageElement[];
      expect(images.length).toBe(landscapeSources.length);
      images.forEach((img) => {
        expect(img.getAttribute('width')).toBe('1280');
        expect(img.getAttribute('height')).toBe('740');
        expect(img.getAttribute('loading')).toBe('lazy');
        expect(img.getAttribute('alt')).toBe('Both Galleries');
      });
    });

    it('should go back to the portrait photos when the portrait tab is clicked again', async () => {
      const f = await createPage('both-galleries', [bothGalleriesProject]);
      const el: HTMLElement = f.nativeElement;

      tabById(el, 'landscape').click();
      f.detectChanges();
      tabById(el, 'portrait').click();
      f.detectChanges();

      expect(tabById(el, 'portrait').getAttribute('aria-selected')).toBe('true');
      expect(photoSources(panelOf(el))).toEqual(portraitSources);
      expect(el.querySelector('.work__gallery--landscape')).toBeNull();
    });

    it.each([
      ['portrait', 'ArrowRight', 'landscape'],
      ['portrait', 'ArrowLeft', 'landscape'],
      ['portrait', 'End', 'landscape'],
      ['portrait', 'Home', 'portrait'],
      ['landscape', 'ArrowRight', 'portrait'],
      ['landscape', 'ArrowLeft', 'portrait'],
      ['landscape', 'Home', 'portrait'],
      ['landscape', 'End', 'landscape'],
    ] as const)('from the %s tab, %s should select and focus the %s tab', async (from, key, expected) => {
      const f = await createPage('both-galleries', [bothGalleriesProject]);
      const el: HTMLElement = f.nativeElement;
      if (from === 'landscape') {
        tabById(el, 'landscape').click();
        f.detectChanges();
      }

      const event = pressKey(f, tabById(el, from), key);

      expect(event.defaultPrevented).toBe(true);
      expect(tabById(el, expected).getAttribute('aria-selected')).toBe('true');
      expect(document.activeElement?.id).toBe(`work-gallery-tab-${expected}`);
      expect(photoSources(panelOf(el))).toEqual(expected === 'portrait' ? portraitSources : landscapeSources);
    });

    it('should ignore keys that do not move the selection', async () => {
      const f = await createPage('both-galleries', [bothGalleriesProject]);
      const el: HTMLElement = f.nativeElement;

      const event = pressKey(f, tabById(el, 'portrait'), 'a');

      expect(event.defaultPrevented).toBe(false);
      expect(tabById(el, 'portrait').getAttribute('aria-selected')).toBe('true');
      expect(photoSources(panelOf(el))).toEqual(portraitSources);
    });

    it('should not render tabs when the project only has the portrait gallery', async () => {
      const f = await createPage('full-project', [fullProject]);
      const el: HTMLElement = f.nativeElement;

      expect(el.querySelector('[role="tablist"]')).toBeNull();
      expect(tabsOf(el).length).toBe(0);
      expect(panelOf(el).getAttribute('role')).toBeNull();
      expect(panelOf(el).getAttribute('aria-labelledby')).toBeNull();
      expect(photoSources(panelOf(el))).toEqual(['/img/1.png', '/img/2.png', '/img/3.png']);
    });

    it('should render only the landscape grid, without tabs, when there is no portrait gallery', async () => {
      const landscapeOnly: ProjectItem = { ...mockProject, id: 'landscape-only', galleryLandscape: ['/img/landscape-1.png'] };

      const f = await createPage('landscape-only', [landscapeOnly]);
      const el: HTMLElement = f.nativeElement;

      expect(tabsOf(el).length).toBe(0);
      expect(el.querySelectorAll('.work__gallery').length).toBe(1);
      expect(el.querySelector('.work__gallery')?.classList.contains('work__gallery--landscape')).toBe(true);
      expect(photoSources(panelOf(el))).toEqual(['/img/landscape-1.png']);
    });
  });

  describe('banner', () => {
    const bannerOf = (el: HTMLElement): HTMLImageElement | null => el.querySelector('.work__banner img');

    it('should render the banner with the project title as alt when the project has one', async () => {
      const withBanner: ProjectItem = { ...mockProject, id: 'with-banner', title: 'Banner Project', bannerImage: 'assets/projects/with-banner/banner.webp' };

      const f = await createPage('with-banner', [withBanner]);
      const img = bannerOf(f.nativeElement);

      expect(img?.getAttribute('src')).toBe('assets/projects/with-banner/banner.webp');
      expect(img?.getAttribute('alt')).toBe('Banner Project');
    });

    it('should declare the intrinsic size of the banner to avoid layout shift', async () => {
      const withBanner: ProjectItem = { ...mockProject, id: 'with-banner', bannerImage: 'assets/projects/with-banner/banner.webp' };

      const f = await createPage('with-banner', [withBanner]);
      const img = bannerOf(f.nativeElement);

      expect([img?.getAttribute('width'), img?.getAttribute('height')]).toEqual(['1902', '827']);
    });

    it('should not render a banner when the project has none', async () => {
      const f = await createPage('full-project', [fullProject]);

      expect(f.nativeElement.querySelector('.work__banner')).toBeNull();
    });

    it('should place the banner first, before the aside and the sections, inside the content grid', async () => {
      const withBanner: ProjectItem = { ...mockProject, id: 'with-banner', bannerImage: 'assets/projects/with-banner/banner.webp' };

      const f = await createPage('with-banner', [withBanner]);
      const el: HTMLElement = f.nativeElement;
      const content = el.querySelector('.work__content') as HTMLElement;
      const children = Array.from(content.children).map((child) => child.className.split(' ')[0]);

      expect(children).toEqual(['work__banner', 'work__aside', 'work__sections']);
    });

    it('should flag the content grid only when there is a banner', async () => {
      const withBanner: ProjectItem = { ...mockProject, id: 'with-banner', bannerImage: 'assets/projects/with-banner/banner.webp' };

      const withIt = await createPage('with-banner', [withBanner]);
      const without = await createPage('full-project', [fullProject]);

      expect((withIt.nativeElement as HTMLElement).querySelector('.work__content')?.classList.contains('work__content--banner')).toBe(true);
      expect((without.nativeElement as HTMLElement).querySelector('.work__content')?.classList.contains('work__content--banner')).toBe(false);
    });
  });

  describe('AI details', () => {
    const aiProject: ProjectItem = {
      ...mockProject,
      id: 'ai-project',
      isAiAssisted: true,
      aiDetail: {
        tools: ['Tool A', 'Tool B'],
        workflow: ['AI_WORKFLOW_1', 'AI_WORKFLOW_2'],
        productFeatures: ['AI_PRODUCT_1'],
        quality: ['AI_QUALITY_1', 'AI_QUALITY_2', 'AI_QUALITY_3'],
      },
    };
    const sectionOf = (el: HTMLElement, name: string): HTMLElement | null => el.querySelector(`[data-ai-section="${name}"]`);

    it('should render the AI-assisted badge when the project is AI-assisted', async () => {
      const f = await createPage('ai-project', [aiProject]);

      expect(f.nativeElement.querySelector('.work__ai-badge')).not.toBeNull();
    });

    it('should render the tools and the list of every AI section', async () => {
      const f = await createPage('ai-project', [aiProject]);
      const el: HTMLElement = f.nativeElement;

      expect(Array.from(sectionOf(el, 'workflow')?.querySelectorAll('.work__techs small') ?? []).map((tool) => tool.textContent?.trim())).toEqual(['Tool A', 'Tool B']);
      expect(sectionOf(el, 'workflow')?.querySelectorAll('li').length).toBe(2);
      expect(sectionOf(el, 'product')?.querySelectorAll('li').length).toBe(1);
      expect(sectionOf(el, 'quality')?.querySelectorAll('li').length).toBe(3);
    });

    it('should render the AI sections before the gallery', async () => {
      const f = await createPage('ai-project', [{ ...aiProject, galleryPortrait: ['/img/1.png'] }]);
      const el: HTMLElement = f.nativeElement;
      const quality = sectionOf(el, 'quality') as HTMLElement;
      const gallery = el.querySelector('.work__gallery-panel') as HTMLElement;

      expect(quality.compareDocumentPosition(gallery) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('should skip the sections that have no content', async () => {
      const partial: ProjectItem = { ...aiProject, aiDetail: { productFeatures: ['AI_PRODUCT_1'], quality: [] } };

      const f = await createPage('ai-project', [partial]);
      const el: HTMLElement = f.nativeElement;

      expect(sectionOf(el, 'workflow')).toBeNull();
      expect(sectionOf(el, 'quality')).toBeNull();
      expect(sectionOf(el, 'product')).not.toBeNull();
    });

    it('should not render the badge or any AI section for a regular project', async () => {
      const f = await createPage('full-project', [fullProject]);
      const el: HTMLElement = f.nativeElement;

      expect(el.querySelector('.work__ai-badge')).toBeNull();
      expect(el.querySelector('[data-ai-section]')).toBeNull();
    });
  });

  describe('usage metrics', () => {
    it('should not render the AI card metrics on the work page', async () => {
      const withMetrics: ProjectItem = { ...mockProject, id: 'with-metrics', aiMetrics: [{ value: '3', labelKey: 'METRIC_USERS', icon: 'fa-solid fa-users' }] };

      const f = await createPage('with-metrics', [withMetrics]);

      expect(f.nativeElement.querySelector('[data-section="metrics"], .work__metrics')).toBeNull();
    });
  });

  describe('cardTheme handling', () => {
    it('should not apply themed class and cover when project has no cardTheme', () => {
      const aside = fixture.nativeElement.querySelector('.work__aside') as HTMLElement;
      const cover = fixture.nativeElement.querySelector('.work__cover');

      expect(aside.classList.contains('work__aside--themed')).toBe(false);
      expect(cover).toBeNull();
    });

    it('should apply themed class, cover image, and CSS custom properties when project has cardTheme', async () => {
      const f = await createPage('themed-project', [themedProject]);
      const aside = f.nativeElement.querySelector('.work__aside') as HTMLElement;
      const cover = f.nativeElement.querySelector('.work__cover img') as HTMLImageElement;
      const container = f.nativeElement.querySelector('.work__container') as HTMLElement;

      expect(aside.classList.contains('work__aside--themed')).toBe(true);
      expect(cover).not.toBeNull();
      expect(cover.getAttribute('src')).toBe('/img/cover.png');
      expect(container.style.getPropertyValue('--card-accent')).toBe('#34d399');
      expect(aside.style.getPropertyValue('--card-accent')).toBe('#34d399');
    });

    it('should return empty object when project is null', () => {
      expect(component['cardThemeVars'](null)).toEqual({});
    });
  });
});
