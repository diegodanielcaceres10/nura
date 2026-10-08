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

  it('should have langs array with 3 languages named in their own language', () => {
    expect(component.langs.map((lang) => lang.code)).toEqual(['es', 'en', 'pt']);
    expect(component.langs.map((lang) => lang.name)).toEqual(['Español', 'English', 'Português']);
  });

  it('should keep the language dropdown closed by default', () => {
    expect(component.isLangOpen()).toBe(false);
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
  });

  describe('language dropdown', () => {
    const native = () => fixture.nativeElement as HTMLElement;
    const trigger = () => native().querySelector('.header__langs-trigger') as HTMLButtonElement;
    const listbox = () => native().querySelector('.header__langs-menu') as HTMLElement | null;
    const options = () => Array.from(native().querySelectorAll('.header__lang')) as HTMLButtonElement[];
    const open = () => {
      trigger().click();
      fixture.detectChanges();
    };

    it('should render a collapsed trigger showing the current language', () => {
      expect(trigger().textContent).toContain('PT');
      expect(trigger().getAttribute('aria-haspopup')).toBe('listbox');
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(listbox()).toBeNull();
    });

    it('should open the menu with every language labeled by code and native name', () => {
      open();

      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(listbox()?.getAttribute('role')).toBe('listbox');
      expect(options().map((option) => option.querySelector('.header__lang-code')?.textContent?.trim())).toEqual(['ES', 'EN', 'PT']);
      expect(options().map((option) => option.querySelector('.header__lang-name')?.textContent?.trim())).toEqual(['Español', 'English', 'Português']);
    });

    it('should mark only the current language as selected', () => {
      open();

      expect(options().map((option) => option.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true']);
      expect(options()[2].classList.contains('active')).toBe(true);
    });

    it('should change language and close the menu when another option is chosen', () => {
      open();
      options()[1].click();
      fixture.detectChanges();

      expect(localeService.changeLocale).toHaveBeenCalledWith('en');
      expect(listbox()).toBeNull();
    });

    it('should only close the menu when the current language is chosen', () => {
      open();
      options()[2].click();
      fixture.detectChanges();

      expect(localeService.changeLocale).not.toHaveBeenCalled();
      expect(listbox()).toBeNull();
    });

    it('should toggle the menu when the trigger is clicked twice', () => {
      open();
      open();

      expect(listbox()).toBeNull();
    });

    it('should close on Escape and return focus to the trigger', () => {
      open();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(listbox()).toBeNull();
      expect(document.activeElement).toBe(trigger());
    });

    it('should ignore Escape while the menu is closed', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(component.isLangOpen()).toBe(false);
    });

    it('should close when clicking outside the dropdown', () => {
      open();
      document.body.click();
      fixture.detectChanges();

      expect(listbox()).toBeNull();
    });

    it('should stay open when clicking inside the dropdown container', () => {
      open();
      listbox()?.click();
      fixture.detectChanges();

      expect(listbox()).not.toBeNull();
    });

    it('should move focus between options with the arrow keys', () => {
      open();
      const items = options();
      items[0].focus();

      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).toBe(items[1]);

      items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).toBe(items[0]);

      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).toBe(items[2]);

      items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).toBe(items[0]);
    });

    it('should focus the current language when opened from the keyboard', () => {
      trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      fixture.detectChanges();

      expect(listbox()).not.toBeNull();
      expect(document.activeElement).toBe(options()[2]);
    });
  });
});
