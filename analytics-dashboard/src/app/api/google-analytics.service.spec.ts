import { TestBed } from '@angular/core/testing';
import { GoogleAnalyticsService } from './google-analytics.service';

describe('GoogleAnalyticsService', () => {
  let service: GoogleAnalyticsService;
  let fetchSpy: ReturnType<typeof vi.fn>;

  const ranges = {
    current: { startDate: '28daysAgo', endDate: 'yesterday' },
    previous: { startDate: '56daysAgo', endDate: '29daysAgo' },
  };

  function jsonResponse(value: string) {
    return {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ rows: [{ metricValues: [{ value }] }] }),
    };
  }

  beforeEach(() => {
    window.__env = { GA_PROPERTY_ID: '123456789' };
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAnalyticsService);
  });

  afterEach(() => {
    window.__env = undefined;
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should reject when GA_PROPERTY_ID is not configured', async () => {
    window.__env = undefined;

    await expect(service.getActiveUsers('token', ranges)).rejects.toThrow(/GA_PROPERTY_ID/);
  });

  it('should compute the percentage change between the two periods', async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse('198')).mockResolvedValueOnce(jsonResponse('176'));

    const summary = await service.getActiveUsers('token', ranges);

    expect(summary).toEqual({ activeUsers: 198, previousActiveUsers: 176, deltaPercent: 12.5 });
  });

  it('should call the GA4 runReport endpoint with the property id and access token', async () => {
    fetchSpy.mockResolvedValue(jsonResponse('0'));

    await service.getActiveUsers('token-123', ranges);

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      'https://analyticsdata.googleapis.com/v1beta/properties/123456789:runReport',
    );
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer token-123');
  });

  it('should return a null delta when the previous period has no data', async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse('50')).mockResolvedValueOnce(jsonResponse('0'));

    const summary = await service.getActiveUsers('token', ranges);

    expect(summary.deltaPercent).toBeNull();
  });

  it('should reject when GA4 responds with an error status', async () => {
    fetchSpy.mockResolvedValue({ ok: false, status: 403 });

    await expect(service.getActiveUsers('token', ranges)).rejects.toThrow(/403/);
  });

  it('should compute sessions and their percentage change between the two periods', async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse('410')).mockResolvedValueOnce(jsonResponse('400'));

    const summary = await service.getSessions('token', ranges);

    expect(summary).toEqual({ sessions: 410, previousSessions: 400, deltaPercent: 2.5 });
  });

  it('should request the "sessions" metric when fetching sessions', async () => {
    fetchSpy.mockResolvedValue(jsonResponse('0'));

    await service.getSessions('token', ranges);

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as { metrics: Array<{ name: string }> };
    expect(body.metrics).toEqual([{ name: 'sessions' }]);
  });

  it('should compute the event count and its percentage change between the two periods', async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse('1886')).mockResolvedValueOnce(jsonResponse('1600'));

    const summary = await service.getEventCount('token', ranges);

    expect(summary).toEqual({ eventCount: 1886, previousEventCount: 1600, deltaPercent: 17.9 });
  });

  it('should request the "eventCount" metric when fetching events', async () => {
    fetchSpy.mockResolvedValue(jsonResponse('0'));

    await service.getEventCount('token', ranges);

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as { metrics: Array<{ name: string }> };
    expect(body.metrics).toEqual([{ name: 'eventCount' }]);
  });

  it('should compute page views and their percentage change between the two periods', async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse('779')).mockResolvedValueOnce(jsonResponse('682'));

    const summary = await service.getPageViews('token', ranges);

    expect(summary).toEqual({ pageViews: 779, previousPageViews: 682, deltaPercent: 14.2 });
  });

  it('should request the "screenPageViews" metric when fetching page views', async () => {
    fetchSpy.mockResolvedValue(jsonResponse('0'));

    await service.getPageViews('token', ranges);

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as { metrics: Array<{ name: string }> };
    expect(body.metrics).toEqual([{ name: 'screenPageViews' }]);
  });

  it('should return one point per day, labelled and ordered, for a short range', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          rows: [
            { dimensionValues: [{ value: '20260401' }], metricValues: [{ value: '12' }] },
            { dimensionValues: [{ value: '20260402' }], metricValues: [{ value: '18' }] },
            { dimensionValues: [{ value: '20260403' }], metricValues: [{ value: '15' }] },
          ],
        }),
    });

    const points = await service.getActiveUsersByDay('token', {
      startDate: '3daysAgo',
      endDate: 'yesterday',
    });

    expect(points).toEqual([
      { label: '1 abr', value: 12 },
      { label: '2 abr', value: 18 },
      { label: '3 abr', value: 15 },
    ]);
  });

  it('should bucket a long range into roughly the target number of points', async () => {
    const rows = Array.from({ length: 28 }, (_, i) => {
      const day = String(i + 1).padStart(2, '0');
      return {
        dimensionValues: [{ value: `202604${day}` }],
        metricValues: [{ value: String(10 + i) }],
      };
    });
    fetchSpy.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ rows }) });

    const points = await service.getActiveUsersByDay(
      'token',
      { startDate: '28daysAgo', endDate: 'yesterday' },
      10,
    );

    expect(points.length).toBeLessThanOrEqual(10);
    expect(points[0]).toEqual({ label: '1 abr', value: 11 }); // average of days 1-3 (10,11,12)
  });

  it('should return an empty array when GA4 has no rows for the range', async () => {
    fetchSpy.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({}) });

    const points = await service.getActiveUsersByDay('token', ranges.current);

    expect(points).toEqual([]);
  });

  it('should reject when GA4 responds with an error status for the daily report', async () => {
    fetchSpy.mockResolvedValue({ ok: false, status: 500 });

    await expect(service.getActiveUsersByDay('token', ranges.current)).rejects.toThrow(/500/);
  });
});
