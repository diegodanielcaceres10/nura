import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: '<span class="spinner" role="status" aria-label="Cargando"></span>',
  styles: `
    :host {
      display: inline-flex;
    }

    .spinner {
      width: var(--spinner-size, 28px);
      height: var(--spinner-size, 28px);
      border: 3px solid rgba(255, 255, 255, 0.12);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 2.4s;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinner {}
