import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsService);
  });

  it('should return all projects', () => {
    const projects = service.getAll();

    expect(projects.length).toBe(10);
  });

  it('should have unique ids', () => {
    const ids = service.getAll().map((p) => p.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should return a project by id', () => {
    const project = service.getById('luma');

    expect(project?.id).toBe('luma');
    expect(project?.title).toBe('Luma');
  });

  it('should return undefined for an unknown id', () => {
    expect(service.getById('does-not-exist')).toBeUndefined();
  });
});
