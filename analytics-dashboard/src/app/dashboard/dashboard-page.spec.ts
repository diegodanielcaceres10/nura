import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { GoogleAuthService } from '../auth/google-auth.service';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let element: HTMLElement;
  let authServiceStub: { isAuthenticated: () => boolean; signOut: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authServiceStub = {
      isAuthenticated: () => true,
      signOut: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        { provide: GoogleAuthService, useValue: authServiceStub },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(DashboardPage);
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

  it('should render the four metric cards from the prototype', () => {
    const cards = element.querySelectorAll('.metric-card');
    expect(cards.length).toBe(4);

    const values = Array.from(cards).map(
      (card) => card.querySelector('.metric-card__value')?.textContent?.trim(),
    );
    expect(values).toEqual(['198', '257', '1.886', '779']);
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
