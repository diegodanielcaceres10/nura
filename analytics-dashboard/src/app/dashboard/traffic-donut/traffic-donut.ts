import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface TrafficChannel {
  id: string;
  label: string;
  percent: number;
  color: 'purple' | 'blue' | 'green' | 'pink' | 'orange';
}

interface TrafficArc extends TrafficChannel {
  dashArray: string;
  dashOffset: number;
}

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Visual order of the arcs around the ring, clockwise from 12 o'clock.
// This differs from the legend order below, which is sorted by percent.
const ARC_ORDER: readonly string[] = ['organic', 'direct', 'referral', 'other', 'social'];

@Component({
  selector: 'app-traffic-donut',
  templateUrl: './traffic-donut.html',
  styleUrl: './traffic-donut.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficDonut {
  readonly channels = input.required<readonly TrafficChannel[]>();
  readonly totalLabel = input.required<string>();
  readonly totalValue = input.required<string>();

  protected readonly radius = RADIUS;
  protected readonly circumference = CIRCUMFERENCE;

  protected readonly legend = computed(() =>
    [...this.channels()].sort((a, b) => b.percent - a.percent),
  );

  protected readonly arcs = computed<readonly TrafficArc[]>(() => {
    const byId = new Map(this.channels().map((channel) => [channel.id, channel]));
    let offset = 0;

    return ARC_ORDER.filter((id) => byId.has(id)).map((id) => {
      const channel = byId.get(id)!;
      const length = (channel.percent / 100) * this.circumference;
      const arc: TrafficArc = {
        ...channel,
        dashArray: `${length.toFixed(2)} ${this.circumference.toFixed(2)}`,
        dashOffset: -offset,
      };
      offset += length;
      return arc;
    });
  });
}
