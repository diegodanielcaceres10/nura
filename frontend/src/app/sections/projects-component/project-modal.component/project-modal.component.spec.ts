import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectModalComponent } from './project-modal.component';
import { ProjectItem } from '../projects.component';

describe('ProjectModalComponent', () => {
  let component: ProjectModalComponent;
  let fixture: ComponentFixture<ProjectModalComponent>;
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
      keyFeatures: ['FEATURE_1', 'FEATURE_2'],
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
      imports: [ProjectModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectModalComponent);
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

  it('should emit closeModalProject event when closeProject is called', () => {
    const emitSpy = vi.spyOn(component.closeModalProject, 'emit');

    component['closeProject']();

    expect(emitSpy).toHaveBeenCalled();
  });
});
