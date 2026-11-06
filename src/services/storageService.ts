import { CareerExperience, AppSettings } from '../types';
import { DEFAULT_EXPERIENCES } from '../data/defaultExperiences';

const STORAGE_KEY_EXPERIENCES = 'offer_mode_experiences_v1';
const STORAGE_KEY_SETTINGS = 'offer_mode_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  timeFormat: '24h',
  soundEnabled: true,
  soundVolume: 0.35,
  currentSoundTheme: 'cyber_hum',
  vibrationOnMilestone: true,
  showMilliseconds: true,
  activeExperienceId: 'overview',
  isLockScreenActive: false,
  zenMode: false,
};

export const loadExperiences = (): CareerExperience[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXPERIENCES);
    if (!raw) return DEFAULT_EXPERIENCES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 5) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load experiences from localStorage', e);
  }
  return DEFAULT_EXPERIENCES;
};

export const saveExperiences = (experiences: CareerExperience[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_EXPERIENCES, JSON.stringify(experiences));
  } catch (e) {
    console.error('Failed to save experiences to localStorage', e);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings from localStorage', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
};

export const exportAppState = (experiences: CareerExperience[], settings: AppSettings): string => {
  return JSON.stringify({
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    experiences,
    settings,
  }, null, 2);
};

export const importAppState = (jsonString: string): { experiences: CareerExperience[]; settings: AppSettings } => {
  const data = JSON.parse(jsonString);
  if (!data.experiences || !Array.isArray(data.experiences)) {
    throw new Error('Invalid export file: missing experiences array');
  }
  return {
    experiences: data.experiences,
    settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
  };
};
