import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ObserveOptions {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

@Injectable({ providedIn: 'root' })
export class ScrollAnimateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private observer: IntersectionObserver | null = null;
  private readonly callbacks = new Map<Element, (entry: IntersectionObserverEntry) => void>();
  private readonly onceFlags = new Map<Element, boolean>();

  constructor() {
    if (this.isBrowser && typeof IntersectionObserver !== 'undefined') {
      this.initObserver();
    }
  }

  get prefersReducedMotion(): boolean {
    if (!this.isBrowser || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private initObserver(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const callback = this.callbacks.get(entry.target);
              if (callback) {
                callback(entry);
              }
              const isOnce = this.onceFlags.get(entry.target) ?? true;
              if (isOnce) {
                this.unobserve(entry.target);
              }
            }
          }
        },
        {
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.08,
        }
      );
    });
  }

  observe(element: Element, callback: (entry: IntersectionObserverEntry) => void, options: ObserveOptions = {}): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined' || this.prefersReducedMotion) {
      callback({
        target: element,
        isIntersecting: true,
      } as unknown as IntersectionObserverEntry);
      return;
    }

    if (!this.observer) {
      this.initObserver();
    }

    this.callbacks.set(element, callback);
    this.onceFlags.set(element, options.once ?? true);

    this.ngZone.runOutsideAngular(() => {
      this.observer?.observe(element);
    });
  }

  unobserve(element: Element): void {
    this.callbacks.delete(element);
    this.onceFlags.delete(element);
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }
}
