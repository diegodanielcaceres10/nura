import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './header-component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: any;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, TranslateModule.forRoot()],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    translateService.use('en');

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should start with isSticky false', () => {
    expect(component.isSticky()).toBe(false);
  });

  it('should start with currentLang en', () => {
    expect(component.currentLang()).toBe('en');
  });

  it('should have 3 languages available', () => {
    expect(component.langs).toHaveLength(3);
    expect(component.langs.map((l) => l.code)).toEqual(['es', 'en', 'pt']);
  });

  it('should change language when changeLang is called', () => {
    const spy = vi.spyOn(translateService, 'use');
    component.changeLang('pt');
    expect(spy).toHaveBeenCalledWith('pt');
    expect(component.currentLang()).toBe('pt');
  });

  it('should set isSticky true when scrollY > 50', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    component.onScroll();
    expect(component.isSticky()).toBe(true);
  });

  it('should set isSticky false when scrollY <= 50', () => {
    Object.defineProperty(window, 'scrollY', { value: 30, writable: true });
    component.onScroll();
    expect(component.isSticky()).toBe(false);
  });

  it('should render 3 language buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.header_lang');
    expect(buttons.length).toBe(3);
  });

  it('should mark active button based on currentLang', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.header_lang');
    expect(buttons[1].classList.contains('active')).toBe(true);
    expect(buttons[0].classList.contains('active')).toBe(false);
  });

  it('should add sticky class when isSticky is true', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    component.onScroll();
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.header');
    expect(header.classList.contains('sticky')).toBe(true);
  });
});
