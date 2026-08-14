import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectModalComponent } from './project-modal.component';
import { ProjectItem } from '../projects.component';

describe('ProjectModalComponent', () => {
  let component: ProjectModalComponent;
  let fixture: ComponentFixture<ProjectModalComponent>;
  let mockProject: ProjectItem;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray, ..._args: unknown[]) => (typeof message === 'string' ? message : (message[0] ?? '')));

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

  it('should download APK when downloadAPK is called with valid path', () => {
    const path = 'assets/test.apk';
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
      click: vi.fn(),
      href: '',
      download: '',
    } as any);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

    component['downloadAPK'](path);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});
