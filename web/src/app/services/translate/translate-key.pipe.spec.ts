import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MESSAGES } from '../../i18n/messages';
import { TranslateKeyPipe } from './translate-key.pipe';

/**
 * TranslateKeyPipe spec.
 *
 * In short: it guarantees that a known key renders its message, that anything else never
 * breaks the page, and that the pipe is usable in templates as `translate`.
 *
 * Guarantees
 * - A known key returns its message from MESSAGES, and not the key itself.
 * - Every key of MESSAGES resolves to its own message.
 * - A key without a message is returned unchanged. The lookup is exact: it is
 *   case-sensitive and does not trim spaces.
 * - null, undefined and an empty string return an empty string.
 * - In a template the pipe is registered as `translate` and follows changes of the key.
 *
 * Not covered
 * - The es and pt texts: in specs $localize returns the English source text, so only the
 *   key-to-message lookup is checked here, not the translation files.
 * - That MESSAGES and the en, es and pt JSON files have the same keys (i18n/messages.ts has
 *   no spec of its own yet).
 * - Known gap: keys that exist on Object.prototype (constructor, toString, __proto__) return
 *   a function or an object instead of a string.
 */

@Component({
  selector: 'app-translate-host',
  standalone: true,
  imports: [TranslateKeyPipe],
  template: '{{ key() | translate }}',
})
class TranslateHostComponent {
  readonly key = signal<string | null | undefined>('MENU_PROJECTS');
}

describe('TranslateKeyPipe', () => {
  describe('transform', () => {
    const pipe = new TranslateKeyPipe();

    it('returns the message of a known key instead of echoing the key', () => {
      const result = pipe.transform('MENU_PROJECTS');

      expect(result).toBe(MESSAGES['MENU_PROJECTS']);
      expect(result).not.toBe('MENU_PROJECTS');
    });

    it('returns its own message for every key of MESSAGES', () => {
      for (const [key, message] of Object.entries(MESSAGES)) {
        expect(pipe.transform(key)).toBe(message);
      }
    });

    it.each(['MISSING_KEY', 'menu_projects', ' MENU_PROJECTS '])('returns the key unchanged when there is no message for %j', (key) => {
      expect(pipe.transform(key)).toBe(key);
    });

    it.each([null, undefined, ''])('returns an empty string for %j', (key) => {
      expect(pipe.transform(key)).toBe('');
    });
  });

  describe('in a template', () => {
    it('is registered as "translate" and follows the key', () => {
      const fixture = TestBed.createComponent(TranslateHostComponent);
      const text = (): string => (fixture.nativeElement as HTMLElement).textContent?.trim() ?? '';

      fixture.detectChanges();
      expect(text()).toBe(MESSAGES['MENU_PROJECTS']);

      fixture.componentInstance.key.set('MISSING_KEY');
      fixture.detectChanges();
      expect(text()).toBe('MISSING_KEY');

      fixture.componentInstance.key.set(null);
      fixture.detectChanges();
      expect(text()).toBe('');
    });
  });
});
