import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';

export interface TopPageRow {
  path: string;
  views: number;
}

@Component({
  selector: 'app-top-pages',
  imports: [LoadingSpinner],
  templateUrl: './top-pages.html',
  styleUrl: './top-pages.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopPages {
  readonly pages = input.required<readonly TopPageRow[]>();
  readonly status = input<'loading' | 'ready' | 'error'>('ready');

  protected readonly maxViews = computed(() =>
    Math.max(...this.pages().map((page) => page.views), 1),
  );

  protected barWidth(views: number): number {
    return Math.max((views / this.maxViews()) * 100, 6);
  }
}
