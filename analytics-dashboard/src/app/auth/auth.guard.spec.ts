import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { GoogleAuthService } from './google-auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authServiceStub: { isAuthenticated: () => boolean };
  let router: Router;

  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/dashboard' } as never),
    );
  }

  beforeEach(() => {
    authServiceStub = { isAuthenticated: () => false };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: GoogleAuthService, useValue: authServiceStub }],
    });

    router = TestBed.inject(Router);
  });

  it('should allow navigation when the user is authenticated', () => {
    authServiceStub.isAuthenticated = () => true;

    expect(runGuard()).toBe(true);
  });

  it('should redirect to /login when the user is not authenticated', () => {
    const result = runGuard();

    expect(result).not.toBe(true);
    expect((result as ReturnType<Router['parseUrl']>).toString()).toBe('/login');
  });
});
