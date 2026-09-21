import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
    }).compileComponents();

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
});
