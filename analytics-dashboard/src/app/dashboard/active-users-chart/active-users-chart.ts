import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ActiveUsersPoint {
  label: string;
  value: number;
}

const VIEW_WIDTH = 720;
const VIEW_HEIGHT = 260;

/**
 * Picks a "nice" round number of active users for the top of the y-axis
 * (and its four intermediate ticks), so the chart scales with real data
 * instead of assuming every period tops out around 40 active users.
 */
function computeYAxis(maxDataValue: number): { ticks: readonly number[]; max: number } {
  const rawStep = Math.max(maxDataValue, 1) / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;

  let niceStep: number;
  if (normalized <= 1) {
    niceStep = 1 * magnitude;
  } else if (normalized <= 2) {
    niceStep = 2 * magnitude;
  } else if (normalized <= 5) {
    niceStep = 5 * magnitude;
  } else {
    niceStep = 10 * magnitude;
  }

  const max = niceStep * 4;
  const ticks = [4, 3, 2, 1, 0].map((i) => Math.round(i * niceStep));
  return { ticks, max };
}

@Component({
  selector: 'app-active-users-chart',
  templateUrl: './active-users-chart.html',
  styleUrl: './active-users-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveUsersChart {
  readonly data = input.required<readonly ActiveUsersPoint[]>();
  readonly status = input<'loading' | 'ready' | 'error'>('ready');

  protected readonly viewBox = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;

  private readonly maxDataValue = computed(() =>
    Math.max(...this.data().map((point) => point.value), 0),
  );

  private readonly yAxis = computed(() => computeYAxis(this.maxDataValue()));

  protected readonly yTicks = computed(() => this.yAxis().ticks);
  protected readonly maxValue = computed(() => this.yAxis().max);

  private readonly coordinates = computed(() => {
    const points = this.data();
    const max = this.maxValue();
    const step = points.length > 1 ? VIEW_WIDTH / (points.length - 1) : 0;

    return points.map((point, index) => ({
      x: index * step,
      y: VIEW_HEIGHT - (point.value / max) * VIEW_HEIGHT,
      label: point.label,
      value: point.value,
    }));
  });

  protected readonly linePath = computed(() => this.toSmoothPath(this.coordinates()));

  protected readonly areaPath = computed(() => {
    const coords = this.coordinates();
    if (coords.length === 0) {
      return '';
    }
    const first = coords[0];
    const last = coords[coords.length - 1];
    return `${this.toSmoothPath(coords)} L ${last.x.toFixed(1)},${VIEW_HEIGHT} L ${first.x.toFixed(1)},${VIEW_HEIGHT} Z`;
  });

  protected readonly xLabels = computed(() => this.coordinates());

  private toSmoothPath(coords: readonly { x: number; y: number }[]): string {
    if (coords.length === 0) {
      return '';
    }
    if (coords.length === 1) {
      return `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
    }

    let path = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const current = coords[i];
      const next = coords[i + 1];
      const midX = (current.x + next.x) / 2;
      path += ` C ${midX.toFixed(1)},${current.y.toFixed(1)} ${midX.toFixed(1)},${next.y.toFixed(1)} ${next.x.toFixed(1)},${next.y.toFixed(1)}`;
    }
    return path;
  }
}
