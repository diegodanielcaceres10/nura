import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GoogleAuthService } from './google-auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(GoogleAuthService);
  const router = inject(Router);

  return auth.isAuthenticated() ? true : router.parseUrl('/login');
};
