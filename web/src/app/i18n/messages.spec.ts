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
});
