import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
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

    expect(cards.length).toBe(9);
  });

  it('should render quick filter buttons', () => {
    const native = fixture.nativeElement as HTMLElement;
    const filters = Array.from(native.querySelectorAll<HTMLButtonElement>('.projects__filter')).map((filter) => filter.textContent?.trim());

    expect(filters).toEqual(['Todos', 'Angular', 'TypeScript', 'Ionic', 'Capacitor', 'React', 'Node.js', 'Docker']);
  });

  it('should filter project cards by selected technology', () => {
    component['setActiveFilter']('react');
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.projects__card');

    expect(component['filteredProjects']().map((project) => project.id)).toEqual(['kora-roster']);
    expect(cards.length).toBe(1);
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

    expect(projects).toHaveLength(9);
    expect(projects[0].id).toBe('kora-core');
    expect(projects[1].id).toBe('kora-roster');
    expect(projects[2].id).toBe('ionic-plugin-lab');
    expect(projects[3].id).toBe('riu-frontend-diego-daniel-caceres');
    expect(projects[4].id).toBe('nura');
    expect(projects[5].id).toBe('oilgroup');
    expect(projects[6].id).toBe('angularjsonform');
    expect(projects[7].id).toBe('octoautodrive');
    expect(projects[8].id).toBe('boleto');
  });

  it('should open and close projects modal', () => {
    const project = component['projects'][0];

    component['openProject'](project);
    expect(component['activeProject']()).toBe(project);

    component['closeProject']();
    expect(component['activeProject']()).toBeNull();
  });

  it('should render the project modal when activeProject is set', () => {
    const native = fixture.nativeElement as HTMLElement;
    const project = component['projects'][0];

    component['openProject'](project);
    fixture.detectChanges();

    expect(native.querySelector('app-project-modal-component')).not.toBeNull();
  });

  it('should close modal on escape key press', () => {
    const project = component['projects'][0];

    component['openProject'](project);
    expect(component['activeProject']()).toBe(project);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(component['activeProject']()).toBeNull();
  });

  it('should open project via button click in template', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.projects__action:not([href])') as HTMLButtonElement;

    button?.click();
    fixture.detectChanges();

    expect(component['activeProject']()).not.toBeNull();
  });

  it('should handle keydown.enter on button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.projects__action:not([href])') as HTMLButtonElement;

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    button?.dispatchEvent(event);
    fixture.detectChanges();

    expect(component['activeProject']()).not.toBeNull();
  });

  it('should handle keydown.space on button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.projects__action:not([href])') as HTMLButtonElement;

    const event = new KeyboardEvent('keydown', { key: ' ' });
    button?.dispatchEvent(event);
    fixture.detectChanges();

    expect(component['activeProject']()).not.toBeNull();
  });

  it('should render anchor tag with href to github repo', () => {
    fixture.detectChanges();
    const githubLink = fixture.nativeElement.querySelector('.projects__action[href]') as HTMLAnchorElement;

    expect(githubLink).not.toBeNull();
    expect(githubLink?.href).toContain('github.com');
    expect(githubLink?.target).toBe('_blank');
  });
});
