import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectCardComponent } from './project-card.component';
import { ProjectItem } from '../projects.component';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;
  let mockProject: ProjectItem;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    mockProject = {
      id: 'test-project',
      title: 'Test Project',
      type: 'Web',
      shortDescription: 'TEST_DESC',
      techStackMain: ['Angular', 'TypeScript'],
      techStackExtended: ['Angular 21', 'TypeScript', 'SCSS'],
      status: 'COMPLETED',
      year: 2026,
      fullDescription: 'TEST_FULL_DESC',
      keyFeatures: ['FEATURE_1'],
      links: {
        repo: 'https://github.com/test/test',
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', mockProject);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should receive project input', () => {
    expect(component.project()).toBe(mockProject);
  });

  it('should have fullDescription input defaulting to false', () => {
    expect(component.fullDescription()).toBe(false);
  });

  it('should render the project title, year, type and translated status', () => {
    const native = fixture.nativeElement as HTMLElement;
    const tags = Array.from(native.querySelectorAll('.project-card__tags small')).map((tag) => tag.textContent?.trim());

    expect(native.querySelector('.project-card__title')?.textContent?.trim()).toBe('Test Project');
    expect(native.querySelector('.project-card__heading small')?.textContent?.trim()).toBe('2026');
    expect(tags[0]).toBe('Web');
    expect(tags[1]).toContain('Completed');
  });

  it('should render the short description by default', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.project-card__description')?.textContent?.trim()).toBe('TEST_DESC');
  });

  it('should render the full description when requested', () => {
    fixture.componentRef.setInput('fullDescription', true);
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.project-card__description')?.textContent?.trim()).toBe('TEST_FULL_DESC');
  });

  it('should render every technology of the extended stack', () => {
    const native = fixture.nativeElement as HTMLElement;
    const techItems = Array.from(native.querySelectorAll('.project-card__tech')).map((tech) => tech.textContent?.trim());

    expect(techItems).toEqual(['Angular 21', 'TypeScript', 'SCSS']);
  });

  it('should fall back to the main stack when the project has no extended stack', () => {
    fixture.componentRef.setInput('project', { ...mockProject, techStackExtended: undefined });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    const techItems = Array.from(native.querySelectorAll('.project-card__tech')).map((tech) => tech.textContent?.trim());

    expect(techItems).toEqual(['Angular', 'TypeScript']);
  });

  it('should render the icon when the project has no avatar', () => {
    fixture.componentRef.setInput('project', { ...mockProject, icon: 'fa-solid fa-bolt' });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    const icon = native.querySelector<HTMLElement>('.project-card__logo i');

    expect(native.querySelector('.project-card__avatar')).toBeNull();
    expect(icon?.classList.contains('fa-solid')).toBe(true);
    expect(icon?.classList.contains('fa-bolt')).toBe(true);
  });
});
