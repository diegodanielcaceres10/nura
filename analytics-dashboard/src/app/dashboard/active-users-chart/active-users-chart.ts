import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ActiveUsersPoint {
  label: string;
  value: number;
}

const VIEW_WIDTH = 720;
const VIEW_HEIGHT = 260;
const Y_TICKS = [40, 30, 20, 10, 0] as const;

@Component({
  selector: 'app-active-users-chart',
  templateUrl: './active-users-chart.html',
  styleUrl: './active-users-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveUsersChart {
  readonly data = input.required<readonly ActiveUsersPoint[]>();

  protected readonly viewBox = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;
  protected readonly yTicks = Y_TICKS;
  protected readonly maxValue = Y_TICKS[0];

  private readonly coordinates = computed(() => {
    const points = this.data();
    const step = points.length > 1 ? VIEW_WIDTH / (points.length - 1) : 0;

    return points.map((point, index) => ({
      x: index * step,
      y: VIEW_HEIGHT - (point.value / this.maxValue) * VIEW_HEIGHT,
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
