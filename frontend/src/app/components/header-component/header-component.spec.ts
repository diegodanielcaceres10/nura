import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header-component';
import { LocaleService } from '../../i18n/locale.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let localeService: { getCurrentLocale: ReturnType<typeof vi.fn>; changeLocale: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    localeService = {
      getCurrentLocale: vi.fn(() => 'en'),
      changeLocale: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: LocaleService, useValue: localeService }],
    }).compileComponents();

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

  it('should start with menu closed', () => {
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should read current locale on init', () => {
    expect(localeService.getCurrentLocale).toHaveBeenCalled();
    expect(component.currentLang()).toBe('en');
  });

  it('should have 3 languages available', () => {
    expect(component.langs).toHaveLength(3);
    expect(component.langs.map((l) => l.code)).toEqual(['es', 'en', 'pt']);
  });

  it('should delegate locale change to LocaleService', () => {
    component.changeLang('pt');
    expect(localeService.changeLocale).toHaveBeenCalledWith('pt');
  });

  it('should toggle menu state when toogleMenu is called twice', () => {
    component.toogleMenu();
    expect(component.isMenuOpen()).toBe(true);

    component.toogleMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should set isSticky true when scrollY > 50', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    component.onScroll();
    expect(component.isSticky()).toBe(true);
  });

  it('should react to real window scroll host event', () => {
    Object.defineProperty(window, 'scrollY', { value: 120, writable: true });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

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

  it('should call changeLang with selected locale after clicking language button', () => {
    const changeLangSpy = vi.spyOn(component, 'changeLang');
    const buttons = fixture.nativeElement.querySelectorAll('.header_lang');

    buttons[0].click();
    fixture.detectChanges();

    expect(changeLangSpy).toHaveBeenCalledWith('es');
  });

  it('should add sticky class when isSticky is true', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    component.onScroll();
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.header');
    expect(header.classList.contains('sticky')).toBe(true);
  });

  it('should render menu open class when menu is toggled from UI button', () => {
    const button = fixture.nativeElement.querySelector('.header_button');
    const container = fixture.nativeElement.querySelector('.header_container');

    expect(container.classList.contains('header_container-open')).toBe(false);

    button.click();
    fixture.detectChanges();

    expect(component.isMenuOpen()).toBe(true);
    expect(container.classList.contains('header_container-open')).toBe(true);
  });

  it('should render 4 navigation anchors with section hashes', () => {
    const links = fixture.nativeElement.querySelectorAll('.header_nav a') as NodeListOf<HTMLAnchorElement>;
    const hrefs = Array.from(links).map((link) => link.getAttribute('href'));

    expect(links.length).toBe(4);
    expect(hrefs).toEqual(['#about', '#experiences', '#projects', '#contact']);
  });

  it('should trigger toggle handler when each nav link is clicked', () => {
    const links = fixture.nativeElement.querySelectorAll('.header_nav a') as NodeListOf<HTMLAnchorElement>;
    const toggleSpy = vi.spyOn(component, 'toogleMenu');

    Array.from(links).forEach((link) => {
      link.click();
    });

    expect(toggleSpy).toHaveBeenCalledTimes(4);
  });
});
