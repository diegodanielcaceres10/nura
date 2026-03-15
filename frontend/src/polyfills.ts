import '@angular/localize/init';

// Provide a lightweight IntersectionObserver fallback for environments that do not
// expose the browser API (e.g. Vitest/jsdom or server-side rendering builds).
type IntersectionObserverGlobals = typeof globalThis & {
  IntersectionObserver?: typeof IntersectionObserver;
};

const globalScope = globalThis as IntersectionObserverGlobals;

if (typeof globalThis !== 'undefined' && globalScope.IntersectionObserver === undefined) {
  type ObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;
  const noopCallback: ObserverCallback = () => undefined;

  class ServerSafeIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null;
    readonly rootMargin: string;
    readonly thresholds: readonly number[];

    constructor(private readonly callback: ObserverCallback = noopCallback, options?: IntersectionObserverInit) {
      this.root = options?.root ?? null;
      this.rootMargin = options?.rootMargin ?? '0px';
      const threshold = options?.threshold ?? 0;
      this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
    }

    observe(target: Element): void {
      // Immediately report the target as visible so deferred views continue rendering during tests/SSR.
      this.callback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 1,
            target,
            time: Date.now(),
          } as IntersectionObserverEntry,
        ],
        this,
      );
    }

    unobserve(target: Element): void {
      void target;
      // No-op – API surface only.
    }

    disconnect(): void {
      // No-op – nothing to clean up in the fallback.
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  globalScope.IntersectionObserver = ServerSafeIntersectionObserver;
}
