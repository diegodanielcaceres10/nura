import { describe, expect, it } from 'vitest';
import es from '../../../public/assets/i18n/es.json';
import pt from '../../../public/assets/i18n/pt.json';
import { MESSAGES } from './messages';

/**
 * MESSAGES spec.
 *
 * In short: it guarantees that the English messages and the es and pt translation files stay
 * in sync, and that copy and paste mistakes in the English texts are caught.
 *
 * Guarantees
 * - Every English message has text.
 * - The es and pt files have exactly the keys of MESSAGES: none missing, none left over.
 * - Every translation has text.
 * - If two keys share the same English text, their translations are also the same. This
 *   catches an English text pasted over another one while the translations stay correct.
 * - Regression: the Kora Core card describes the backend and the Kora Roster card describes
 *   the team draw (they used to be swapped in English only).
 *
 * Not covered
 * - That an English text is correct in general: only the cases above are checked. A wrong text
 *   that is not a duplicate and is not pinned below would still pass.
 * - The quality of the es and pt texts.
 * - Which text is shown at runtime: in specs $localize returns the English source text.
 */

const TRANSLATIONS = [
  ['es', es],
  ['pt', pt],
] as const;

const messageKeys = Object.keys(MESSAGES);

describe('MESSAGES', () => {
  it('has text for every English message', () => {
    const empty = messageKeys.filter((key) => !MESSAGES[key].trim());

    expect(empty).toEqual([]);
  });

  describe.each(TRANSLATIONS)('%s.json', (_locale, translations: Record<string, string>) => {
    it('has exactly the keys of MESSAGES', () => {
      const fileKeys = Object.keys(translations);

      expect({
        missing: messageKeys.filter((key) => !(key in translations)),
        leftOver: fileKeys.filter((key) => !(key in MESSAGES)),
      }).toEqual({ missing: [], leftOver: [] });
    });

    it('has text for every key', () => {
      const empty = Object.keys(translations).filter((key) => !translations[key].trim());

      expect(empty).toEqual([]);
    });

    it('translates keys with the same English text in the same way', () => {
      const keysByEnglish = new Map<string, string[]>();
      for (const key of messageKeys) {
        const english = MESSAGES[key].trim();
        keysByEnglish.set(english, [...(keysByEnglish.get(english) ?? []), key]);
      }

      const inconsistent = [...keysByEnglish.entries()].filter(([, keys]) => new Set(keys.map((key) => translations[key]?.trim())).size > 1).map(([english, keys]) => ({ english, keys }));

      expect(inconsistent).toEqual([]);
    });
  });

  describe('Kora project descriptions', () => {
    it('describes Kora Core as the backend', () => {
      expect(MESSAGES['PROJECTS_CARD_KORA_CORE_SHORT_DESC']).toMatch(/backend/i);
      expect(MESSAGES['PROJECTS_CARD_KORA_CORE_SHORT_DESC']).not.toMatch(/football/i);
    });

    it('describes Kora Roster as the team draw', () => {
      expect(MESSAGES['PROJECTS_CARD_KORA_ROSTER_SHORT_DESC']).toMatch(/football/i);
      expect(MESSAGES['PROJECTS_CARD_KORA_ROSTER_SHORT_DESC']).not.toMatch(/backend/i);
    });
  });

  describe('case study figures keep their basis', () => {
    const CHECKS: [string, Record<string, string[]>][] = [
      ['CASE_DETAIL_LEGACY_CODEBASE_MODERNIZATION_RESULTS', { en: ['feedback'], es: ['feedback'], pt: ['feedback'] }],
      ['CASE_DETAIL_CICD_PIPELINE_AUTOMATION_RESULTS', { en: ['average', 'Wednesday'], es: ['promedio', 'miércoles'], pt: ['média', 'quarta'] }],
      ['CASE_DETAIL_RECURRING_BUGS_REDUCTION_RESULTS', { en: ['board'], es: ['tablero'], pt: ['quadro'] }],
      ['CASE_DETAIL_CLOUD_STORAGE_MIGRATION_RESULTS', { en: ['feedback'], es: ['feedback'], pt: ['feedback'] }],
    ];
    const TEXTS: Record<string, Record<string, string>> = { en: MESSAGES, es, pt };

    it.each(CHECKS)('%s keeps its qualifiers in en, es and pt', (key, expected) => {
      for (const locale of ['en', 'es', 'pt']) {
        const text = TEXTS[locale][key] ?? '';
        for (const word of expected[locale]) {
          expect(text, `${locale}: ${key} should mention "${word}"`).toContain(word);
        }
      }
    });
  });

  describe('card and home copy matches the case pages', () => {
    it('does not claim personal validation in the storage card, and attributes the figure', () => {
      expect(MESSAGES['CASE_STUDY_03_DESCRIPTION']).not.toContain('I checked');
      expect(MESSAGES['CASE_STUDY_03_DESCRIPTION']).toContain('tech management');
      expect(es['CASE_STUDY_03_DESCRIPTION']).not.toContain('Verifiqué');
      expect(pt['CASE_STUDY_03_DESCRIPTION']).not.toContain('Verifiquei');
    });

    it("attributes the 60% to the lead's feedback", () => {
      expect(MESSAGES['CASE_STUDY_04_DESCRIPTION']).toContain('lead');
      expect(es['CASE_STUDY_04_DESCRIPTION']).toContain('líder');
      expect(pt['CASE_STUDY_04_DESCRIPTION']).toContain('líder');
    });

    it('states the technical reference role in the Ionic card', () => {
      expect(MESSAGES['CASE_STUDY_01_DESCRIPTION']).toContain('technical reference');
      expect(es['CASE_STUDY_01_DESCRIPTION']).toContain('referencia técnica');
      expect(pt['CASE_STUDY_01_DESCRIPTION']).toContain('referência técnica');
    });

    it('scopes the bug figure to recurring bugs and its source, without claiming the tech lead role', () => {
      expect(MESSAGES['CASE_STUDY_05_DESCRIPTION']).toContain('recurring');
      expect(MESSAGES['CASE_STUDY_05_DESCRIPTION']).toContain('Azure DevOps');
      expect(MESSAGES['CASE_STUDY_05_DESCRIPTION']).not.toContain('Tech Lead');
      expect(es['CASE_STUDY_05_DESCRIPTION']).not.toContain('Tech Lead');
      expect(pt['CASE_STUDY_05_DESCRIPTION']).not.toContain('Tech Lead');
    });

    it('qualifies the CI/CD figures', () => {
      expect(MESSAGES['CASE_STUDY_02_DESCRIPTION']).toContain('about');
    });

    it('qualifies the home metrics that are averages or estimates', () => {
      expect(MESSAGES['HOME_METRIC_01_LABEL']).toContain('Average');
      expect(MESSAGES['HOME_METRIC_04_LABEL']).toContain('Estimated');
      expect(MESSAGES['HOME_METRIC_03_LABEL']).toContain('traffic cost');
    });
  });
});
