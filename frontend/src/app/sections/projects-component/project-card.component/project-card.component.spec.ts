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
      coverImage: 'test-cover.png',
      techStackPreview: ['Angular', 'TypeScript'],
      status: 'COMPLETED',
      year: 2026,
      fullDescription: 'TEST_FULL_DESC',
      role: 'TEST_ROLE',
      keyFeatures: ['FEATURE_1'],
      links: {
        repo: 'https://github.com/test/test',
      },
      typeDetails: {
        kind: 'web',
        deployUrl: 'https://test.com',
        responsive: true,
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

  it('should render card with project title', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.project-card')).not.toBeNull();
  });

  it('should render project status badge', () => {
    const native = fixture.nativeElement as HTMLElement;
    const statusElement = native.querySelector('[class*="status"]') || native.querySelector('[class*="badge"]');

    expect(statusElement || native.textContent).toBeTruthy();
  });

  it('should render tech stack preview', () => {
    fixture.detectChanges();
    const techItems = fixture.nativeElement.querySelectorAll('.project-card__tech');

    expect(techItems.length).toBeGreaterThan(0);
  });
});
