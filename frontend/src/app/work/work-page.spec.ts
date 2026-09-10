import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkPage } from './work-page';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectsService } from '../services/projects/projects.service';

const mockProject = {
  id: 'ionic-plugin-lab',
  title: 'Ionic Plugin Lab',
  type: 'Mobile' as const,
  shortDescription: 'Short desc',
  coverImage: '',
  techStackPreview: ['Ionic', 'Angular'],
  status: 'IN_PROGRESS' as const,
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
      imports: [WorkPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'ionic-plugin-lab' } } },
        },
        {
          provide: Router,
          useValue: { navigate: vi.fn() },
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
      imports: [WorkPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'nonexistent-id' } } },
        },
        { provide: Router, useValue: { navigate: vi.fn() } },
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

  it('should navigate back when goBack is called', () => {
    const router = TestBed.inject(Router);
    component['goBack']();
    expect(router.navigate).toHaveBeenCalled();
  });
});
