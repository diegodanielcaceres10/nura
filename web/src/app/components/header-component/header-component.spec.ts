import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header-component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { LocaleService } from '../../services/locale/locale.service';
import { ScrollService } from '../../services/scroll/scroll.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const isSticky = signal(false);
  const localeService = {
    getCurrentLocale: vi.fn(() => 'pt'),
    changeLocale: vi.fn(),
  };

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => {
      return typeof message === 'string' ? message : (message[0] ?? '');
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: LocaleService, useValue: localeService },
        { provide: ScrollService, useValue: { isSticky } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    isSticky.set(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentLang signal', () => {
    expect(component.currentLang()).toBe('pt');
    expect(localeService.getCurrentLocale).toHaveBeenCalledOnce();
  });

  it('should initialize isMenuOpen signal as false', () => {
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should have langs array with 3 languages', () => {
    expect(component.langs.length).toBe(3);
    expect(component.langs[0].code).toBe('es');
    expect(component.langs[1].code).toBe('en');
    expect(component.langs[2].code).toBe('pt');
  });

  it('should toggle menu when toogleMenu is called', () => {
    const initialState = component.isMenuOpen();
    component.toogleMenu();
    expect(component.isMenuOpen()).toBe(!initialState);
    component.toogleMenu();
    expect(component.isMenuOpen()).toBe(initialState);
  });

  it('should render a labeled primary navigation and branded logo', () => {
    const native = fixture.nativeElement as HTMLElement;
    const navigation = native.querySelector<HTMLElement>('#primary-navigation');
    const logo = native.querySelector<HTMLImageElement>('.header__logo img');

    expect(native.querySelector('header')).not.toBeNull();
    expect(navigation?.getAttribute('aria-label')).toBe('Primary navigation');
    expect(logo?.getAttribute('alt')).toBe('Nura Logo');
    expect(native.querySelectorAll('.header__button i[aria-hidden="true"]')).toHaveLength(2);
  });

  it('should call localeService.changeLocale when changeLang is called', () => {
    component.changeLang('es');
    expect(localeService.changeLocale).toHaveBeenCalledWith('es');
  });

  it('should apply the sticky header class when the scroll service is sticky', () => {
    const header = fixture.nativeElement.querySelector('header') as HTMLElement;

    expect(header.classList.contains('header-sticky')).toBe(false);
    isSticky.set(true);
    fixture.detectChanges();

    expect(header.classList.contains('header-sticky')).toBe(true);
  });

  describe('template interactions', () => {
    beforeEach(() => {
      // RouterLink navigates on click; avoid real navigation in jsdom
      vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    });

    it('should toggle the menu when the menu button is clicked', () => {
      const button = fixture.nativeElement.querySelector('.header__button') as HTMLButtonElement;

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-controls')).toBe('primary-navigation');
      button.click();
      fixture.detectChanges();
      expect(component.isMenuOpen()).toBe(true);
      expect(button.getAttribute('aria-expanded')).toBe('true');

      button.click();
      fixture.detectChanges();
      expect(component.isMenuOpen()).toBe(false);
    });

    it('should toggle the menu when the logo link is clicked', () => {
      const logo = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

      logo.click();
      expect(component.isMenuOpen()).toBe(true);
    });

    it('should toggle the menu when a navigation link is clicked', () => {
      const links = fixture.nativeElement.querySelectorAll('.header__container a') as NodeListOf<HTMLAnchorElement>;
      expect(links.length).toBe(5);

      links.forEach((link) => {
        const before = component.isMenuOpen();
        link.click();
        expect(component.isMenuOpen()).toBe(!before);
      });
    });

    it('should change language when a language button is clicked', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.header__lang') as NodeListOf<HTMLButtonElement>;
      expect(buttons.length).toBe(3);
      expect(buttons[2].getAttribute('aria-pressed')).toBe('true');

      buttons[1].click();
      expect(localeService.changeLocale).toHaveBeenCalledWith('en');
    });
  });
});
