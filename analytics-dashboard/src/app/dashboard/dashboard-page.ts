import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

export type PeriodValue = '7d' | '28d' | '90d' | '12m';

interface PeriodOption {
  value: PeriodValue;
  label: string;
}

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly periods: readonly PeriodOption[] = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '28d', label: 'Últimos 28 días' },
    { value: '90d', label: 'Últimos 90 días' },
    { value: '12m', label: 'Últimos 12 meses' },
  ];

  protected readonly period = signal<PeriodValue>('28d');

  protected onPeriodChange(event: Event): void {
    this.period.set((event.target as HTMLSelectElement).value as PeriodValue);
  }
}
