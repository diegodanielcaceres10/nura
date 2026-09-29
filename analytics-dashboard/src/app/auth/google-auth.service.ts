import { Injectable, computed, signal } from '@angular/core';

export interface GoogleAuthSession {
  accessToken: string;
  expiresAt: number;
}

// Read-only access to Google Analytics data (GA4 Data API).
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const SESSION_STORAGE_KEY = 'nura.analytics-dashboard.session';

/**
 * Wraps Google Identity Services' OAuth token client to sign the user in
 * with a Google Analytics read-only scope. The token is kept in memory and
 * mirrored to sessionStorage so a page refresh doesn't force a new consent
 * screen while the token is still valid.
 */
@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;

  private readonly session = signal<GoogleAuthSession | null>(this.readStoredSession());

  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly accessToken = computed(() => this.session()?.accessToken ?? null);

  /**
   * Opens the Google consent screen and resolves once an access token with
   * the analytics.readonly scope has been granted.
   */
  async signIn(): Promise<void> {
    const clientId = window.__env?.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error(
        'Falta configurar GOOGLE_CLIENT_ID. Creá analytics-dashboard/.env a partir de .env.example.',
      );
    }
    if (!window.google?.accounts?.oauth2) {
      throw new Error(
        'No se pudo cargar Google Identity Services. Revisá tu conexión e intentá de nuevo.',
      );
    }

    const tokenClient = this.getTokenClient(clientId);

    const response = await new Promise<google.accounts.oauth2.TokenResponse>((resolve, reject) => {
      tokenClient.callback = (tokenResponse) => {
        if (tokenResponse.error) {
          reject(new Error(tokenResponse.error_description ?? tokenResponse.error));
          return;
        }
        resolve(tokenResponse);
      };
      tokenClient.requestAccessToken();
    });

    const session: GoogleAuthSession = {
      accessToken: response.access_token,
      expiresAt: Date.now() + response.expires_in * 1000,
    };
    this.session.set(session);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  signOut(): void {
    const token = this.session()?.accessToken;
    this.session.set(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

    if (token) {
      window.google?.accounts?.oauth2.revoke(token);
    }
    this.tokenClient = null;
  }

  private getTokenClient(clientId: string): google.accounts.oauth2.TokenClient {
    this.tokenClient ??= window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: () => {},
    });
    return this.tokenClient;
  }

  private readStoredSession(): GoogleAuthSession | null {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as GoogleAuthSession;
      return parsed.expiresAt > Date.now() ? parsed : null;
    } catch {
      return null;
    }
  }
}
