import { Injectable } from '@angular/core';
import { DateRange, PeriodDateRanges } from '../dashboard/period-ranges';

export interface ActiveUsersSummary {
  activeUsers: number;
  previousActiveUsers: number;
  /** null when the previous period has no data to compare against. */
  deltaPercent: number | null;
}

interface Ga4RunReportResponse {
  rows?: ReadonlyArray<{
    metricValues?: ReadonlyArray<{ value?: string }>;
  }>;
}

const GA4_ENDPOINT = 'https://analyticsdata.googleapis.com/v1beta';

/**
 * Thin client for the GA4 Data API (runReport). Each metric currently
 * fetches its own report; if more cards start reusing the same date
 * ranges, this is a natural place to batch them into a single request.
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
    const [activeUsers, previousActiveUsers] = await Promise.all([
      this.fetchActiveUsers(accessToken, ranges.current),
      this.fetchActiveUsers(accessToken, ranges.previous),
    ]);

    const deltaPercent =
      previousActiveUsers > 0
        ? Math.round(((activeUsers - previousActiveUsers) / previousActiveUsers) * 1000) / 10
        : null;

    return { activeUsers, previousActiveUsers, deltaPercent };
  }

  private async fetchActiveUsers(accessToken: string, range: DateRange): Promise<number> {
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
        metrics: [{ name: 'activeUsers' }],
      }),
    });

    if (!response.ok) {
      throw new Error(`GA4 respondió ${response.status} al consultar activeUsers.`);
    }

    const data = (await response.json()) as Ga4RunReportResponse;
    const raw = data.rows?.[0]?.metricValues?.[0]?.value;
    return raw !== undefined ? Number(raw) : 0;
  }
}
