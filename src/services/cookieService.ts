/**
 * Browser Cookie Management & Consent Service
 * Handles client-side cookies with Secure, SameSite=Lax, and Max-Age attributes.
 * Includes GDPR/Privacy compliance state management for essential and preference cookies.
 */

export interface CookiePreferences {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  timestamp: string;
}

const COOKIE_CONSENT_KEY = 'offer_mode_cookie_consent_v1';
const USER_SESSION_COOKIE = 'offer_mode_session_id';

export class CookieService {
  private static instance: CookieService;

  private constructor() {}

  public static getInstance(): CookieService {
    if (!CookieService.instance) {
      CookieService.instance = new CookieService();
    }
    return CookieService.instance;
  }

  /**
   * Set a cookie with secure defaults
   */
  public setCookie(name: string, value: string, days: number = 365): void {
    if (typeof document === 'undefined') return;

    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }

    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';

    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}${expires}; path=/; SameSite=Lax${secureFlag}`;
  }

  /**
   * Retrieve a cookie by name
   */
  public getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  /**
   * Delete a cookie
   */
  public deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=; Max-Age=-99999999; path=/; SameSite=Lax`;
  }

  /**
   * Retrieve stored cookie preferences (checks both cookie and localStorage fallback)
   */
  public getPreferences(): CookiePreferences | null {
    let raw = this.getCookie(COOKIE_CONSENT_KEY);

    // LocalStorage fallback for environments with strict cookie sandboxing or localhost
    if (!raw && typeof window !== 'undefined' && window.localStorage) {
      try {
        raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      } catch {}
    }

    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Check if user has answered the cookie consent prompt
   */
  public hasConsent(): boolean {
    return this.getPreferences() !== null;
  }

  /**
   * Save user cookie preferences to both Document Cookie and LocalStorage
   */
  public savePreferences(prefs: Partial<CookiePreferences>): CookiePreferences {
    const fullPrefs: CookiePreferences = {
      essential: true, // Always true
      preferences: prefs.preferences ?? true,
      analytics: prefs.analytics ?? false,
      timestamp: new Date().toISOString(),
    };

    const serialized = JSON.stringify(fullPrefs);

    // 1. Save to Cookie
    this.setCookie(COOKIE_CONSENT_KEY, serialized, 365);

    // 2. Save to LocalStorage fallback
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(COOKIE_CONSENT_KEY, serialized);
      } catch {}
    }

    // Initialize an anonymous local session ID if consent granted
    if (!this.getCookie(USER_SESSION_COOKIE)) {
      const sessionId = 'om_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      this.setCookie(USER_SESSION_COOKIE, sessionId, 30);
    }

    return fullPrefs;
  }

  /**
   * Accept all cookies
   */
  public acceptAll(): CookiePreferences {
    return this.savePreferences({ essential: true, preferences: true, analytics: false });
  }

  /**
   * Accept essential cookies only
   */
  public acceptEssential(): CookiePreferences {
    return this.savePreferences({ essential: true, preferences: false, analytics: false });
  }
}

export const cookieService = CookieService.getInstance();

