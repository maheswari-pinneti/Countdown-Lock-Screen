import { CareerExperience, AppSettings, CountdownDesignPreset } from '../types';
import { DEFAULT_EXPERIENCES, DEFAULT_DESIGN_PRESETS } from '../data/defaultExperiences';
import { getStoredItem, setStoredItem } from '../utils/storage';

const STORAGE_KEY_EXPERIENCES = 'offer_mode_experiences_v2';
const STORAGE_KEY_SETTINGS = 'offer_mode_settings_v2';
const STORAGE_KEY_PRESETS = 'offer_mode_presets_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'dark',
  timeFormat: '24h',
  soundEnabled: true,
  soundVolume: 0.35,
  currentSoundTheme: 'cyber_hum',
  vibrationOnMilestone: true,
  showMilliseconds: true,
  activeTrackId: 'overview',
  isLockScreenActive: false,
  zenMode: false,
  activeDesignPresetId: 'preset-emerald-glass',
};

export const loadExperiences = (): CareerExperience[] => {
  const experiences = getStoredItem<CareerExperience[]>(STORAGE_KEY_EXPERIENCES, DEFAULT_EXPERIENCES);
  if (Array.isArray(experiences) && experiences.length === 5) {
    return experiences;
  }
  return DEFAULT_EXPERIENCES;
};

export const saveExperiences = (experiences: CareerExperience[]): void => {
  setStoredItem(STORAGE_KEY_EXPERIENCES, experiences);
};

export const loadSettings = (): AppSettings => {
  return getStoredItem<AppSettings>(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
};

export const saveSettings = (settings: AppSettings): void => {
  setStoredItem(STORAGE_KEY_SETTINGS, settings);
};

export const loadDesignPresets = (): CountdownDesignPreset[] => {
  return getStoredItem<CountdownDesignPreset[]>(STORAGE_KEY_PRESETS, DEFAULT_DESIGN_PRESETS);
};

export const saveDesignPresets = (presets: CountdownDesignPreset[]): void => {
  setStoredItem(STORAGE_KEY_PRESETS, presets);
};

export interface AppBackupData {
  version: string;
  exportDate: string;
  experiences: CareerExperience[];
  settings: AppSettings;
  presets: CountdownDesignPreset[];
}

export const exportAppState = (
  experiences: CareerExperience[],
  settings: AppSettings,
  presets: CountdownDesignPreset[]
): string => {
  const data: AppBackupData = {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    experiences,
    settings,
    presets,
  };
  return JSON.stringify(data, null, 2);
};

export const importAppState = (jsonString: string): AppBackupData => {
  const data = JSON.parse(jsonString) as Partial<AppBackupData>;
  if (!data.experiences || !Array.isArray(data.experiences)) {
    throw new Error('Invalid export file: missing experiences array');
  }
  return {
    version: data.version || '2.0.0',
    exportDate: data.exportDate || new Date().toISOString(),
    experiences: data.experiences,
    settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
    presets: Array.isArray(data.presets) ? data.presets : DEFAULT_DESIGN_PRESETS,
  };
};
