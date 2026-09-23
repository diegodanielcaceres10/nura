import { TestBed } from '@angular/core/testing';
import { GoogleAuthService } from './google-auth.service';

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;

  beforeEach(() => {
    sessionStorage.clear();
    window.__env = undefined;
    window.google = undefined;

    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
    window.__env = undefined;
    window.google = undefined;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should start unauthenticated when there is no stored session', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.accessToken()).toBeNull();
  });

  it('should reject when GOOGLE_CLIENT_ID is not configured', async () => {
    await expect(service.signIn()).rejects.toThrow(/GOOGLE_CLIENT_ID/);
  });

  it('should reject when Google Identity Services has not loaded', async () => {
    window.__env = { GOOGLE_CLIENT_ID: 'test-client-id' };

    await expect(service.signIn()).rejects.toThrow(/Google Identity Services/);
  });

  it('should store the session and expose it once sign-in succeeds', async () => {
    window.__env = { GOOGLE_CLIENT_ID: 'test-client-id' };

    const requestAccessToken = vi.fn(function (this: { callback: (r: unknown) => void }) {
      this.callback({ access_token: 'token-123', expires_in: 3600 });
    });

    window.google = {
      accounts: {
        oauth2: {
          initTokenClient: vi.fn((config: { callback: (r: unknown) => void }) => ({
            callback: config.callback,
            requestAccessToken,
          })),
          revoke: vi.fn(),
        },
      },
    } as unknown as Window['google'];

    await service.signIn();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.accessToken()).toBe('token-123');
    expect(sessionStorage.getItem('nura.analytics-dashboard.session')).toContain('token-123');
  });

  it('should reject when Google returns an error', async () => {
    window.__env = { GOOGLE_CLIENT_ID: 'test-client-id' };

    window.google = {
      accounts: {
        oauth2: {
          initTokenClient: vi.fn((config: { callback: (r: unknown) => void }) => ({
            callback: config.callback,
            requestAccessToken: vi.fn(function (this: { callback: (r: unknown) => void }) {
              this.callback({ error: 'access_denied', error_description: 'El usuario canceló' });
            }),
          })),
          revoke: vi.fn(),
        },
      },
    } as unknown as Window['google'];

    await expect(service.signIn()).rejects.toThrow(/canceló/);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should clear the session on sign-out', async () => {
    window.__env = { GOOGLE_CLIENT_ID: 'test-client-id' };
    window.google = {
      accounts: {
        oauth2: {
          initTokenClient: vi.fn((config: { callback: (r: unknown) => void }) => ({
            callback: config.callback,
            requestAccessToken: vi.fn(function (this: { callback: (r: unknown) => void }) {
              this.callback({ access_token: 'token-123', expires_in: 3600 });
            }),
          })),
          revoke: vi.fn(),
        },
      },
    } as unknown as Window['google'];

    await service.signIn();
    service.signOut();

    expect(service.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('nura.analytics-dashboard.session')).toBeNull();
  });
});
