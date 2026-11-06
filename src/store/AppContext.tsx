import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CareerExperience,
  AppSettings,
  CountdownDesignPreset,
  ExperienceTrackId,
} from '../types';
import {
  loadExperiences,
  saveExperiences,
  loadSettings,
  saveSettings,
  loadDesignPresets,
  saveDesignPresets,
  exportAppState,
  importAppState,
} from '../services/storageService';
import { DEFAULT_EXPERIENCES, DEFAULT_DESIGN_PRESETS } from '../data/defaultExperiences';
import { soundEngine } from '../services/soundEngine';

interface AppContextValue {
  experiences: CareerExperience[];
  settings: AppSettings;
  presets: CountdownDesignPreset[];
  activeTrackId: ExperienceTrackId | 'overview';
  isLockScreenActive: boolean;
  lockScreenTrackId: ExperienceTrackId;
  setActiveTrackId: (id: ExperienceTrackId | 'overview') => void;
  openLockScreen: (trackId?: ExperienceTrackId) => void;
  closeLockScreen: () => void;
  updateExperience: (updated: CareerExperience) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  addDesignPreset: (preset: CountdownDesignPreset) => void;
  deleteDesignPreset: (id: string) => void;
  resetToDefaults: () => void;
  exportData: () => void;
  importData: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [experiences, setExperiences] = useState<CareerExperience[]>(loadExperiences);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [presets, setPresets] = useState<CountdownDesignPreset[]>(loadDesignPresets);
  const [activeTrackId, setActiveTrackId] = useState<ExperienceTrackId | 'overview'>('overview');
  const [isLockScreenActive, setIsLockScreenActive] = useState<boolean>(false);
  const [lockScreenTrackId, setLockScreenTrackId] = useState<ExperienceTrackId>('developer');

  // Auto-persist experiences
  useEffect(() => {
    saveExperiences(experiences);
  }, [experiences]);

  // Auto-persist settings & sync sound engine
  useEffect(() => {
    saveSettings(settings);
    soundEngine.setMuted(!settings.soundEnabled);
    soundEngine.setVolume(settings.soundVolume);
  }, [settings]);

  // Auto-persist presets
  useEffect(() => {
    saveDesignPresets(presets);
  }, [presets]);

  const openLockScreen = (trackId?: ExperienceTrackId) => {
    const chosen = trackId || (activeTrackId === 'overview' ? 'developer' : activeTrackId);
    setLockScreenTrackId(chosen);
    setIsLockScreenActive(true);
    soundEngine.playSuccessChime();
  };

  const closeLockScreen = () => {
    setIsLockScreenActive(false);
  };

  const updateExperience = (updated: CareerExperience) => {
    setExperiences((prev) => prev.map((exp) => (exp.id === updated.id ? updated : exp)));
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const addDesignPreset = (preset: CountdownDesignPreset) => {
    setPresets((prev) => [preset, ...prev]);
    soundEngine.playSuccessChime();
  };

  const deleteDesignPreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
    soundEngine.playKeyClick();
  };

  const resetToDefaults = () => {
    setExperiences(DEFAULT_EXPERIENCES);
    setPresets(DEFAULT_DESIGN_PRESETS);
    saveExperiences(DEFAULT_EXPERIENCES);
    saveDesignPresets(DEFAULT_DESIGN_PRESETS);
    soundEngine.playSuccessChime();
  };

  const exportData = () => {
    soundEngine.playSuccessChime();
    const json = exportAppState(experiences, settings, presets);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offer-mode-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const backup = importAppState(jsonString);
      setExperiences(backup.experiences);
      setSettings(backup.settings);
      setPresets(backup.presets);
      saveExperiences(backup.experiences);
      saveSettings(backup.settings);
      saveDesignPresets(backup.presets);
      soundEngine.playSuccessChime();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        experiences,
        settings,
        presets,
        activeTrackId,
        isLockScreenActive,
        lockScreenTrackId,
        setActiveTrackId,
        openLockScreen,
        closeLockScreen,
        updateExperience,
        updateSettings,
        addDesignPreset,
        deleteDesignPreset,
        resetToDefaults,
        exportData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};

