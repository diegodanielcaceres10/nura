import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleService } from '../../i18n/locale.service';
import { HeaderComponent } from './header-component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let localeService: { getCurrentLocale: ReturnType<typeof vi.fn>; changeLocale: ReturnType<typeof vi.fn> };
  let scrollYSpy: ReturnType<typeof vi.spyOn> | undefined;

  const mockScrollY = (value: number): void => {
    scrollYSpy?.mockRestore();
    scrollYSpy = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(value);
  };

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

  afterEach(() => {
    scrollYSpy?.mockRestore();
    scrollYSpy = undefined;
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
    mockScrollY(100);
    component.onScroll();
    expect(component.isSticky()).toBe(true);
  });

  it('should react to real window scroll host event', () => {
    mockScrollY(120);
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(component.isSticky()).toBe(true);
  });

  it('should set isSticky false when scrollY <= 50', () => {
    mockScrollY(30);
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
    expect(buttons[2].classList.contains('active')).toBe(false);
  });

  it('should call changeLang with selected locale after clicking language button', () => {
    const changeLangSpy = vi.spyOn(component, 'changeLang');
    const buttons = fixture.nativeElement.querySelectorAll('.header_lang');

    buttons[0].click();
    fixture.detectChanges();

    expect(changeLangSpy).toHaveBeenCalledWith('es');
  });

  it('should call changeLang for each language button', () => {
    const changeLangSpy = vi.spyOn(component, 'changeLang');
    const buttons = fixture.nativeElement.querySelectorAll('.header_lang');

    (buttons[0] as HTMLButtonElement).click();
    (buttons[1] as HTMLButtonElement).click();
    (buttons[2] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(changeLangSpy).toHaveBeenNthCalledWith(1, 'es');
    expect(changeLangSpy).toHaveBeenNthCalledWith(2, 'en');
    expect(changeLangSpy).toHaveBeenNthCalledWith(3, 'pt');
  });

  it('should add sticky class when isSticky is true', () => {
    mockScrollY(100);
    component.onScroll();
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.header');
    expect(header.classList.contains('sticky')).toBe(true);
  });

  it('should not add sticky class when isSticky is false', () => {
    mockScrollY(0);
    component.onScroll();
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.header');
    expect(header.classList.contains('sticky')).toBe(false);
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

  it('should switch icon visibility classes based on menu state', () => {
    const icons = fixture.nativeElement.querySelectorAll('.header_button i');
    const bars = icons[0] as HTMLElement;
    const close = icons[1] as HTMLElement;

    expect(bars.classList.contains('hide')).toBe(false);
    expect(close.classList.contains('hide')).toBe(true);

    component.toogleMenu();
    fixture.detectChanges();

    expect(bars.classList.contains('hide')).toBe(true);
    expect(close.classList.contains('hide')).toBe(false);
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
