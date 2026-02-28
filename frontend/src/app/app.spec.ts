import { afterEach, describe, expect, it, vi } from 'vitest';
import { TranslateService } from '@ngx-translate/core';
import { App } from './app';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should use browser language when it is supported', () => {
    const useSpy = vi.fn();
    vi.spyOn(TranslateService, 'getBrowserLang').mockReturnValue('pt');

    new App({ use: useSpy } as unknown as TranslateService);

    expect(useSpy).toHaveBeenCalledWith('pt');
  });

  it('should fallback to english when browser language is not supported', () => {
    const useSpy = vi.fn();
    vi.spyOn(TranslateService, 'getBrowserLang').mockReturnValue('fr');

    new App({ use: useSpy } as unknown as TranslateService);

    expect(useSpy).toHaveBeenCalledWith('en');
  });

  it('should fallback to english when browser language is undefined', () => {
    const useSpy = vi.fn();
    vi.spyOn(TranslateService, 'getBrowserLang').mockReturnValue(undefined);

    new App({ use: useSpy } as unknown as TranslateService);

    expect(useSpy).toHaveBeenCalledWith('en');
  });
});
