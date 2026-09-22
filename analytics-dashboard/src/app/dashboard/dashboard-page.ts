import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MetricCardData, MetricCards } from './metric-cards/metric-cards';
import { ActiveUsersChart, ActiveUsersPoint } from './active-users-chart/active-users-chart';

export type PeriodValue = '7d' | '28d' | '90d' | '12m';

interface PeriodOption {
  value: PeriodValue;
  label: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [MetricCards, ActiveUsersChart],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly metrics: readonly MetricCardData[] = [
    {
      id: 'users',
      label: 'Usuarios activos',
      value: '198',
      deltaPercent: 12.5,
      icon: 'users',
      accent: 'purple',
      sparkline: [6, 8, 7, 11, 9, 13, 12, 16, 15, 19],
    },
    {
      id: 'sessions',
      label: 'Sesiones',
      value: '257',
      deltaPercent: 8.7,
      icon: 'sessions',
      accent: 'blue',
      sparkline: [10, 9, 13, 11, 15, 13, 17, 16, 20, 22],
    },
    {
      id: 'events',
      label: 'Eventos',
      value: '1.886',
      deltaPercent: 18.3,
      icon: 'events',
      accent: 'green',
      sparkline: [8, 11, 9, 14, 12, 17, 15, 21, 18, 25],
    },
    {
      id: 'pageviews',
      label: 'Visualizaciones de página',
      value: '779',
      deltaPercent: 14.2,
      icon: 'pageviews',
      accent: 'pink',
      sparkline: [9, 7, 12, 10, 14, 11, 16, 14, 19, 23],
    },
  ];

  protected readonly activeUsers: readonly ActiveUsersPoint[] = [
    { label: '1 abr', value: 12 },
    { label: '4 abr', value: 20 },
    { label: '7 abr', value: 14 },
    { label: '10 abr', value: 19 },
    { label: '13 abr', value: 15 },
    { label: '16 abr', value: 21 },
    { label: '19 abr', value: 16 },
    { label: '22 abr', value: 26 },
    { label: '25 abr', value: 22 },
    { label: '28 abr', value: 27 },
  ];

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
