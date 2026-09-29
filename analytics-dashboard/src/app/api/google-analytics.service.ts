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

export type TrafficChannelId = 'organic' | 'direct' | 'referral' | 'social' | 'other';

export interface TrafficChannelBreakdown {
  id: TrafficChannelId;
  label: string;
  percent: number;
  color: 'purple' | 'blue' | 'green' | 'pink' | 'orange';
}

export interface TrafficChannelsSummary {
  channels: readonly TrafficChannelBreakdown[];
  totalSessions: number;
}

export interface TopPageBreakdown {
  path: string;
  views: number;
}

export interface TopEventBreakdown {
  name: string;
  count: number;
  /** Share of this event over the total event count for the period. */
  percent: number;
}

interface MetricSummary {
  value: number;
  previousValue: number;
  deltaPercent: number | null;
}

// Shape shared by every GA4 runReport response we consume: with no
// dimensions requested, rows only carry metricValues; with one dimension,
// each row also carries a single dimensionValues entry.
interface Ga4RunReportResponse {
  rows?: ReadonlyArray<{
    dimensionValues?: ReadonlyArray<{ value?: string }>;
    metricValues?: ReadonlyArray<{ value?: string }>;
  }>;
}

// Maps GA4's sessionDefaultChannelGroup values onto the 5 traffic types
// the "Tipos de tráfico" donut shows. Anything not explicitly listed here
// (Paid Search, Email, Display, Affiliates, etc.) falls into "Otros".
const TRAFFIC_CHANNEL_BUCKETS: ReadonlyArray<{
  id: TrafficChannelId;
  label: string;
  color: TrafficChannelBreakdown['color'];
  gaGroups: readonly string[];
}> = [
  { id: 'organic', label: 'Organic Search', color: 'purple', gaGroups: ['Organic Search'] },
  { id: 'direct', label: 'Direct', color: 'blue', gaGroups: ['Direct'] },
  { id: 'referral', label: 'Referral', color: 'green', gaGroups: ['Referral'] },
  { id: 'social', label: 'Social', color: 'pink', gaGroups: ['Organic Social', 'Paid Social'] },
];
const OTHER_TRAFFIC_BUCKET = { id: 'other' as const, label: 'Otros', color: 'orange' as const };

const GA4_ENDPOINT = 'https://analyticsdata.googleapis.com/v1beta';

// How many points the "Usuarios activos" chart should end up with,
// regardless of how many days the selected period spans. Consecutive days
// are averaged together into buckets to reach roughly this count.
const CHART_TARGET_POINTS = 10;

// How long a successful response is reused before asking GA4 again. The
// dashboard's numbers don't need to be second-fresh, and this also means
// switching the period back and forth doesn't re-fire requests we already
// have an answer for.
const CACHE_TTL_MS = 60_000;

// GA4's Data API caps concurrent requests per property; this keeps us
// comfortably under that regardless of how many cards refetch at once
// (a single period change can trigger a dozen or so requests today).
const MAX_CONCURRENT_REQUESTS = 4;

// If GA4 answers 429 (rate limited), retry a couple of times with backoff
// before giving up.
const MAX_RATE_LIMIT_RETRIES = 2;
const RATE_LIMIT_BASE_DELAY_MS = 1000;

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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Caps how many callers run concurrently; extras wait their turn in a FIFO queue. */
class ConcurrencyLimiter {
  private active = 0;
  private readonly queue: Array<() => void> = [];

  constructor(private readonly max: number) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.active >= this.max) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }

    this.active++;
    try {
      return await task();
    } finally {
      this.active--;
      this.queue.shift()?.();
    }
  }
}

/**
 * Thin client for the GA4 Data API (runReport). Every request goes through
 * postRunReport, which adds a short-lived cache, dedupes identical
 * in-flight requests, caps concurrency, and retries once or twice on 429s.
 */
@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private readonly limiter = new ConcurrencyLimiter(MAX_CONCURRENT_REQUESTS);
  private readonly cache = new Map<string, { value: Ga4RunReportResponse; expiresAt: number }>();
  private readonly pending = new Map<string, Promise<Ga4RunReportResponse>>();

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
    const data = await this.postRunReport(accessToken, {
      dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const daily = (data.rows ?? []).map((row) => ({
      date: parseGa4Date(row.dimensionValues?.[0]?.value ?? ''),
      value: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    return bucketDailyPoints(daily, targetPoints);
  }

  /**
   * Fetches sessions grouped by GA4's default channel group for the given
   * range, buckets them into the 5 traffic types the donut shows, and
   * returns each bucket's share of the total plus the total itself.
   */
  async getTrafficChannels(accessToken: string, range: DateRange): Promise<TrafficChannelsSummary> {
    const data = await this.postRunReport(accessToken, {
      dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
    });

    const sessionsByBucket = new Map<TrafficChannelId, number>();
    let totalSessions = 0;

    for (const row of data.rows ?? []) {
      const gaGroup = row.dimensionValues?.[0]?.value ?? '';
      const sessions = Number(row.metricValues?.[0]?.value ?? 0);
      totalSessions += sessions;

      const bucket = TRAFFIC_CHANNEL_BUCKETS.find((b) => b.gaGroups.includes(gaGroup));
      const id = bucket?.id ?? OTHER_TRAFFIC_BUCKET.id;
      sessionsByBucket.set(id, (sessionsByBucket.get(id) ?? 0) + sessions);
    }

    const allBuckets = [...TRAFFIC_CHANNEL_BUCKETS, OTHER_TRAFFIC_BUCKET];
    const channels = allBuckets.map(({ id, label, color }) => {
      const sessions = sessionsByBucket.get(id) ?? 0;
      const percent = totalSessions > 0 ? Math.round((sessions / totalSessions) * 1000) / 10 : 0;
      return { id, label, percent, color };
    });

    return { channels, totalSessions };
  }

  /**
   * Fetches the top pages by page views (pagePath + screenPageViews) for
   * the given range, ordered from most to least viewed.
   */
  async getTopPages(
    accessToken: string,
    range: DateRange,
    limit = 5,
  ): Promise<readonly TopPageBreakdown[]> {
    const data = await this.postRunReport(accessToken, {
      dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit,
    });

    return (data.rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? '(not set)',
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));
  }

  /**
   * Fetches the top events by count (eventName + eventCount) for the given
   * range, plus each one's share of the total event count for that same
   * range (not just the share among the top N returned). The grand-total
   * request here is identical to the one getEventCount makes for the same
   * range, so when both run in the same batch they share one network call.
   */
  async getTopEvents(
    accessToken: string,
    range: DateRange,
    limit = 5,
  ): Promise<readonly TopEventBreakdown[]> {
    const [totalEventCount, data] = await Promise.all([
      this.fetchMetric(accessToken, range.startDate, range.endDate, 'eventCount'),
      this.postRunReport(accessToken, {
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit,
      }),
    ]);

    return (data.rows ?? []).map((row) => {
      const count = Number(row.metricValues?.[0]?.value ?? 0);
      return {
        name: row.dimensionValues?.[0]?.value ?? '(not set)',
        count,
        percent: totalEventCount > 0 ? Math.round((count / totalEventCount) * 1000) / 10 : 0,
      };
    });
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
    const data = await this.postRunReport(accessToken, {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: metricName }],
    });

    const raw = data.rows?.[0]?.metricValues?.[0]?.value;
    return raw !== undefined ? Number(raw) : 0;
  }

  /**
   * Single choke point for every runReport call: validates the property
   * id, serves a cached response when one is fresh, dedupes an identical
   * request that's already in flight, and otherwise runs it through the
   * concurrency limiter (with retry-on-429) and caches the result.
   */
  private async postRunReport(
    accessToken: string,
    body: Record<string, unknown>,
  ): Promise<Ga4RunReportResponse> {
    const propertyId = this.propertyId;
    if (!propertyId) {
      throw new Error(
        'Falta configurar GA_PROPERTY_ID. Completá analytics-dashboard/.env a partir de .env.example.',
      );
    }

    const cacheKey = `${propertyId}:${JSON.stringify(body)}`;

    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const inFlight = this.pending.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const requestPromise = this.limiter
      .run(() => this.fetchWithRetries(accessToken, propertyId, body))
      .then((data) => {
        this.cache.set(cacheKey, { value: data, expiresAt: Date.now() + CACHE_TTL_MS });
        return data;
      })
      .finally(() => {
        this.pending.delete(cacheKey);
      });

    this.pending.set(cacheKey, requestPromise);
    return requestPromise;
  }

  private async fetchWithRetries(
    accessToken: string,
    propertyId: string,
    body: Record<string, unknown>,
  ): Promise<Ga4RunReportResponse> {
    for (let attempt = 0; ; attempt++) {
      const response = await fetch(`${GA4_ENDPOINT}/properties/${propertyId}:runReport`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
        const retryAfterHeader = response.headers?.get('Retry-After');
        const retryAfterMs = retryAfterHeader
          ? Number(retryAfterHeader) * 1000
          : RATE_LIMIT_BASE_DELAY_MS * 2 ** attempt;
        await delay(retryAfterMs);
        continue;
      }

      if (response.status === 429) {
        throw new Error(
          'Se alcanzó el límite de solicitudes a la API de Google Analytics. Probá de nuevo en unos segundos.',
        );
      }

      if (!response.ok) {
        throw new Error(`GA4 respondió ${response.status} al consultar datos de Analytics.`);
      }

      return (await response.json()) as Ga4RunReportResponse;
    }
  }
}
