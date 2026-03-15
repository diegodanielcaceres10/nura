import '@angular/localize/init';

// Provide a lightweight IntersectionObserver fallback for environments that do not
// expose the browser API (e.g. Vitest/jsdom or server-side rendering builds).
if (typeof globalThis !== 'undefined' && typeof (globalThis as any).IntersectionObserver === 'undefined') {
  type ObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

  class ServerSafeIntersectionObserver {
    constructor(private readonly callback: ObserverCallback = () => {}, _options?: IntersectionObserverInit) {}

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
        this as unknown as IntersectionObserver,
      );
    }

    unobserve(): void {
      // No-op – we only need to satisfy the API surface.
    }

    disconnect(): void {
      // No-op – nothing to clean up in the fallback.
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  (globalThis as any).IntersectionObserver = ServerSafeIntersectionObserver;
  (globalThis as any).IntersectionObserverEntry = class {};
}
