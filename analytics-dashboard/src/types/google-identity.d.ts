// Minimal typings for the Google Identity Services (GIS) token client.
// https://developers.google.com/identity/oauth2/web/reference/js-reference
export {};

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: GoogleTokenResponse) => void;
}

interface GoogleRequestAccessTokenOptions {
  prompt?: '' | 'none' | 'consent' | 'select_account';
}

interface GoogleTokenClient {
  callback: (response: GoogleTokenResponse) => void;
  requestAccessToken(overrideConfig?: GoogleRequestAccessTokenOptions): void;
}

interface GoogleAccountsOAuth2 {
  initTokenClient(config: GoogleTokenClientConfig): GoogleTokenClient;
  revoke(accessToken: string, done?: () => void): void;
}

interface GoogleIdentityServices {
  accounts: {
    oauth2: GoogleAccountsOAuth2;
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
    __env?: {
      GOOGLE_CLIENT_ID?: string;
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace google.accounts.oauth2 {
    type TokenResponse = GoogleTokenResponse;
    type TokenClient = GoogleTokenClient;
  }
}
