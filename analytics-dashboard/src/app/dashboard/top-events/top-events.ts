import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface TopEventRow {
  name: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-top-events',
  templateUrl: './top-events.html',
  styleUrl: './top-events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopEvents {
  readonly events = input.required<readonly TopEventRow[]>();
}
