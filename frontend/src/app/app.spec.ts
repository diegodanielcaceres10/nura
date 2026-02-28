import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, TranslateModule.forRoot()],
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should use browser language when it is supported', () => {
    const useSpy = vi.spyOn(TestBed.inject(TranslateService), 'use');
    vi.spyOn(TranslateService, 'getBrowserLang').mockReturnValue('pt');

    TestBed.createComponent(App);

    expect(useSpy).toHaveBeenCalledWith('pt');
  });

  it('should fallback to english when browser language is not supported', () => {
    const useSpy = vi.spyOn(TestBed.inject(TranslateService), 'use');
    vi.spyOn(TranslateService, 'getBrowserLang').mockReturnValue('fr');

    TestBed.createComponent(App);

    expect(useSpy).toHaveBeenCalledWith('en');
  });

  it('should fallback to english when browser language is undefined', () => {
    const useSpy = vi.spyOn(TestBed.inject(TranslateService), 'use');
    vi.spyOn(TranslateService, 'getBrowserLang').mockReturnValue(undefined);

    TestBed.createComponent(App);

    expect(useSpy).toHaveBeenCalledWith('en');
  });

  it('should render app shell sections from template', () => {
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const root = fixture.nativeElement;
    expect(root.querySelector('app-header-component')).toBeTruthy();
    expect(root.querySelector('main')).toBeTruthy();
    expect(root.querySelector('app-home-component')).toBeTruthy();
    expect(root.querySelector('app-about-component')).toBeTruthy();
    expect(root.querySelector('app-experiences-component')).toBeTruthy();
    expect(root.querySelector('app-projects-component')).toBeTruthy();
    expect(root.querySelector('app-footer-component')).toBeTruthy();
  });
});
