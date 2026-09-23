import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface MetricCardData {
  id: string;
  label: string;
  value: string;
  /** null while loading, or when there's no previous-period data to compare against. */
  deltaPercent: number | null;
  icon: 'users' | 'sessions' | 'events' | 'pageviews';
  accent: 'purple' | 'blue' | 'green' | 'pink';
  sparkline: readonly number[];
  /** Defaults to 'ready' when omitted — only cards backed by a live fetch need to set this. */
  status?: 'loading' | 'ready' | 'error';
}

@Component({
  selector: 'app-metric-cards',
  templateUrl: './metric-cards.html',
  styleUrl: './metric-cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCards {
  readonly metrics = input.required<readonly MetricCardData[]>();

  protected sparklinePoints(values: readonly number[]): string {
    const width = 96;
    const height = 40;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const step = width / (values.length - 1);

    return values
      .map((value, index) => {
        const x = index * step;
        const y = height - ((value - min) / range) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  protected sparklineArea(values: readonly number[]): string {
    const points = this.sparklinePoints(values);
    const width = 96;
    const height = 40;
    return `0,${height} ${points} ${width},${height}`;
  }
}
