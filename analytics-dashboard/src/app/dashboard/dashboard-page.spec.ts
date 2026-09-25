import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { GoogleAuthService } from '../auth/google-auth.service';
import { GoogleAnalyticsService } from '../api/google-analytics.service';
import { DashboardPage } from './dashboard-page';

// Lets pending microtasks (the mocked GA4 fetch) settle before asserting.
async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let element: HTMLElement;
  let authServiceStub: {
    isAuthenticated: () => boolean;
    accessToken: () => string | null;
    signOut: ReturnType<typeof vi.fn>;
  };
  let analyticsServiceStub: {
    getActiveUsers: ReturnType<typeof vi.fn>;
    getSessions: ReturnType<typeof vi.fn>;
    getEventCount: ReturnType<typeof vi.fn>;
    getPageViews: ReturnType<typeof vi.fn>;
    getActiveUsersByDay: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    authServiceStub = {
      isAuthenticated: () => true,
      accessToken: () => 'fake-token',
      signOut: vi.fn(),
    };
    analyticsServiceStub = {
      getActiveUsers: vi
        .fn()
        .mockResolvedValue({ activeUsers: 321, previousActiveUsers: 300, deltaPercent: 7 }),
      getSessions: vi
        .fn()
        .mockResolvedValue({ sessions: 410, previousSessions: 400, deltaPercent: 2.5 }),
      getEventCount: vi
        .fn()
        .mockResolvedValue({ eventCount: 2010, previousEventCount: 2000, deltaPercent: 0.5 }),
      getPageViews: vi
        .fn()
        .mockResolvedValue({ pageViews: 850, previousPageViews: 800, deltaPercent: 6.3 }),
      getActiveUsersByDay: vi.fn().mockResolvedValue([
        { label: '1 jul', value: 30 },
        { label: '2 jul', value: 45 },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        { provide: GoogleAuthService, useValue: authServiceStub },
        { provide: GoogleAnalyticsService, useValue: analyticsServiceStub },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Nura and Google Analytics logos', () => {
    expect(element.querySelector('img[alt="Nura Logo"]')).not.toBeNull();
    expect(element.querySelector('img[alt="Logo de Google Analytics"]')).not.toBeNull();
  });

  it('should render the title and subtitle', () => {
    expect(element.querySelector('h1')?.textContent).toContain('Google Analytics');
    expect(element.querySelector('.dashboard__subtitle')?.textContent).toContain(
      'Descubre cómo interactúan los usuarios con tu web.',
    );
  });

  it('should list the period options with the last 28 days selected by default', () => {
    const select = element.querySelector<HTMLSelectElement>('select.period__select');
    expect(select?.options.length).toBe(4);
    expect(select?.value).toBe('28d');
  });

  it('should update the selected period when the selector changes', () => {
    const select = element.querySelector<HTMLSelectElement>('select.period__select');
    select!.value = '7d';
    select!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance['period']()).toBe('7d');
  });

  it('should render the four metric cards with real data from the GA4 API', () => {
    const cards = element.querySelectorAll('.metric-card');
    expect(cards.length).toBe(4);

    const values = Array.from(cards).map(
      (card) => card.querySelector('.metric-card__value')?.textContent?.trim(),
    );
    expect(values).toEqual(['321', '410', '2.010', '850']);
    expect(cards[0].querySelector('.metric-card__delta')?.textContent).toContain('+7%');
    expect(cards[1].querySelector('.metric-card__delta')?.textContent).toContain('+2.5%');
    expect(cards[2].querySelector('.metric-card__delta')?.textContent).toContain('+0.5%');
    expect(cards[3].querySelector('.metric-card__delta')?.textContent).toContain('+6.3%');
  });

  it('should request new summaries for all four metrics when the period changes', async () => {
    expect(analyticsServiceStub.getActiveUsers).toHaveBeenCalledTimes(1);
    expect(analyticsServiceStub.getSessions).toHaveBeenCalledTimes(1);
    expect(analyticsServiceStub.getEventCount).toHaveBeenCalledTimes(1);
    expect(analyticsServiceStub.getPageViews).toHaveBeenCalledTimes(1);

    const select = element.querySelector<HTMLSelectElement>('select.period__select');
    select!.value = '7d';
    select!.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await flush();

    expect(analyticsServiceStub.getActiveUsers).toHaveBeenCalledTimes(2);
    expect(analyticsServiceStub.getSessions).toHaveBeenCalledTimes(2);
    expect(analyticsServiceStub.getEventCount).toHaveBeenCalledTimes(2);
    expect(analyticsServiceStub.getPageViews).toHaveBeenCalledTimes(2);
    const [, activeUsersRanges] = analyticsServiceStub.getActiveUsers.mock.calls[1];
    const [, sessionsRanges] = analyticsServiceStub.getSessions.mock.calls[1];
    const [, eventsRanges] = analyticsServiceStub.getEventCount.mock.calls[1];
    const [, pageViewsRanges] = analyticsServiceStub.getPageViews.mock.calls[1];
    expect(activeUsersRanges.current.startDate).toBe('7daysAgo');
    expect(sessionsRanges.current.startDate).toBe('7daysAgo');
    expect(eventsRanges.current.startDate).toBe('7daysAgo');
    expect(pageViewsRanges.current.startDate).toBe('7daysAgo');
  });

  it('should render the active users chart with real daily data from the GA4 API', () => {
    expect(element.querySelector('app-active-users-chart h2')?.textContent).toContain(
      'Usuarios activos',
    );

    const labels = Array.from(
      element.querySelectorAll('app-active-users-chart .chart-card__x-axis li'),
    ).map((li) => li.textContent?.trim());
    expect(labels).toEqual(['1 jul', '2 jul']);

    const yTicks = Array.from(
      element.querySelectorAll('app-active-users-chart .chart-card__y-axis li'),
    ).map((li) => li.textContent?.trim());
    expect(yTicks).toEqual(['80', '60', '40', '20', '0']);
  });

  it('should request a new daily series when the period changes', async () => {
    expect(analyticsServiceStub.getActiveUsersByDay).toHaveBeenCalledTimes(1);

    const select = element.querySelector<HTMLSelectElement>('select.period__select');
    select!.value = '7d';
    select!.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await flush();

    expect(analyticsServiceStub.getActiveUsersByDay).toHaveBeenCalledTimes(2);
    const [, range] = analyticsServiceStub.getActiveUsersByDay.mock.calls[1];
    expect(range.startDate).toBe('7daysAgo');
  });

  it('should show an error message on the chart when the daily series fails to load', async () => {
    analyticsServiceStub.getActiveUsersByDay.mockRejectedValueOnce(new Error('GA4 respondió 500'));

    const select = element.querySelector<HTMLSelectElement>('select.period__select');
    select!.value = '90d';
    select!.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    expect(
      element.querySelector('app-active-users-chart .chart-card__status--error')?.textContent,
    ).toContain('No se pudieron cargar');
  });

  it('should render the traffic donut', () => {
    expect(element.querySelector('app-traffic-donut h2')?.textContent).toContain(
      'Tipos de tráfico',
    );
  });

  it('should render the top pages, top events and summary cards', () => {
    expect(element.querySelector('app-top-pages h2')?.textContent).toContain(
      'Páginas más vistas',
    );
    expect(element.querySelector('app-top-events h2')?.textContent).toContain(
      'Eventos principales',
    );
    expect(element.querySelector('app-summary-card h2')?.textContent).toContain('Resumen');
  });

  it('should sign out and redirect to /login when the sign-out button is clicked', () => {
    const button = element.querySelector<HTMLButtonElement>('.dashboard__sign-out');
    button!.click();

    expect(authServiceStub.signOut).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
