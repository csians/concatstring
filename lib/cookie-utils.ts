import Cookies from 'js-cookie';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  socialMedia: boolean;
}

export const COOKIE_CATEGORIES = {
  NECESSARY: 'necessary',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  SOCIAL_MEDIA: 'socialMedia',
} as const;

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true, // Always true, can't be disabled
  analytics: false,
  marketing: false,
  socialMedia: false,
};

export interface CookieInfo {
  name: string;
  category: keyof CookiePreferences;
  purpose: string;
  duration: string;
  provider?: string;
}

export const COOKIE_DETAILS: CookieInfo[] = [
  // Necessary Cookies
  {
    name: 'cookie-consent',
    category: 'necessary',
    purpose: 'Stores your cookie consent preferences',
    duration: '1 year',
  },
  {
    name: 'cookie-preferences',
    category: 'necessary',
    purpose: 'Remembers your detailed cookie settings',
    duration: '1 year',
  },
  {
    name: 'session-id',
    category: 'necessary',
    purpose: 'Maintains your session while browsing',
    duration: 'Session',
  },
  
  // Analytics Cookies
  {
    name: '_ga',
    category: 'analytics',
    purpose: 'Google Analytics - distinguishes users',
    duration: '2 years',
    provider: 'Google',
  },
  {
    name: '_gid',
    category: 'analytics',
    purpose: 'Google Analytics - distinguishes users',
    duration: '24 hours',
    provider: 'Google',
  },
  {
    name: '_gat',
    category: 'analytics',
    purpose: 'Google Analytics - throttles request rate',
    duration: '1 minute',
    provider: 'Google',
  },
  
  // Marketing Cookies
  {
    name: '_fbp',
    category: 'marketing',
    purpose: 'Facebook Pixel - tracks conversions',
    duration: '3 months',
    provider: 'Facebook',
  },
  {
    name: 'ads-id',
    category: 'marketing',
    purpose: 'Google Ads - tracks ad performance',
    duration: '2 years',
    provider: 'Google',
  },
  
  // Social Media Cookies
  {
    name: 'twitter-id',
    category: 'socialMedia',
    purpose: 'Twitter integration and sharing',
    duration: '2 years',
    provider: 'Twitter',
  },
  {
    name: 'linkedin-id',
    category: 'socialMedia',
    purpose: 'LinkedIn integration and sharing',
    duration: '2 years',
    provider: 'LinkedIn',
  },
  
];

export class CookieManager {
  private static readonly CONSENT_KEY = 'cookie-consent';
  private static readonly PREFERENCES_KEY = 'cookie-preferences';

  /**
   * Check if user has given consent
   */
  static hasConsent(): boolean {
    return !!Cookies.get(this.CONSENT_KEY);
  }

  /**
   * Get user's consent status
   */
  static getConsentStatus(): 'accepted' | 'declined' | null {
    return Cookies.get(this.CONSENT_KEY) as 'accepted' | 'declined' | null;
  }

  /**
   * Set user's consent
   */
  static setConsent(status: 'accepted' | 'declined'): void {
    Cookies.set(this.CONSENT_KEY, status, { expires: 365 });
  }

  /**
   * Get user's cookie preferences
   */
  static getPreferences(): CookiePreferences {
    const stored = Cookies.get(this.PREFERENCES_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_COOKIE_PREFERENCES, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_COOKIE_PREFERENCES;
      }
    }
    return DEFAULT_COOKIE_PREFERENCES;
  }

  /**
   * Set user's cookie preferences
   */
  static setPreferences(preferences: Partial<CookiePreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    Cookies.set(this.PREFERENCES_KEY, JSON.stringify(updated), { expires: 365 });
  }

  /**
   * Check if a specific cookie category is allowed
   */
  static isCategoryAllowed(category: keyof CookiePreferences): boolean {
    const preferences = this.getPreferences();
    return preferences[category];
  }

  /**
   * Set a cookie with category checking
   */
  static setCookie(
    name: string,
    value: string,
    options: {
      category: keyof CookiePreferences;
      expires?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    }
  ): void {
    if (this.isCategoryAllowed(options.category)) {
      const { category, ...cookieOptions } = options;
      Cookies.set(name, value, cookieOptions);
    }
  }

  /**
   * Get a cookie
   */
  static getCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  /**
   * Remove a cookie
   */
  static removeCookie(name: string, options?: { path?: string; domain?: string }): void {
    Cookies.remove(name, options);
  }

  /**
   * Clear all non-necessary cookies
   */
  static clearNonNecessaryCookies(): void {
    const preferences = this.getPreferences();
    const allCookies = Cookies.get();
    
    Object.keys(allCookies).forEach(cookieName => {
      // Don't remove necessary cookies and consent cookies
      if (
        cookieName !== this.CONSENT_KEY &&
        cookieName !== this.PREFERENCES_KEY &&
        !this.isNecessaryCookie(cookieName)
      ) {
        Cookies.remove(cookieName);
      }
    });
  }

  /**
   * Check if a cookie is necessary (always allowed)
   */
  private static isNecessaryCookie(name: string): boolean {
    const necessaryCookies = [
      'cookie-consent',
      'cookie-preferences',
      // Add other necessary cookie names here
    ];
    return necessaryCookies.includes(name);
  }

  /**
   * Initialize analytics cookies if allowed
   */
  static initializeAnalytics(): void {
    if (this.isCategoryAllowed('analytics')) {
      // Initialize Google Analytics or other analytics tools here
      console.log('Analytics cookies initialized');
    }
  }

  /**
   * Initialize marketing cookies if allowed
   */
  static initializeMarketing(): void {
    if (this.isCategoryAllowed('marketing')) {
      // Initialize marketing tools here
      console.log('Marketing cookies initialized');
    }
  }
}
