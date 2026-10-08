import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectItem, ProjectsComponent } from './projects.component';
import { Router } from '@angular/router';
import { ProjectsService } from '../../services/projects/projects.service';
import { LocaleService } from '../../services/locale/locale.service';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the projects section and title', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.projects')).not.toBeNull();
    expect(native.querySelector('app-title-component')).not.toBeNull();
  });

  it('should render all project cards in the grid', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = native.querySelectorAll('.projects__card');

    expect(cards.length).toBe(10);
  });

  it('should render quick filter buttons', () => {
    const native = fixture.nativeElement as HTMLElement;
    const filters = Array.from(native.querySelectorAll<HTMLButtonElement>('.projects__filter')).map((filter) => filter.textContent?.trim());

    expect(filters).toEqual(['Todos', 'Angular', 'TypeScript', 'Express', 'Node.js', 'MySQL', 'Capacitor', 'Docker', 'Flutter', 'Ionic', 'npm', 'PostgreSQL', 'Prisma', 'React', 'RxJS', 'SCSS', 'Socket.IO', 'SSG', 'Supabase', 'Vitest']);
  });

  it('should expose one filter for every distinct techStackMain entry', () => {
    const previewTechs = new Set(component['projects'].flatMap((project) => project.techStackMain.map((tech) => tech.toLowerCase())));
    const filterValues = component['projectFilters'].filter((filter) => filter.value !== 'all').map((filter) => filter.value);

    expect(new Set(filterValues)).toEqual(previewTechs);
    expect(filterValues).toHaveLength(previewTechs.size);
  });

  it('should not create filters from techStackExtended entries', () => {
    const labels = component['projectFilters'].map((filter) => filter.label);

    expect(labels).not.toContain('Angular 21');
    expect(labels).not.toContain('Ionic 8');
  });

  it('should filter project cards by selected technology', () => {
    component['setActiveFilter']('react');
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.projects__card');

    expect(component['filteredProjects']().map((project) => project.id)).toEqual(['kora-roster']);
    expect(cards.length).toBe(1);
  });

  it('should match a general filter against versioned technologies in techStackExtended', () => {
    component['setActiveFilter']('angular');

    const projectIds = component['filteredProjects']().map((project) => project.id);

    expect(projectIds).toEqual(['luma', 'ionic-plugin-lab', 'riu-frontend-diego-daniel-caceres', 'nura', 'oilgroup', 'angularjsonform', 'octoautodrive']);
  });

  it('should match technologies declared only in the full technology stack', () => {
    component['setActiveFilter']('docker');
    fixture.detectChanges();

    const projectIds = component['filteredProjects']().map((project) => project.id);

    expect(projectIds).toContain('ionic-plugin-lab');
  });

  it('should mark the active quick filter as pressed', () => {
    component['setActiveFilter']('ionic');
    fixture.detectChanges();

    const activeFilter = fixture.nativeElement.querySelector('.projects__filter--active') as HTMLButtonElement;

    expect(activeFilter?.textContent?.trim()).toBe('Ionic');
    expect(activeFilter?.getAttribute('aria-pressed')).toBe('true');
  });

  it('should have the expected projects array', () => {
    const projects = component['projects'];

    expect(projects).toHaveLength(10);
    expect(projects[0].id).toBe('luma');
    expect(projects[1].id).toBe('kora-core');
    expect(projects[2].id).toBe('kora-roster');
    expect(projects[3].id).toBe('ionic-plugin-lab');
    expect(projects[4].id).toBe('riu-frontend-diego-daniel-caceres');
    expect(projects[5].id).toBe('nura');
    expect(projects[6].id).toBe('oilgroup');
    expect(projects[7].id).toBe('angularjsonform');
    expect(projects[8].id).toBe('octoautodrive');
    expect(projects[9].id).toBe('boleto');
  });

  it('should open project via button click in template', () => {
    const spy = vi.spyOn(component as unknown as { navigateToProject: (p: ProjectItem) => void }, 'navigateToProject');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.projects__action:not([href])') as HTMLButtonElement;

    button?.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should handle keydown.enter on button', () => {
    const spy = vi.spyOn(component as unknown as { navigateToProject: (p: ProjectItem) => void }, 'navigateToProject');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.projects__action:not([href])') as HTMLButtonElement;

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    button?.dispatchEvent(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should handle keydown.space on button', () => {
    const spy = vi.spyOn(component as unknown as { navigateToProject: (p: ProjectItem) => void }, 'navigateToProject');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.projects__action:not([href])') as HTMLButtonElement;

    const event = new KeyboardEvent('keydown', { key: ' ' });
    button?.dispatchEvent(event);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should render external project links with safe new-tab attributes', () => {
    fixture.detectChanges();
    const native = fixture.nativeElement as HTMLElement;
    const links = Array.from(native.querySelectorAll<HTMLAnchorElement>('.projects__action[href]'));
    const androidLink = native.querySelector<HTMLAnchorElement>('.projects__action-android');

    expect(links.length).toBeGreaterThan(0);
    expect(links.every((link) => link.target === '_blank' && link.rel === 'noopener')).toBe(true);
    expect(links.some((link) => link.href.includes('github.com'))).toBe(true);
    expect(androidLink?.href).toContain('app-release.apk');
  });

  it('should apply the filter when a filter button is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.projects__filter') as NodeListOf<HTMLButtonElement>;
    const reactButton = Array.from(buttons).find((b) => b.textContent?.trim() === 'React') as HTMLButtonElement;

    reactButton.click();
    fixture.detectChanges();

    expect(component['activeFilter']()).toBe('react');
    expect(fixture.nativeElement.querySelectorAll('.projects__card').length).toBe(1);
  });

  describe('with controlled projects', () => {
    const baseProject: ProjectItem = {
      id: 'base',
      title: 'Base',
      type: 'Web',
      shortDescription: 'Short desc',
      techStackMain: [],
      status: 'COMPLETED',
      year: 2026,
      fullDescription: 'Full desc',
      keyFeatures: ['Feature 1'],
    };
    const withCover: ProjectItem = { ...baseProject, id: 'with-cover', title: 'With Cover', techStackMain: ['Ionic'] };
    const withoutCover: ProjectItem = { ...baseProject, id: 'without-cover', title: 'Without Cover', techStackMain: ['Angular'] };
    let navigate: ReturnType<typeof vi.fn>;
    let getCurrentLocale: ReturnType<typeof vi.fn>;

    const clickFilter = (label: string): void => {
      const buttons = Array.from(fixture.nativeElement.querySelectorAll('.projects__filter') as NodeListOf<HTMLButtonElement>);
      buttons.find((b) => b.textContent?.trim() === label)?.click();
      fixture.detectChanges();
    };

    beforeEach(async () => {
      await TestBed.resetTestingModule();
      navigate = vi.fn();
      getCurrentLocale = vi.fn(() => 'pt');
      await TestBed.configureTestingModule({
        imports: [ProjectsComponent],
        providers: [
          { provide: Router, useValue: { navigate } },
          { provide: ProjectsService, useValue: { getAll: () => [withCover, withoutCover] } },
          { provide: LocaleService, useValue: { getCurrentLocale } },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProjectsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not show the empty state while there are projects to display', () => {
      expect(fixture.nativeElement.querySelector('.projects__empty')).toBeNull();
    });

    it('should order filters by repetition, then alphabetically, counting each project once', async () => {
      const projects: ProjectItem[] = [
        { ...baseProject, id: 'a', techStackMain: ['Vue', 'Vue', 'Angular'] },
        { ...baseProject, id: 'b', techStackMain: ['react', 'Angular'] },
        { ...baseProject, id: 'c', techStackMain: ['Angular', 'Vue', 'Zod'] },
      ];
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [ProjectsComponent],
        providers: [
          { provide: Router, useValue: { navigate } },
          { provide: ProjectsService, useValue: { getAll: () => projects } },
          { provide: LocaleService, useValue: { getCurrentLocale } },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(ProjectsComponent);
      fixture.detectChanges();

      const labels = Array.from(fixture.nativeElement.querySelectorAll('.projects__filter') as NodeListOf<HTMLButtonElement>).map((b) => b.textContent?.trim());

      expect(labels).toEqual(['Todos', 'Angular', 'Vue', 'react', 'Zod']);
    });

    it('should show only the projects that use the clicked technology', () => {
      clickFilter('Ionic');

      const titles = Array.from(fixture.nativeElement.querySelectorAll('.project-card__title') as NodeListOf<HTMLElement>).map((t) => t.textContent?.trim());

      expect(titles).toEqual(['With Cover']);
    });

    it('should show the empty state when no project matches the selected filter', () => {
      component['setActiveFilter']('docker');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('.projects__card').length).toBe(0);
      expect(fixture.nativeElement.querySelector('.projects__empty')).not.toBeNull();
    });

    it('should navigate to the work page of the project whose button was clicked', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.projects__action:not([href])') as NodeListOf<HTMLButtonElement>;

      buttons[1].click();

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(getCurrentLocale).toHaveBeenCalledOnce();
      expect(navigate).toHaveBeenCalledWith(['/', 'pt', 'work', 'without-cover']);
    });
  });
});
