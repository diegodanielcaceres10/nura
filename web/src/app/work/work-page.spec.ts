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
    npm: 'https://www.npmjs.com/package/full-project',
    androidAPK: 'https://acme.dev/full-project.apk',
  },
  techStackFull: [
    { category: 'Frontend', items: ['Angular', 'TypeScript'] },
    { category: 'Tooling', items: ['Vitest'] },
  ],
  challenges: ['Challenge 1', 'Challenge 2'],
  gallery: ['/img/1.png', '/img/2.png', '/img/3.png'],
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
      const emptyLists: ProjectItem = { ...mockProject, id: 'empty-lists', techStackFull: [], challenges: [], gallery: [] };

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

      expect(actions.map((a) => a.getAttribute('href'))).toEqual(['https://github.com/acme/full-project', 'https://demo.acme.dev', 'https://www.npmjs.com/package/full-project', 'https://acme.dev/full-project.apk']);
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
