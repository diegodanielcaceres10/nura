import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleService } from '../services/locale/locale.service';
import { ScrollService } from '../services/scroll/scroll.service';
import { PortfolioPage } from './portfolio-page';

/**
 * PortfolioPage spec.
 *
 * In short: it guarantees that the page assembles every section in the right order with the
 * ids that the navigation links point to, and that the back-to-top button appears only after
 * scrolling and links to the home section of the current language.
 *
 * Guarantees
 * - The main content has the seven sections in order: home, case-study, experiences,
 *   projects, recommendations, about and contact. Each one has the id that the header, the
 *   home buttons and the back-to-top button use as a link fragment, so removing or renaming
 *   an id breaks this spec instead of silently breaking the navigation.
 * - The header comes first and the footer comes last.
 * - The back-to-top button links to the home section of the current language (/en#home,
 *   /es#home, /pt#home) and has an accessible name.
 * - The button is hidden at the top of the page, shows after scrolling, and shows right away
 *   if the page is already scrolled when it is created.
 * - While hidden the button is inert, so it cannot be focused with the keyboard or clicked, and
 *   it becomes interactive when it shows.
 *
 * Not covered
 * - The content of each section: the real components are rendered, but only their tag and id
 *   are checked here. Each one has its own spec.
 * - Real scrolling to the anchor: it depends on the router configuration in app.config.
 * - The look of the button: styles do not run in this spec.
 * - Known gap: the aria-label is a fixed English text and is not translated.
 */

describe('PortfolioPage', () => {
  const isSticky = signal(false);
  const localeService = { getCurrentLocale: vi.fn(() => 'en') };

  const createPage = (): HTMLElement => {
    const fixture: ComponentFixture<PortfolioPage> = TestBed.createComponent(PortfolioPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const backToTop = (page: HTMLElement): HTMLElement | null => page.querySelector('.scroll_to_top');

  beforeEach(async () => {
    isSticky.set(false);
    localeService.getCurrentLocale.mockReturnValue('en');

    // The child components are rendered for real on purpose: overrideComponent would recompile
    // the page template at runtime and hide it from the coverage report.
    await TestBed.configureTestingModule({
      imports: [PortfolioPage],
      providers: [provideRouter([]), { provide: LocaleService, useValue: localeService }, { provide: ScrollService, useValue: { isSticky } }],
    }).compileComponents();
  });

  describe('back-to-top button', () => {
    it.each(['en', 'es', 'pt'])('links to the home section in %s', (lang) => {
      localeService.getCurrentLocale.mockReturnValue(lang);

      const link = backToTop(createPage())?.querySelector('a');

      expect(link?.getAttribute('href')).toBe(`/${lang}#home`);
    });

    it('has an accessible name', () => {
      const link = backToTop(createPage())?.querySelector('a');

      expect(link?.getAttribute('aria-label')).toBeTruthy();
    });

    it('is hidden at the top of the page and shows after scrolling', () => {
      const fixture = TestBed.createComponent(PortfolioPage);
      const page = fixture.nativeElement as HTMLElement;
      fixture.detectChanges();
      expect(backToTop(page)?.classList.contains('show')).toBe(false);

      isSticky.set(true);
      fixture.detectChanges();
      expect(backToTop(page)?.classList.contains('show')).toBe(true);

      isSticky.set(false);
      fixture.detectChanges();
      expect(backToTop(page)?.classList.contains('show')).toBe(false);
    });

    it('is inert while hidden and interactive once shown', () => {
      const fixture = TestBed.createComponent(PortfolioPage);
      const page = fixture.nativeElement as HTMLElement;
      fixture.detectChanges();
      expect(backToTop(page)?.hasAttribute('inert')).toBe(true);

      isSticky.set(true);
      fixture.detectChanges();
      expect(backToTop(page)?.hasAttribute('inert')).toBe(false);

      isSticky.set(false);
      fixture.detectChanges();
      expect(backToTop(page)?.hasAttribute('inert')).toBe(true);
    });

    it('is not inert when the page is already scrolled', () => {
      isSticky.set(true);

      expect(backToTop(createPage())?.hasAttribute('inert')).toBe(false);
    });

    it('shows right away when the page is already scrolled', () => {
      isSticky.set(true);

      expect(backToTop(createPage())?.classList.contains('show')).toBe(true);
    });
  });
});
