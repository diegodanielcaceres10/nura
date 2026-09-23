import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../auth/google-auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly authService = inject(GoogleAuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    if (this.authService.isAuthenticated()) {
      void this.router.navigateByUrl('/dashboard');
    }
  }

  protected async onGoogleSignIn(): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      await this.authService.signIn();
      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'No se pudo iniciar sesión con Google.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
