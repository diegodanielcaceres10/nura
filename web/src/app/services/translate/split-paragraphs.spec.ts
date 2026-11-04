import { describe, expect, it } from 'vitest';
import { splitParagraphs } from './split-paragraphs';

describe('splitParagraphs', () => {
  it('returns a single paragraph when there is no blank line', () => {
    expect(splitParagraphs('One block. Still the same block.')).toEqual(['One block. Still the same block.']);
  });

  it('splits on blank lines', () => {
    expect(splitParagraphs('First.\n\nSecond.\n\nThird.')).toEqual(['First.', 'Second.', 'Third.']);
  });

  it('trims paragraphs and drops empty blocks', () => {
    expect(splitParagraphs('  First.  \n\n\n\n  \n\n Second. \n\n')).toEqual(['First.', 'Second.']);
  });

  it('keeps single line breaks inside a paragraph', () => {
    expect(splitParagraphs('Line one\nline two')).toEqual(['Line one\nline two']);
  });

  it('returns no paragraphs for an empty text', () => {
    expect(splitParagraphs('')).toEqual([]);
  });
});
