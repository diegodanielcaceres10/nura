import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';

export interface TopEventRow {
  name: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-top-events',
  imports: [LoadingSpinner],
  templateUrl: './top-events.html',
  styleUrl: './top-events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopEvents {
  readonly events = input.required<readonly TopEventRow[]>();
  readonly status = input<'loading' | 'ready' | 'error'>('ready');
}
