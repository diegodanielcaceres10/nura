import { describe, expect, it } from 'vitest';
import { TranslateKeyPipe } from './translate-key.pipe';

describe('TranslateKeyPipe', () => {
  const pipe = new TranslateKeyPipe();

  it('should translate known key', () => {
    expect(pipe.transform('MENU_PROJECTS')).toBeTypeOf('string');
    expect(pipe.transform('MENU_PROJECTS').length).toBeGreaterThan(0);
  });

  it('should return input key when translation is missing', () => {
    expect(pipe.transform('MISSING_KEY')).toBe('MISSING_KEY');
  });

  it('should return empty string for nullish key', () => {
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('')).toBe('');
  });
});
