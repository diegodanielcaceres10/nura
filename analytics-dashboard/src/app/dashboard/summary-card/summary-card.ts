import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCard {
  readonly summary = input.required<string>();
  readonly opportunityTitle = input.required<string>();
  readonly opportunityText = input.required<string>();
}
