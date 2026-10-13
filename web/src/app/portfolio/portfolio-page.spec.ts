import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PortfolioPage } from './portfolio-page';
import { LocaleService } from '../services/locale/locale.service';
import { ScrollService } from '../services/scroll/scroll.service';

const SECTION_IDS = ['home', 'case-study', 'experiences', 'projects', 'recommendations', 'about', 'contact'];

describe('PortfolioPage', () => {
  let component: PortfolioPage;
  let fixture: ComponentFixture<PortfolioPage>;
  let element: HTMLElement;
  const isSticky = signal(false);
  const localeService = { getCurrentLocale: vi.fn(() => 'es') };

  // Child components are rendered for real (no overrides) so the page template is attributed in the coverage report
  async function createPage(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [PortfolioPage],
      providers: [provideRouter([]), { provide: LocaleService, useValue: localeService }, { provide: ScrollService, useValue: { isSticky } }],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioPage);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await createPage();
  });

  afterEach(() => {
    vi.clearAllMocks();
    isSticky.set(false);
    localeService.getCurrentLocale.mockReturnValue('es');
  });

  describe('setup', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should expose the sticky signal from ScrollService', () => {
      expect(component.isSticky).toBe(isSticky);
    });

    it('should read the current language from LocaleService', () => {
      expect(component.currentLang).toBe('es');
      expect(localeService.getCurrentLocale).toHaveBeenCalled();
    });
  });

  describe('structure', () => {
    it('should render the header and the footer', () => {
      expect(element.querySelector('app-header-component')).not.toBeNull();
      expect(element.querySelector('app-footer-component')).not.toBeNull();
    });

    it('should render every section inside main, in order, with the id used by the navigation', () => {
      const sections = Array.from(element.querySelectorAll('main > *'));

      expect(sections.map((section) => section.id)).toEqual(SECTION_IDS);
      expect(sections.map((section) => section.tagName.toLowerCase())).toEqual(SECTION_IDS.map((id) => `app-${id}-component`));
    });

    it('should keep the header before main and the footer after the back-to-top button', () => {
      const children = Array.from(element.children).map((child) => child.tagName.toLowerCase());

      expect(children).toEqual(['app-header-component', 'main', 'div', 'app-footer-component']);
    });
  });

  describe('back to top button', () => {
    const getContainer = () => element.querySelector('.scroll_to_top') as HTMLElement;
    const getLink = () => getContainer().querySelector('a') as HTMLAnchorElement;

    it('should be hidden and inert while the page is not scrolled', () => {
      expect(getContainer().classList.contains('show')).toBe(false);
      expect(getContainer().getAttribute('inert')).toBe('');
    });

    it('should be visible and interactive once the page is sticky', () => {
      isSticky.set(true);
      fixture.detectChanges();

      expect(getContainer().classList.contains('show')).toBe(true);
      expect(getContainer().hasAttribute('inert')).toBe(false);
    });

    it('should hide again when the page goes back to the top', () => {
      isSticky.set(true);
      fixture.detectChanges();
      isSticky.set(false);
      fixture.detectChanges();

      expect(getContainer().classList.contains('show')).toBe(false);
      expect(getContainer().getAttribute('inert')).toBe('');
    });

    it('should link to the home section of the current language', () => {
      expect(getLink().getAttribute('href')).toBe('/es#home');
    });

    it('should expose an accessible label', () => {
      expect(getLink().getAttribute('aria-label')).toBe('Back to top');
    });

    it('should build the link with the language returned by LocaleService', async () => {
      TestBed.resetTestingModule();
      localeService.getCurrentLocale.mockReturnValue('pt');

      await createPage();

      expect(getLink().getAttribute('href')).toBe('/pt#home');
    });
  });
});
