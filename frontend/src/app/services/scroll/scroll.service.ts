// src/app/shared/scroll.service.ts
import { Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  readonly isSticky = signal(false);

  constructor() {
    fromEvent(window, 'scroll')
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.isSticky.set(window.scrollY > 50);
      });
  }
}
