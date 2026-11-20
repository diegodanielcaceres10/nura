import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollAnimateService } from './scroll-animate.service';

describe('ScrollAnimateService', () => {
  let service: ScrollAnimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollAnimateService],
    });
    service = TestBed.inject(ScrollAnimateService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should gracefully handle observe when IntersectionObserver is not defined', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ScrollAnimateService],
    });
    const noIoService = TestBed.inject(ScrollAnimateService);

    const el = document.createElement('div');
    let called = false;

    noIoService.observe(el, (entry) => {
      called = true;
      expect(entry.isIntersecting).toBe(true);
    });

    expect(called).toBe(true);
  });

  it('should immediately trigger callback when prefersReducedMotion is true', () => {
    vi.spyOn(service, 'prefersReducedMotion', 'get').mockReturnValue(true);

    const el = document.createElement('div');
    let called = false;

    service.observe(el, () => {
      called = true;
    });

    expect(called).toBe(true);
  });

  it('should register and trigger via IntersectionObserver when supported', () => {
    let observedElement: Element | null = null;
    let observerCallback!: (entries: IntersectionObserverEntry[]) => void;

    class MockIntersectionObserver {
      constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
        observerCallback = cb;
      }
      observe(target: Element) {
        observedElement = target;
      }
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.spyOn(service, 'prefersReducedMotion', 'get').mockReturnValue(false);

    // Re-instantiate to pickup mocked IntersectionObserver
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ScrollAnimateService],
    });
    const activeService = TestBed.inject(ScrollAnimateService);

    const el = document.createElement('div');
    let callbackTriggered = false;

    activeService.observe(el, () => {
      callbackTriggered = true;
    });

    expect(observedElement).toBe(el);

    // Simulate intersection
    observerCallback([
      {
        target: el,
        isIntersecting: true,
      } as unknown as IntersectionObserverEntry,
    ]);

    expect(callbackTriggered).toBe(true);

    activeService.unobserve(el);
  });

  it('should handle SSR platform gracefully', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ScrollAnimateService, { provide: PLATFORM_ID, useValue: 'server' }],
    });
    const ssrService = TestBed.inject(ScrollAnimateService);

    expect(ssrService.prefersReducedMotion).toBe(false);

    const el = document.createElement('div');
    let called = false;
    ssrService.observe(el, () => {
      called = true;
    });

    expect(called).toBe(true);
  });
});
