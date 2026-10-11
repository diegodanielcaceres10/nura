import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import es from '../../../../public/assets/i18n/es.json';
import pt from '../../../../public/assets/i18n/pt.json';
import { MESSAGES } from '../../i18n/messages';
import { CaseStudiesService } from './case-studies.service';

const SLUGS = ['legacy-codebase-modernization', 'cicd-pipeline-automation', 'recurring-bugs-reduction', 'legacy-mobile-migration', 'cloud-storage-migration'];
const SHARED_KEYS = ['CASE_DETAIL_LABEL_CONTEXT', 'CASE_DETAIL_LABEL_CHALLENGE', 'CASE_DETAIL_LABEL_ROLE', 'CASE_DETAIL_LABEL_DECISIONS', 'CASE_DETAIL_LABEL_EXECUTION', 'CASE_DETAIL_LABEL_RESULTS', 'CASE_DETAIL_LABEL_LEARNINGS', 'CASE_DETAIL_LABEL_STACK', 'CASE_DETAIL_NOT_FOUND', 'CASE_STUDY_READ_MORE'];
const SECTIONS = ['context', 'challenge', 'role', 'decisions', 'execution', 'results', 'learnings'] as const;

describe('CaseStudiesService', () => {
  const service = TestBed.inject(CaseStudiesService);

  it('returns the five cases in display order', () => {
    expect(service.getAll().map((item) => item.number)).toEqual(['01', '02', '03', '04', '05']);
  });

  it('uses the agreed slugs', () => {
    expect(service.getAll().map((item) => item.slug)).toEqual(SLUGS);
  });

  it('has unique slugs', () => {
    expect(new Set(service.getAll().map((item) => item.slug)).size).toBe(SLUGS.length);
  });

  it('finds a case by slug', () => {
    expect(service.getBySlug('cloud-storage-migration')?.number).toBe('05');
  });

  it('returns undefined for an unknown slug', () => {
    expect(service.getBySlug('does-not-exist')).toBeUndefined();
  });

  it('matches slugs case-sensitively', () => {
    expect(service.getBySlug('Cloud-Storage-Migration')).toBeUndefined();
  });

  it('gives every case the seven detail keys, named after its slug, and a non-empty stack', () => {
    for (const item of service.getAll()) {
      const slugKey = item.slug.toUpperCase().replace(/-/g, '_');
      for (const section of SECTIONS) {
        expect(item.detail[section]).toBe(`CASE_DETAIL_${slugKey}_${section.toUpperCase()}`);
      }
      expect(item.detail.stack.length).toBeGreaterThan(0);
    }
  });

  it('has every detail key and shared key in MESSAGES, es.json and pt.json', () => {
    const keys = [...SHARED_KEYS, ...service.getAll().flatMap((item) => SECTIONS.map((section) => item.detail[section]))];
    const esKeys = es as Record<string, string>;
    const ptKeys = pt as Record<string, string>;

    expect({
      missingEn: keys.filter((key) => !MESSAGES[key]?.trim()),
      missingEs: keys.filter((key) => !esKeys[key]?.trim()),
      missingPt: keys.filter((key) => !ptKeys[key]?.trim()),
    }).toEqual({ missingEn: [], missingEs: [], missingPt: [] });
  });
});
