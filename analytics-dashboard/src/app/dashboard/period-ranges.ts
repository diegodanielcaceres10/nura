export type PeriodValue = '7d' | '28d' | '90d' | '12m';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface PeriodDateRanges {
  current: DateRange;
  previous: DateRange;
}

// GA4 accepts relative date expressions like "NdaysAgo". 12 months is
// approximated as 365 days since the API has no native "months" unit.
const PERIOD_DAYS: Record<PeriodValue, number> = {
  '7d': 7,
  '28d': 28,
  '90d': 90,
  '12m': 365,
};

/**
 * Builds the current and previous date ranges for a dashboard period, so a
 * metric's percentage change can be computed against an equally-long,
 * immediately preceding window.
 */
export function getDateRangesForPeriod(period: PeriodValue): PeriodDateRanges {
  const days = PERIOD_DAYS[period];

  return {
    current: { startDate: `${days}daysAgo`, endDate: 'yesterday' },
    previous: { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` },
  };
}
