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
    private readonly observedTargets = new Set<Element>();

    constructor(private readonly callback: ObserverCallback = noopCallback, options?: IntersectionObserverInit) {
      this.root = options?.root ?? null;
      this.rootMargin = options?.rootMargin ?? '0px';
      const threshold = options?.threshold ?? 0;
      this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
    }

    observe(target: Element): void {
      this.observedTargets.add(target);

      // Schedule a microtask so Angular can finish registering the viewport trigger before we emit.
      queueMicrotask(() => {
        if (!this.observedTargets.has(target)) {
          return;
        }

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
      });
    }

    unobserve(target: Element): void {
      this.observedTargets.delete(target);
    }

    disconnect(): void {
      this.observedTargets.clear();
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  globalScope.IntersectionObserver = ServerSafeIntersectionObserver;
}
