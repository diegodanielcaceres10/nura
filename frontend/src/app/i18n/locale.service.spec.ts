import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
    document.documentElement.lang = '';
    TestBed.resetTestingModule();
  });

  it('resolveStartupLocale should use query param first', () => {
    window.localStorage.setItem('app_locale', 'en');
    window.history.replaceState({}, '', '/?lang=pt');

    expect(LocaleService.resolveStartupLocale('en-US')).toBe('pt');
  });

  it('resolveStartupLocale should prioritize path locale over query and storage', () => {
    window.localStorage.setItem('app_locale', 'en');
    window.history.replaceState({}, '', '/pt?lang=es');

    expect(LocaleService.resolveStartupLocale('en-US')).toBe('pt');
  });

  it('resolveStartupLocale should fallback to default locale when no source is available', () => {
    expect(LocaleService.resolveStartupLocale('pt-BR')).toBe('es');
    expect(LocaleService.resolveStartupLocale('en-US')).toBe('es');
  });

  it('resolveStartupLocale should fallback to default when browserLang is not provided', () => {
    expect(LocaleService.resolveStartupLocale()).toBe('es');
  });

  it('resolveStartupLocale should ignore persisted locale and use default', () => {
    window.localStorage.setItem('app_locale', 'en');
    expect(LocaleService.resolveStartupLocale('en-US')).toBe('es');
  });

  it('resolveStartupLocale should fallback to default locale for unsupported values', () => {
    expect(LocaleService.resolveStartupLocale('fr-FR')).toBe('es');
  });

  it('getCurrentLocale should read locale from html lang', () => {
    document.documentElement.lang = 'pt-BR';
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const service = TestBed.inject(LocaleService);

    expect(service.getCurrentLocale()).toBe('pt');
  });

  it('getCurrentLocale should fallback to default for unsupported html lang', () => {
    document.documentElement.lang = 'de-DE';
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const service = TestBed.inject(LocaleService);

    expect(service.getCurrentLocale()).toBe('es');
  });

  it('changeLocale should persist normalized locale', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const service = TestBed.inject(LocaleService);
    try {
      service.changeLocale('pt-BR');
    } catch {
      // jsdom may throw because navigation is not implemented.
    }

    expect(window.localStorage.getItem('app_locale')).toBe('pt');
  });

  it('changeLocale should fallback to default for unsupported locale', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const service = TestBed.inject(LocaleService);
    try {
      service.changeLocale('fr-FR');
    } catch {
      // jsdom may throw because navigation is not implemented.
    }

    expect(window.localStorage.getItem('app_locale')).toBe('es');
  });

  it('syncLocalePath should rewrite the current URL with locale segment', () => {
    window.history.replaceState({}, '', '/about?lang=pt#section');

    LocaleService.syncLocalePath('pt');

    expect(window.location.pathname).toBe('/pt/about');
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#section');
  });
});
