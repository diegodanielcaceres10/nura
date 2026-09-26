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
import { TrafficChannelBreakdown } from '../api/google-analytics.service';
import { TopPageRow, TopPages } from './top-pages/top-pages';
import { TopEventRow, TopEvents } from './top-events/top-events';
import { SummaryCard } from './summary-card/summary-card';
import { getDateRangesForPeriod, PeriodValue } from './period-ranges';

export type { PeriodValue };

interface PeriodOption {
  value: PeriodValue;
  label: string;
}

// Shown immediately while the real value loads, and as the base to restore
// the card's icon/accent/sparkline once a fetch resolves.
const INITIAL_ACTIVE_USERS_CARD: MetricCardData = {
  id: 'users',
  label: 'Usuarios activos',
  value: '198',
  deltaPercent: 12.5,
  icon: 'users',
  accent: 'purple',
  sparkline: [6, 8, 7, 11, 9, 13, 12, 16, 15, 19],
};

const INITIAL_SESSIONS_CARD: MetricCardData = {
  id: 'sessions',
  label: 'Sesiones',
  value: '257',
  deltaPercent: 8.7,
  icon: 'sessions',
  accent: 'blue',
  sparkline: [10, 9, 13, 11, 15, 13, 17, 16, 20, 22],
};

const INITIAL_EVENTS_CARD: MetricCardData = {
  id: 'events',
  label: 'Eventos',
  value: '1.886',
  deltaPercent: 18.3,
  icon: 'events',
  accent: 'green',
  sparkline: [8, 11, 9, 14, 12, 17, 15, 21, 18, 25],
};

const INITIAL_PAGE_VIEWS_CARD: MetricCardData = {
  id: 'pageviews',
  label: 'Visualizaciones de página',
  value: '779',
  deltaPercent: 14.2,
  icon: 'pageviews',
  accent: 'pink',
  sparkline: [9, 7, 12, 10, 14, 11, 16, 14, 19, 23],
};

// Shown immediately while the real daily series loads.
const INITIAL_ACTIVE_USERS_SERIES: readonly ActiveUsersPoint[] = [
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

// Shown immediately while the real channel breakdown loads.
const INITIAL_TRAFFIC_CHANNELS: readonly TrafficChannelBreakdown[] = [
  { id: 'organic', label: 'Organic Search', percent: 62.3, color: 'purple' },
  { id: 'direct', label: 'Direct', percent: 18.7, color: 'blue' },
  { id: 'referral', label: 'Referral', percent: 10.5, color: 'green' },
  { id: 'social', label: 'Social', percent: 5.4, color: 'pink' },
  { id: 'other', label: 'Otros', percent: 2.1, color: 'orange' },
];

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

  // Las 4 tarjetas de métricas están conectadas a la API real de GA4.
  private readonly activeUsersCard = signal<MetricCardData>({
    ...INITIAL_ACTIVE_USERS_CARD,
    status: 'loading',
  });

  private readonly sessionsCard = signal<MetricCardData>({
    ...INITIAL_SESSIONS_CARD,
    status: 'loading',
  });

  private readonly eventsCard = signal<MetricCardData>({
    ...INITIAL_EVENTS_CARD,
    status: 'loading',
  });

  private readonly pageViewsCard = signal<MetricCardData>({
    ...INITIAL_PAGE_VIEWS_CARD,
    status: 'loading',
  });

  protected readonly metrics = computed<readonly MetricCardData[]>(() => [
    this.activeUsersCard(),
    this.sessionsCard(),
    this.eventsCard(),
    this.pageViewsCard(),
  ]);

  private readonly activeUsersSeries = signal<{
    points: readonly ActiveUsersPoint[];
    status: 'loading' | 'ready' | 'error';
  }>({ points: INITIAL_ACTIVE_USERS_SERIES, status: 'loading' });

  protected readonly activeUsersPoints = computed(() => this.activeUsersSeries().points);
  protected readonly activeUsersSeriesStatus = computed(() => this.activeUsersSeries().status);

  private readonly trafficChannelsState = signal<{
    channels: readonly TrafficChannelBreakdown[];
    totalSessions: number;
    status: 'loading' | 'ready' | 'error';
  }>({ channels: INITIAL_TRAFFIC_CHANNELS, totalSessions: 257, status: 'loading' });

  protected readonly trafficChannels = computed<readonly TrafficChannel[]>(
    () => this.trafficChannelsState().channels,
  );
  protected readonly trafficTotalSessions = computed(() =>
    this.trafficChannelsState().totalSessions.toLocaleString('es-AR'),
  );
  protected readonly trafficChannelsStatus = computed(() => this.trafficChannelsState().status);


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
    // Re-fetches "Usuarios activos", "Sesiones" y "Eventos" whenever the
    // selected period changes, including the first run right after
    // construction.
    effect(() => {
      const period = this.period();
      untracked(() => {
        void this.refreshActiveUsers(period);
        void this.refreshSessions(period);
        void this.refreshEvents(period);
        void this.refreshPageViews(period);
        void this.refreshActiveUsersSeries(period);
        void this.refreshTrafficChannels(period);
      });
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

  private async refreshSessions(period: PeriodValue): Promise<void> {
    const accessToken = this.authService.accessToken();
    if (!accessToken) {
      return;
    }

    this.sessionsCard.update((card) => ({ ...card, status: 'loading' }));

    try {
      const summary = await this.analyticsService.getSessions(
        accessToken,
        getDateRangesForPeriod(period),
      );
      this.sessionsCard.set({
        ...INITIAL_SESSIONS_CARD,
        value: summary.sessions.toLocaleString('es-AR'),
        deltaPercent: summary.deltaPercent,
        status: 'ready',
      });
    } catch (error) {
      console.error('No se pudieron cargar las sesiones', error);
      this.sessionsCard.update((card) => ({ ...card, status: 'error' }));
    }
  }

  private async refreshEvents(period: PeriodValue): Promise<void> {
    const accessToken = this.authService.accessToken();
    if (!accessToken) {
      return;
    }

    this.eventsCard.update((card) => ({ ...card, status: 'loading' }));

    try {
      const summary = await this.analyticsService.getEventCount(
        accessToken,
        getDateRangesForPeriod(period),
      );
      this.eventsCard.set({
        ...INITIAL_EVENTS_CARD,
        value: summary.eventCount.toLocaleString('es-AR'),
        deltaPercent: summary.deltaPercent,
        status: 'ready',
      });
    } catch (error) {
      console.error('No se pudieron cargar los eventos', error);
      this.eventsCard.update((card) => ({ ...card, status: 'error' }));
    }
  }

  private async refreshPageViews(period: PeriodValue): Promise<void> {
    const accessToken = this.authService.accessToken();
    if (!accessToken) {
      return;
    }

    this.pageViewsCard.update((card) => ({ ...card, status: 'loading' }));

    try {
      const summary = await this.analyticsService.getPageViews(
        accessToken,
        getDateRangesForPeriod(period),
      );
      this.pageViewsCard.set({
        ...INITIAL_PAGE_VIEWS_CARD,
        value: summary.pageViews.toLocaleString('es-AR'),
        deltaPercent: summary.deltaPercent,
        status: 'ready',
      });
    } catch (error) {
      console.error('No se pudieron cargar las visualizaciones de página', error);
      this.pageViewsCard.update((card) => ({ ...card, status: 'error' }));
    }
  }

  private async refreshActiveUsersSeries(period: PeriodValue): Promise<void> {
    const accessToken = this.authService.accessToken();
    if (!accessToken) {
      return;
    }

    this.activeUsersSeries.update((state) => ({ ...state, status: 'loading' }));

    try {
      const range = getDateRangesForPeriod(period).current;
      const points = await this.analyticsService.getActiveUsersByDay(accessToken, range);
      this.activeUsersSeries.set({
        points: points.length > 0 ? points : INITIAL_ACTIVE_USERS_SERIES,
        status: 'ready',
      });
    } catch (error) {
      console.error('No se pudo cargar la serie diaria de usuarios activos', error);
      this.activeUsersSeries.update((state) => ({ ...state, status: 'error' }));
    }
  }

  private async refreshTrafficChannels(period: PeriodValue): Promise<void> {
    const accessToken = this.authService.accessToken();
    if (!accessToken) {
      return;
    }

    this.trafficChannelsState.update((state) => ({ ...state, status: 'loading' }));

    try {
      const range = getDateRangesForPeriod(period).current;
      const summary = await this.analyticsService.getTrafficChannels(accessToken, range);
      this.trafficChannelsState.set({
        channels: summary.channels,
        totalSessions: summary.totalSessions,
        status: 'ready',
      });
    } catch (error) {
      console.error('No se pudieron cargar los tipos de tráfico', error);
      this.trafficChannelsState.update((state) => ({ ...state, status: 'error' }));
    }
  }

  protected onSignOut(): void {
    this.authService.signOut();
    void this.router.navigateByUrl('/login');
  }
}
