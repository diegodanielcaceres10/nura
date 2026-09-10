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
  coverImage: '',
  techStackPreview: ['Ionic', 'Angular'],
  status: 'IN_PROGRESS',
  year: 2026,
  fullDescription: 'Full desc',
  keyFeatures: ['Feature 1'],
};

describe('WorkPage', () => {
  let component: WorkPage;
  let fixture: ComponentFixture<WorkPage>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => {
      return typeof message === 'string' ? message : (message[0] ?? '');
    });

    await TestBed.configureTestingModule({
      imports: [WorkPage, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'ionic-plugin-lab' } } },
        },
        {
          provide: ProjectsService,
          useValue: {
            getAll: () => [mockProject],
            getById: (id: string) => (id === 'ionic-plugin-lab' ? mockProject : undefined),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
  });

  it('should show not-found state when project does not exist', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [WorkPage, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'nonexistent-id' } } },
        },
        {
          provide: ProjectsService,
          useValue: { getAll: () => [], getById: () => undefined },
        },
      ],
    }).compileComponents();

    const f = TestBed.createComponent(WorkPage);
    f.detectChanges();
    expect(f.componentInstance['notFound']()).toBe(true);
  });

  // it('should call location.back() when history length > 1', () => {
  //   vi.stubGlobal('window', { ...window, history: { length: 5 } });
  //   const locationSpy = vi.spyOn(TestBed.inject(Location), 'back');
  //   component['goBack']();
  //   expect(locationSpy).toHaveBeenCalled();
  // });

  // it('should navigate to /#projects as fallback when no history', () => {
  //   vi.stubGlobal('window', { ...window, history: { length: 1 } });
  //   const navigateSpy = vi.spyOn(component['router'], 'navigate');
  //   component['goBack']();
  //   expect(navigateSpy).toHaveBeenCalledWith(expect.any(Array), { fragment: 'projects' });
  // });

  it('should navigate back when goBack is called', () => {
    const navigateSpy = vi.spyOn(component['router'], 'navigate');
    component['goBack']();
    expect(navigateSpy).toHaveBeenCalled();
  });
});
