import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  readonly isSticky = signal(false);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    // The page can already be scrolled when the service is created (reload, anchor link).
    this.updateSticky();

    fromEvent(window, 'scroll')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateSticky());
  }

  private updateSticky(): void {
    this.isSticky.set(window.scrollY > 50);
  }
}
