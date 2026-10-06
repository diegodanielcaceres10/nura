import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import en from '../../../../public/assets/i18n/en.json';
import es from '../../../../public/assets/i18n/es.json';
import pt from '../../../../public/assets/i18n/pt.json';
import { MESSAGES } from '../../i18n/messages';
import type { ProjectItem } from '../../sections/projects-component/projects.component';
import { ProjectsService } from './projects.service';

/**
 * ProjectsService spec.
 *
 * In short: it guarantees that the projects catalog is consistent, so the portfolio never
 * shows a raw translation key, a broken route or a card without a visual, and that
 * getAll/getById expose the catalog correctly.
 *
 * Guarantees
 * - The catalog is not empty and every id is unique.
 * - Every id is a lowercase slug, safe to use in the /:lang/work/:id route.
 * - Every project has a title, a tech stack preview, key features and an avatar or icon.
 * - Every translation key used by a project (descriptions, key features, challenges) exists
 *   in MESSAGES and, with a non-empty value, in the en, es and pt files. The translate pipe
 *   falls back to the raw key, so a missing key would show up on screen as plain text.
 * - Asset paths are relative to the base href (assets/projects/...), never absolute.
 * - typeDetails.kind matches the project type, and every link is an https URL.
 * - getAll returns a copy of the list: reordering or emptying the result does not alter the
 *   catalog or what getById finds.
 * - getById finds every project of the catalog and returns undefined for unknown or empty ids.
 *
 * Not covered
 * - That the asset files exist on disk: specs cannot read the file system, so only the path
 *   format is checked.
 * - The quality of the es and pt texts, or the catalog size and content (adding or removing
 *   a project does not break this spec on purpose).
 * - The copy is shallow: the project objects themselves are shared, so editing one of them
 *   would still change the catalog.
 * - Hardcoded Spanish text in typeDetails (deployment, platform, buildTool, topics) is not
 *   translated per locale.
 */

const catalog = new ProjectsService().getAll();

const TYPE_TO_KIND: Record<ProjectItem['type'], string> = {
  Mobile: 'mobile',
  Web: 'web',
  Fullstack: 'fullstack',
  Library: 'library',
  Challenge: 'challenge',
};

const translationKeys = (project: ProjectItem): string[] => [project.shortDescription, project.fullDescription, ...project.keyFeatures, ...(project.challenges ?? [])];

const assetPaths = (project: ProjectItem): string[] => [project.avatar, project.coverImage, ...(project.gallery ?? [])].filter((path): path is string => !!path);

const withoutValue = (source: Record<string, string>, keys: string[]): string[] => keys.filter((key) => !source[key]?.trim());

const isHttpsUrl = (value: string): boolean => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsService);
  });

  describe('getAll', () => {
    it('returns a non-empty catalog', () => {
      expect(service.getAll().length).toBeGreaterThan(0);
    });

    it('has unique ids', () => {
      const ids = service.getAll().map((project) => project.id);

      expect(new Set(ids).size).toBe(ids.length);
    });

    it('returns a copy, so reordering or removing items does not alter the catalog', () => {
      const idsBefore = service.getAll().map((project) => project.id);
      const received = service.getAll();

      received.reverse();
      received.pop();

      expect(service.getAll().map((project) => project.id)).toEqual(idsBefore);
    });

    it('keeps getById working after the returned list was emptied', () => {
      const [first] = service.getAll();

      service.getAll().splice(0);

      expect(service.getById(first.id)).toBe(first);
    });
  });

  describe('getById', () => {
    it('finds every project of the catalog by its id', () => {
      for (const project of service.getAll()) {
        expect(service.getById(project.id)).toBe(project);
      }
    });

    it.each(['does-not-exist', ''])('returns undefined for the id "%s"', (id) => {
      expect(service.getById(id)).toBeUndefined();
    });
  });

  describe('catalog integrity', () => {
    it.each(catalog)('$id: the id is a lowercase slug usable in the work route', (project) => {
      expect(project.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    });

    it.each(catalog)('$id: has a title, a tech stack preview and key features', (project) => {
      expect(project.title.trim()).not.toBe('');
      expect(project.techStackPreview.length).toBeGreaterThan(0);
      expect(project.keyFeatures.length).toBeGreaterThan(0);
    });

    it.each(catalog)('$id: has an avatar or an icon for the card', (project) => {
      expect(project.avatar || project.icon).toBeTruthy();
    });

    it.each(catalog)('$id: only uses translation keys that exist in MESSAGES', (project) => {
      expect(withoutValue(MESSAGES, translationKeys(project))).toEqual([]);
    });

    it.each([
      ['en', en],
      ['es', es],
      ['pt', pt],
    ] as const)('every translation key of every project exists in %s.json', (_locale, translations) => {
      const keys = catalog.flatMap(translationKeys);

      expect(withoutValue(translations, keys)).toEqual([]);
    });

    it.each(catalog)('$id: asset paths are relative to the base href', (project) => {
      const invalid = assetPaths(project).filter((path) => !path.startsWith('assets/projects/'));

      expect(invalid).toEqual([]);
    });

    it.each(catalog)('$id: typeDetails matches the project type', (project) => {
      if (!project.typeDetails) {
        return;
      }

      expect(project.typeDetails.kind).toBe(TYPE_TO_KIND[project.type]);
    });

    it.each(catalog)('$id: every link is an https URL', (project) => {
      const links = Object.values(project.links ?? {}).filter((link): link is string => !!link);

      expect(links.filter((link) => !isHttpsUrl(link))).toEqual([]);
    });
  });
});
