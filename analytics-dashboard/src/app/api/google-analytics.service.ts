import { Injectable } from '@angular/core';
import { DateRange, PeriodDateRanges } from '../dashboard/period-ranges';

export interface ActiveUsersSummary {
  activeUsers: number;
  previousActiveUsers: number;
  /** null when the previous period has no data to compare against. */
  deltaPercent: number | null;
}

export interface SessionsSummary {
  sessions: number;
  previousSessions: number;
  /** null when the previous period has no data to compare against. */
  deltaPercent: number | null;
}

export interface EventCountSummary {
  eventCount: number;
  previousEventCount: number;
  /** null when the previous period has no data to compare against. */
  deltaPercent: number | null;
}

export interface PageViewsSummary {
  pageViews: number;
  previousPageViews: number;
  /** null when the previous period has no data to compare against. */
  deltaPercent: number | null;
}

export interface DailyActiveUsersPoint {
  label: string;
  value: number;
}

interface MetricSummary {
  value: number;
  previousValue: number;
  deltaPercent: number | null;
}

interface Ga4RunReportResponse {
  rows?: ReadonlyArray<{
    metricValues?: ReadonlyArray<{ value?: string }>;
  }>;
}

interface Ga4DailyReportResponse {
  rows?: ReadonlyArray<{
    dimensionValues?: ReadonlyArray<{ value?: string }>;
    metricValues?: ReadonlyArray<{ value?: string }>;
  }>;
}

const GA4_ENDPOINT = 'https://analyticsdata.googleapis.com/v1beta';

// How many points the "Usuarios activos" chart should end up with,
// regardless of how many days the selected period spans. Consecutive days
// are averaged together into buckets to reach roughly this count.
const CHART_TARGET_POINTS = 10;

const MONTH_ABBREVIATIONS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const;

/** Parses GA4's "date" dimension format (YYYYMMDD) into a local Date. */
function parseGa4Date(value: string): Date {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));
  return new Date(year, month, day);
}

function formatDayLabel(date: Date): string {
  return `${date.getDate()} ${MONTH_ABBREVIATIONS[date.getMonth()]}`;
}

/**
 * Groups daily values into ~targetPoints buckets (consecutive-day
 * averages), so a 90-day or 12-month period doesn't render one x-axis
 * label per day.
 */
function bucketDailyPoints(
  daily: ReadonlyArray<{ date: Date; value: number }>,
  targetPoints: number,
): DailyActiveUsersPoint[] {
  if (daily.length === 0) {
    return [];
  }

  const bucketSize = Math.max(1, Math.ceil(daily.length / targetPoints));
  const points: DailyActiveUsersPoint[] = [];

  for (let i = 0; i < daily.length; i += bucketSize) {
    const bucket = daily.slice(i, i + bucketSize);
    const average = bucket.reduce((sum, item) => sum + item.value, 0) / bucket.length;
    points.push({ label: formatDayLabel(bucket[0].date), value: Math.round(average) });
  }

  return points;
}

/**
 * Thin client for the GA4 Data API (runReport). Each metric fetches its
 * own current/previous-period report via getMetricSummary; if several
 * cards start needing the same date ranges, this is a natural place to
 * batch them into a single request instead.
 */
@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private get propertyId(): string {
    return window.__env?.GA_PROPERTY_ID ?? '';
  }

  /**
   * Fetches activeUsers for the current and previous periods and returns
   * the percentage change between them.
   */
  async getActiveUsers(accessToken: string, ranges: PeriodDateRanges): Promise<ActiveUsersSummary> {
    const { value, previousValue, deltaPercent } = await this.getMetricSummary(
      accessToken,
      ranges,
      'activeUsers',
    );
    return { activeUsers: value, previousActiveUsers: previousValue, deltaPercent };
  }

  /**
   * Fetches sessions for the current and previous periods and returns the
   * percentage change between them.
   */
  async getSessions(accessToken: string, ranges: PeriodDateRanges): Promise<SessionsSummary> {
    const { value, previousValue, deltaPercent } = await this.getMetricSummary(
      accessToken,
      ranges,
      'sessions',
    );
    return { sessions: value, previousSessions: previousValue, deltaPercent };
  }

  /**
   * Fetches the total event count for the current and previous periods and
   * returns the percentage change between them.
   */
  async getEventCount(accessToken: string, ranges: PeriodDateRanges): Promise<EventCountSummary> {
    const { value, previousValue, deltaPercent } = await this.getMetricSummary(
      accessToken,
      ranges,
      'eventCount',
    );
    return { eventCount: value, previousEventCount: previousValue, deltaPercent };
  }

  /**
   * Fetches page views (screenPageViews) for the current and previous
   * periods and returns the percentage change between them.
   */
  async getPageViews(accessToken: string, ranges: PeriodDateRanges): Promise<PageViewsSummary> {
    const { value, previousValue, deltaPercent } = await this.getMetricSummary(
      accessToken,
      ranges,
      'screenPageViews',
    );
    return { pageViews: value, previousPageViews: previousValue, deltaPercent };
  }

  /**
   * Fetches a day-by-day activeUsers breakdown for the given range and
   * buckets it into ~CHART_TARGET_POINTS points, for the "Usuarios
   * activos" chart.
   */
  async getActiveUsersByDay(
    accessToken: string,
    range: DateRange,
    targetPoints = CHART_TARGET_POINTS,
  ): Promise<DailyActiveUsersPoint[]> {
    const propertyId = this.propertyId;
    if (!propertyId) {
      throw new Error(
        'Falta configurar GA_PROPERTY_ID. Completá analytics-dashboard/.env a partir de .env.example.',
      );
    }

    const response = await fetch(`${GA4_ENDPOINT}/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
    });

    if (!response.ok) {
      throw new Error(`GA4 respondió ${response.status} al consultar activeUsers por día.`);
    }

    const data = (await response.json()) as Ga4DailyReportResponse;
    const daily = (data.rows ?? []).map((row) => ({
      date: parseGa4Date(row.dimensionValues?.[0]?.value ?? ''),
      value: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    return bucketDailyPoints(daily, targetPoints);
  }

  private async getMetricSummary(
    accessToken: string,
    ranges: PeriodDateRanges,
    metricName: string,
  ): Promise<MetricSummary> {
    const [value, previousValue] = await Promise.all([
      this.fetchMetric(accessToken, ranges.current.startDate, ranges.current.endDate, metricName),
      this.fetchMetric(accessToken, ranges.previous.startDate, ranges.previous.endDate, metricName),
    ]);

    const deltaPercent =
      previousValue > 0 ? Math.round(((value - previousValue) / previousValue) * 1000) / 10 : null;

    return { value, previousValue, deltaPercent };
  }

  private async fetchMetric(
    accessToken: string,
    startDate: string,
    endDate: string,
    metricName: string,
  ): Promise<number> {
    const propertyId = this.propertyId;
    if (!propertyId) {
      throw new Error(
        'Falta configurar GA_PROPERTY_ID. Completá analytics-dashboard/.env a partir de .env.example.',
      );
    }

    const response = await fetch(`${GA4_ENDPOINT}/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: metricName }],
      }),
    });

    if (!response.ok) {
      throw new Error(`GA4 respondió ${response.status} al consultar ${metricName}.`);
    }

    const data = (await response.json()) as Ga4RunReportResponse;
    const raw = data.rows?.[0]?.metricValues?.[0]?.value;
    return raw !== undefined ? Number(raw) : 0;
  }
}
