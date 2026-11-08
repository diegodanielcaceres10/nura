import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import es from '../../../../public/assets/i18n/es.json';
import deJson from '../../../../public/assets/i18n/de.json';
import frJson from '../../../../public/assets/i18n/fr.json';
import itJson from '../../../../public/assets/i18n/it.json';
import nlJson from '../../../../public/assets/i18n/nl.json';
import pt from '../../../../public/assets/i18n/pt.json';
import { MESSAGES } from '../../i18n/messages';
import { splitParagraphs } from '../translate/split-paragraphs';
import { CaseStudiesService } from './case-studies.service';

/**
 * CaseStudiesService spec.
 *
 * In short: it guarantees that the case studies catalog is consistent, so the portfolio never
 * shows a raw translation key or a broken route in any language.
 *
 * Guarantees
 * - The five cases come in display order, with the agreed unique slugs.
 * - getBySlug finds each case, is case-sensitive and returns undefined for unknown slugs.
 * - Every case has the seven detail keys, named after its slug, and a non-empty stack.
 * - Every detail key and shared key has text in MESSAGES and in every translation file.
 * - Each section has the same number of paragraphs in every language.
 *
 * Not covered
 * - The quality of the translated texts.
 * - Which text is shown at runtime: in specs $localize returns the English source text.
 */

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

  it('has every detail key and shared key in MESSAGES and in every translation file', () => {
    const keys = [...SHARED_KEYS, ...service.getAll().flatMap((item) => SECTIONS.map((section) => item.detail[section]))];
    const esKeys = es as Record<string, string>;
    const ptKeys = pt as Record<string, string>;
    const itKeys = itJson as Record<string, string>;
    const deKeys = deJson as Record<string, string>;
    const frKeys = frJson as Record<string, string>;
    const nlKeys = nlJson as Record<string, string>;

    expect({
      missingEn: keys.filter((key) => !MESSAGES[key]?.trim()),
      missingEs: keys.filter((key) => !esKeys[key]?.trim()),
      missingPt: keys.filter((key) => !ptKeys[key]?.trim()),
      missingIt: keys.filter((key) => !itKeys[key]?.trim()),
      missingDe: keys.filter((key) => !deKeys[key]?.trim()),
      missingFr: keys.filter((key) => !frKeys[key]?.trim()),
      missingNl: keys.filter((key) => !nlKeys[key]?.trim()),
    }).toEqual({ missingEn: [], missingEs: [], missingPt: [], missingIt: [], missingDe: [], missingFr: [], missingNl: [] });
  });

  it('has the same number of paragraphs in every language for each section', () => {
    const keys = service.getAll().flatMap((item) => SECTIONS.map((section) => item.detail[section]));
    const count = (text: string | undefined): number => splitParagraphs(text ?? '').length;
    const mismatched = keys.filter((key) => new Set([count(MESSAGES[key]), count((es as Record<string, string>)[key]), count((pt as Record<string, string>)[key]), count((itJson as Record<string, string>)[key]), count((deJson as Record<string, string>)[key]), count((frJson as Record<string, string>)[key]), count((nlJson as Record<string, string>)[key])]).size !== 1);

    expect(mismatched).toEqual([]);
  });
});
