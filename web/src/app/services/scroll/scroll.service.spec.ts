import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScrollService } from './scroll.service';

/**
 * ScrollService spec.
 *
 * In short: it guarantees that the header only becomes sticky once the user has scrolled
 * past 50px, that the service stops listening when it is destroyed, and that it never
 * listens on the server.
 *
 * Guarantees
 * - isSticky starts as false at the top of the page and reflects the current scroll position
 *   as soon as the service is created, so a reload mid-page or an anchor link is sticky
 *   without waiting for the next scroll event.
 * - isSticky becomes true only when scrollY is strictly greater than 50 and goes back to
 *   false at 50 or below, including negative values from iOS rubber-band overscroll.
 *   Every case starts from the opposite state, so each one proves a real transition.
 * - After the service is destroyed, later scroll events no longer change isSticky.
 * - On the server platform the scroll event and the scroll position are ignored.
 *
 * Not covered
 * - Real scrolling in a browser: scroll events are dispatched by hand and scrollY is stubbed.
 * - The sticky styling of the header and the portfolio page (their specs mock this service).
 */

// Fake scroll to a given position; unstubAllGlobals in afterEach restores the real scrollY.
const scrollTo = (y: number): void => {
  vi.stubGlobal('scrollY', y);
  window.dispatchEvent(new Event('scroll'));
};

const createService = (platformId?: string): ScrollService => {
  TestBed.configureTestingModule({
    providers: platformId ? [{ provide: PLATFORM_ID, useValue: platformId }] : [],
  });
  return TestBed.inject(ScrollService);
};

describe('ScrollService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('in the browser', () => {
    it('starts as not sticky', () => {
      expect(createService().isSticky()).toBe(false);
    });

    it.each<[number, boolean]>([
      [100, true],
      [51, true],
      [50, false],
    ])('created with scrollY %s starts with isSticky %s', (y, expected) => {
      vi.stubGlobal('scrollY', y);

      expect(createService().isSticky()).toBe(expected);
    });

    it.each<[number, boolean]>([
      [0, false],
      [50, false],
      [50.5, true],
      [51, true],
      [500, true],
      [-100, false],
    ])('scrollY %s sets isSticky to %s', (y, expected) => {
      const service = createService();
      // Start from the opposite state so the event has to change the value.
      scrollTo(expected ? 0 : 500);

      scrollTo(y);

      expect(service.isSticky()).toBe(expected);
    });

    it('stops reacting to scroll events once the service is destroyed', () => {
      const service = createService();

      TestBed.resetTestingModule();
      scrollTo(100);

      expect(service.isSticky()).toBe(false);
    });
  });

  describe('on the server platform', () => {
    it('does not read the scroll position when it is created', () => {
      vi.stubGlobal('scrollY', 100);

      expect(createService('server').isSticky()).toBe(false);
    });

    it('ignores scroll events', () => {
      const service = createService('server');

      scrollTo(100);

      expect(service.isSticky()).toBe(false);
    });
  });
});
