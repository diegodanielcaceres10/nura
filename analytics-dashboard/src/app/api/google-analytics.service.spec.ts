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
});
