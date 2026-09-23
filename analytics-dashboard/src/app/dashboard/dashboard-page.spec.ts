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

  it('should render the four metric cards, with real data for active users and sessions', () => {
    const cards = element.querySelectorAll('.metric-card');
    expect(cards.length).toBe(4);

    const values = Array.from(cards).map(
      (card) => card.querySelector('.metric-card__value')?.textContent?.trim(),
    );
    expect(values).toEqual(['321', '410', '1.886', '779']);
    expect(cards[0].querySelector('.metric-card__delta')?.textContent).toContain('+7%');
    expect(cards[1].querySelector('.metric-card__delta')?.textContent).toContain('+2.5%');
  });

  it('should request new active users and sessions summaries when the period changes', async () => {
    expect(analyticsServiceStub.getActiveUsers).toHaveBeenCalledTimes(1);
    expect(analyticsServiceStub.getSessions).toHaveBeenCalledTimes(1);

    const select = element.querySelector<HTMLSelectElement>('select.period__select');
    select!.value = '7d';
    select!.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await flush();

    expect(analyticsServiceStub.getActiveUsers).toHaveBeenCalledTimes(2);
    expect(analyticsServiceStub.getSessions).toHaveBeenCalledTimes(2);
    const [, activeUsersRanges] = analyticsServiceStub.getActiveUsers.mock.calls[1];
    const [, sessionsRanges] = analyticsServiceStub.getSessions.mock.calls[1];
    expect(activeUsersRanges.current.startDate).toBe('7daysAgo');
    expect(sessionsRanges.current.startDate).toBe('7daysAgo');
  });

  it('should render the active users chart', () => {
    expect(element.querySelector('app-active-users-chart h2')?.textContent).toContain(
      'Usuarios activos',
    );
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
