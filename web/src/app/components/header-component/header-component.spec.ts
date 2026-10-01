import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header-component';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => {
      return typeof message === 'string' ? message : (message[0] ?? '');
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentLang signal', () => {
    expect(component.currentLang()).toBeDefined();
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

  it('should render header element', () => {
    const headerElement = fixture.nativeElement.querySelector('header');
    expect(headerElement).toBeTruthy();
  });

  it('should call localeService.changeLocale when changeLang is called', () => {
    const spy = vi.spyOn(component['localeService'], 'changeLocale');
    component.changeLang('es');
    expect(spy).toHaveBeenCalledWith('es');
  });

  it('should have isSticky signal from scrollService', () => {
    expect(component.isSticky).toBeDefined();
  });

  describe('template interactions', () => {
    beforeEach(() => {
      // RouterLink navigates on click; avoid real navigation in jsdom
      vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    });

    it('should toggle the menu when the menu button is clicked', () => {
      const button = fixture.nativeElement.querySelector('.header__button') as HTMLButtonElement;

      button.click();
      fixture.detectChanges();
      expect(component.isMenuOpen()).toBe(true);

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
      const spy = vi.spyOn(component['localeService'], 'changeLocale').mockImplementation(() => undefined);
      const buttons = fixture.nativeElement.querySelectorAll('.header__lang') as NodeListOf<HTMLButtonElement>;
      expect(buttons.length).toBe(3);

      buttons[1].click();
      expect(spy).toHaveBeenCalledWith('en');
    });
  });
});
