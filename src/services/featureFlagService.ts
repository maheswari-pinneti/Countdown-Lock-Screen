/**
 * Feature Flag & Environment Configuration Service for OFFER MODE
 * Allows toggling capabilities dynamically with local persistence.
 */

export interface FeatureFlags {
  enableWebAuthn: boolean;
  enableAudioEngine: boolean;
  enableServiceWorker: boolean;
  enableCalendarSync: boolean;
  enableQuietHours: boolean;
  enableGlobalSearch: boolean;
  enableHighContrastTheme: boolean;
}

const STORAGE_FLAGS_KEY = 'offer_mode_feature_flags_v1';

const DEFAULT_FLAGS: FeatureFlags = {
  enableWebAuthn: true,
  enableAudioEngine: true,
  enableServiceWorker: true,
  enableCalendarSync: true,
  enableQuietHours: true,
  enableGlobalSearch: true,
  enableHighContrastTheme: false,
};

class FeatureFlagService {
  private static instance: FeatureFlagService;

  private constructor() {}

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  public getFlags(): FeatureFlags {
    try {
      const raw = localStorage.getItem(STORAGE_FLAGS_KEY);
      return raw ? { ...DEFAULT_FLAGS, ...JSON.parse(raw) } : DEFAULT_FLAGS;
    } catch {
      return DEFAULT_FLAGS;
    }
  }

  public isEnabled(key: keyof FeatureFlags): boolean {
    return this.getFlags()[key];
  }

  public setFlag(key: keyof FeatureFlags, value: boolean): void {
    try {
      const current = this.getFlags();
      const updated = { ...current, [key]: value };
      localStorage.setItem(STORAGE_FLAGS_KEY, JSON.stringify(updated));
    } catch {}
  }

  public resetFlags(): void {
    try {
      localStorage.removeItem(STORAGE_FLAGS_KEY);
    } catch {}
  }
}

export const featureFlagService = FeatureFlagService.getInstance();
