import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { GoogleAuthService } from '../auth/google-auth.service';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let element: HTMLElement;
  let authServiceStub: {
    isAuthenticated: () => boolean;
    signIn: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    authServiceStub = {
      isAuthenticated: () => false,
      signIn: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([]),
        { provide: GoogleAuthService, useValue: authServiceStub },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the welcome title', () => {
    expect(element.querySelector('h1')?.textContent).toContain('Bienvenido a Nura');
  });

  it('should render the Google sign-in button', () => {
    const button = element.querySelector('button.login__google');
    expect(button?.textContent).toContain('Continuar con Google');
  });

  it('should render the three feature highlights', () => {
    expect(element.querySelectorAll('.login__feature').length).toBe(3);
  });

  it('should render the Google Analytics logo', () => {
    const logo = element.querySelector<HTMLImageElement>('img[alt="Google Analytics"]');
    expect(logo).not.toBeNull();
  });

  it('should redirect to /dashboard and store nothing extra when sign-in succeeds', async () => {
    authServiceStub.signIn.mockResolvedValue(undefined);

    const button = element.querySelector<HTMLButtonElement>('button.login__google');
    button!.click();
    await fixture.whenStable();

    expect(authServiceStub.signIn).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should show an error message when sign-in fails', async () => {
    authServiceStub.signIn.mockRejectedValue(new Error('El usuario canceló el acceso'));

    const button = element.querySelector<HTMLButtonElement>('button.login__google');
    button!.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('.login__error')?.textContent).toContain(
      'El usuario canceló el acceso',
    );
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect immediately when the user is already authenticated', () => {
    authServiceStub.isAuthenticated = () => true;

    const authedFixture = TestBed.createComponent(LoginPage);
    authedFixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
