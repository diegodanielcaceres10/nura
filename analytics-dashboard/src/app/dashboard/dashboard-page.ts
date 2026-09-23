import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../auth/google-auth.service';
import { GoogleAnalyticsService } from '../api/google-analytics.service';
import { MetricCardData, MetricCards } from './metric-cards/metric-cards';
import { ActiveUsersChart, ActiveUsersPoint } from './active-users-chart/active-users-chart';
import { TrafficChannel, TrafficDonut } from './traffic-donut/traffic-donut';
import { TopPageRow, TopPages } from './top-pages/top-pages';
import { TopEventRow, TopEvents } from './top-events/top-events';
import { SummaryCard } from './summary-card/summary-card';
import { getDateRangesForPeriod, PeriodValue } from './period-ranges';

export type { PeriodValue };

interface PeriodOption {
  value: PeriodValue;
  label: string;
}

const ACTIVE_USERS_CARD_ID = 'users';

// Shown immediately while the real value loads, and as the base to restore
// the card's icon/accent/sparkline once a fetch resolves.
const INITIAL_ACTIVE_USERS_CARD: MetricCardData = {
  id: ACTIVE_USERS_CARD_ID,
  label: 'Usuarios activos',
  value: '198',
  deltaPercent: 12.5,
  icon: 'users',
  accent: 'purple',
  sparkline: [6, 8, 7, 11, 9, 13, 12, 16, 15, 19],
};

@Component({
  selector: 'app-dashboard-page',
  imports: [MetricCards, ActiveUsersChart, TrafficDonut, TopPages, TopEvents, SummaryCard],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly authService = inject(GoogleAuthService);
  private readonly analyticsService = inject(GoogleAnalyticsService);
  private readonly router = inject(Router);

  // "Usuarios activos" is the only card wired to the real GA4 API so far;
  // the other three keep their example data until they're wired up too.
  private readonly activeUsersCard = signal<MetricCardData>({
    ...INITIAL_ACTIVE_USERS_CARD,
    status: 'loading',
  });

  private readonly staticMetrics: readonly MetricCardData[] = [
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

  protected readonly metrics = computed<readonly MetricCardData[]>(() => [
    this.activeUsersCard(),
    ...this.staticMetrics,
  ]);

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

  protected readonly trafficChannels: readonly TrafficChannel[] = [
    { id: 'organic', label: 'Organic Search', percent: 62.3, color: 'purple' },
    { id: 'direct', label: 'Direct', percent: 18.7, color: 'blue' },
    { id: 'referral', label: 'Referral', percent: 10.5, color: 'green' },
    { id: 'social', label: 'Social', percent: 5.4, color: 'pink' },
    { id: 'other', label: 'Otros', percent: 2.1, color: 'orange' },
  ];


  protected readonly topPages: readonly TopPageRow[] = [
    { path: '/', views: 312 },
    { path: '/proyectos', views: 198 },
    { path: '/sobre-mi', views: 134 },
    { path: '/contacto', views: 89 },
    { path: '/blog', views: 46 },
  ];

  protected readonly topEvents: readonly TopEventRow[] = [
    { name: 'page_view', count: 779, percent: 41.3 },
    { name: 'user_engagement', count: 612, percent: 32.5 },
    { name: 'session_start', count: 257, percent: 13.6 },
    { name: 'first_visit', count: 198, percent: 10.5 },
    { name: 'click', count: 40, percent: 2.1 },
  ];

  protected readonly summaryText =
    'Tu sitio web está teniendo un buen rendimiento. El tráfico orgánico sigue siendo tu principal fuente de visitas, con un 62.3% del total.';

  protected readonly opportunityText =
    'Considera crear más contenido en el blog para aumentar las visualizaciones de página.';

  protected readonly periods: readonly PeriodOption[] = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '28d', label: 'Últimos 28 días' },
    { value: '90d', label: 'Últimos 90 días' },
    { value: '12m', label: 'Últimos 12 meses' },
  ];

  protected readonly period = signal<PeriodValue>('28d');

  constructor() {
    // Re-fetches "Usuarios activos" whenever the selected period changes,
    // including the first run right after construction.
    effect(() => {
      const period = this.period();
      untracked(() => void this.refreshActiveUsers(period));
    });
  }

  protected onPeriodChange(event: Event): void {
    this.period.set((event.target as HTMLSelectElement).value as PeriodValue);
  }

  private async refreshActiveUsers(period: PeriodValue): Promise<void> {
    const accessToken = this.authService.accessToken();
    if (!accessToken) {
      return;
    }

    this.activeUsersCard.update((card) => ({ ...card, status: 'loading' }));

    try {
      const summary = await this.analyticsService.getActiveUsers(
        accessToken,
        getDateRangesForPeriod(period),
      );
      this.activeUsersCard.set({
        ...INITIAL_ACTIVE_USERS_CARD,
        value: summary.activeUsers.toLocaleString('es-AR'),
        deltaPercent: summary.deltaPercent,
        status: 'ready',
      });
    } catch (error) {
      console.error('No se pudieron cargar los usuarios activos', error);
      this.activeUsersCard.update((card) => ({ ...card, status: 'error' }));
    }
  }

  protected onSignOut(): void {
    this.authService.signOut();
    void this.router.navigateByUrl('/login');
  }
}
