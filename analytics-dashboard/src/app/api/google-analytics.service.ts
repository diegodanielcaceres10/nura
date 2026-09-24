import { Injectable } from '@angular/core';
import { PeriodDateRanges } from '../dashboard/period-ranges';

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

const GA4_ENDPOINT = 'https://analyticsdata.googleapis.com/v1beta';

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
