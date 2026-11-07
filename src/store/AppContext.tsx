import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CareerExperience,
  AppSettings,
  CountdownDesignPreset,
  ExperienceTrackId,
  UserProfile,
  PasskeyRecord,
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
import { passkeyService } from '../services/passkeyService';

const USER_STORAGE_KEY = 'offer_mode_current_user_v1';

export const DEMO_USER: UserProfile = {
  id: 'usr_demo_1',
  name: 'Alex Morgan',
  email: 'alex@offermode.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
  hasPasskey: true,
  passkeyRegisteredAt: '2026-11-01T10:00:00Z',
  passkeyName: 'Biometric Device Passkey',
  createdAt: '2026-11-01T10:00:00Z',
};

function loadStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

interface AppContextValue {
  experiences: CareerExperience[];
  settings: AppSettings;
  presets: CountdownDesignPreset[];
  activeTrackId: ExperienceTrackId | 'overview';
  isLockScreenActive: boolean;
  lockScreenTrackId: ExperienceTrackId;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  passkeys: PasskeyRecord[];
  activePasskeyPromptProject: {
    trackId: ExperienceTrackId;
    title: string;
    onSuccess?: () => void;
  } | null;
  setActiveTrackId: (id: ExperienceTrackId | 'overview') => void;
  openLockScreen: (trackId?: ExperienceTrackId) => void;
  closeLockScreen: () => void;
  updateExperience: (updated: CareerExperience) => void;
  resetExperience: (trackId: ExperienceTrackId) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  addDesignPreset: (preset: CountdownDesignPreset) => void;
  deleteDesignPreset: (id: string) => void;
  resetToDefaults: () => void;
  exportData: () => void;
  importData: (jsonString: string) => boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPasskey: (email?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password?: string,
    registerPasskey?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  registerUserPasskey: () => Promise<{ success: boolean; error?: string }>;
  isProjectProtectedWithPasskey: (trackId: ExperienceTrackId) => boolean;
  toggleProjectPasskeyProtection: (trackId: ExperienceTrackId) => void;
  isProjectUnlockedInSession: (trackId: ExperienceTrackId) => boolean;
  promptUnlockProject: (trackId: ExperienceTrackId, title: string, onSuccess?: () => void) => void;
  closePasskeyPrompt: () => void;
  confirmUnlockProject: (trackId: ExperienceTrackId) => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [experiences, setExperiences] = useState<CareerExperience[]>(loadExperiences);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [presets, setPresets] = useState<CountdownDesignPreset[]>(loadDesignPresets);
  const [activeTrackId, setActiveTrackId] = useState<ExperienceTrackId | 'overview'>('overview');
  const [isLockScreenActive, setIsLockScreenActive] = useState<boolean>(false);
  const [lockScreenTrackId, setLockScreenTrackId] = useState<ExperienceTrackId>('developer');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(loadStoredUser);
  const [passkeys, setPasskeys] = useState<PasskeyRecord[]>(() => passkeyService.getStoredPasskeys());
  const [activePasskeyPromptProject, setActivePasskeyPromptProject] = useState<{
    trackId: ExperienceTrackId;
    title: string;
    onSuccess?: () => void;
  } | null>(null);
  const [unlockedProjectsNonce, setUnlockedProjectsNonce] = useState(0);

  // Initialize demo passkey if none exist
  useEffect(() => {
    const existing = passkeyService.getStoredPasskeys();
    if (existing.length === 0 && currentUser) {
      passkeyService.registerPasskey({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
      }).then(() => {
        setPasskeys(passkeyService.getStoredPasskeys());
      });
    }
  }, [currentUser]);

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

  // Auto-persist user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

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

  const resetExperience = (trackId: ExperienceTrackId) => {
    const defaultExp = DEFAULT_EXPERIENCES.find((e) => e.id === trackId);
    if (!defaultExp) return;
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === trackId ? JSON.parse(JSON.stringify(defaultExp)) : exp))
    );
    soundEngine.playSuccessChime();
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

  // Authentication: Email/Password Login
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const storedPasskeys = passkeyService.getStoredPasskeys();
    const hasRegisteredPasskey = storedPasskeys.some(
      (p) => p.userEmail.toLowerCase() === email.toLowerCase()
    );

    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      hasPasskey: hasRegisteredPasskey,
      passkeyName: hasRegisteredPasskey ? 'Verified Device Passkey' : undefined,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    soundEngine.playSuccessChime();
    return { success: true };
  };

  // Authentication: Passkey Login
  const loginWithPasskey = async (
    email?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await passkeyService.authenticateWithPasskey(email);
    if (!res.success || !res.record) {
      return { success: false, error: res.error || 'Passkey verification failed.' };
    }

    const user: UserProfile = {
      id: res.record.userId,
      email: res.record.userEmail,
      name: res.record.userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      hasPasskey: true,
      passkeyRegisteredAt: res.record.createdAt,
      passkeyName: res.record.name,
      createdAt: res.record.createdAt,
    };

    setCurrentUser(user);
    setPasskeys(passkeyService.getStoredPasskeys());
    soundEngine.playSuccessChime();
    return { success: true };
  };

  // Authentication: Signup
  const signup = async (
    name: string,
    email: string,
    password?: string,
    registerPasskey: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Please enter your name.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      hasPasskey: false,
      createdAt: new Date().toISOString(),
    };

    if (registerPasskey) {
      const passkeyResult = await passkeyService.registerPasskey({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      });
      if (passkeyResult.success && passkeyResult.record) {
        newUser.hasPasskey = true;
        newUser.passkeyRegisteredAt = passkeyResult.record.createdAt;
        newUser.passkeyName = passkeyResult.record.name;
        setPasskeys(passkeyService.getStoredPasskeys());
      }
    }

    setCurrentUser(newUser);
    soundEngine.playSuccessChime();
    return { success: true };
  };

  // Sign out
  const logout = () => {
    setCurrentUser(null);
    soundEngine.playKeyClick();
  };

  // Register Passkey for active user
  const registerUserPasskey = async (): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'Please sign in first.' };
    }
    const result = await passkeyService.registerPasskey({
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
    });
    if (result.success && result.record) {
      setCurrentUser({
        ...currentUser,
        hasPasskey: true,
        passkeyRegisteredAt: result.record.createdAt,
        passkeyName: result.record.name,
      });
      setPasskeys(passkeyService.getStoredPasskeys());
      soundEngine.playSuccessChime();
      return { success: true };
    }
    return { success: false, error: result.error || 'Failed to register passkey.' };
  };

  // Check if project has passkey protection
  const isProjectProtectedWithPasskey = (trackId: ExperienceTrackId): boolean => {
    return passkeyService.isProjectProtected(trackId);
  };

  // Toggle passkey protection on a project
  const toggleProjectPasskeyProtection = (trackId: ExperienceTrackId) => {
    const currentState = passkeyService.isProjectProtected(trackId);
    passkeyService.setProjectProtection(trackId, !currentState);
    setUnlockedProjectsNonce((prev) => prev + 1);
    soundEngine.playSuccessChime();
  };

  // Check if project is unlocked in session
  const isProjectUnlockedInSession = (trackId: ExperienceTrackId): boolean => {
    // Referencing unlockedProjectsNonce forces re-render when state changes
    void unlockedProjectsNonce;
    return passkeyService.isProjectUnlocked(trackId);
  };

  // Open unlock prompt for project
  const promptUnlockProject = (
    trackId: ExperienceTrackId,
    title: string,
    onSuccess?: () => void
  ) => {
    if (isProjectUnlockedInSession(trackId)) {
      if (onSuccess) onSuccess();
      return;
    }
    setActivePasskeyPromptProject({ trackId, title, onSuccess });
    soundEngine.playKeyClick();
  };

  // Close unlock prompt
  const closePasskeyPrompt = () => {
    setActivePasskeyPromptProject(null);
  };

  // Confirm and verify passkey unlock for a project
  const confirmUnlockProject = async (trackId: ExperienceTrackId): Promise<boolean> => {
    const res = await passkeyService.authenticateWithPasskey(currentUser?.email);
    if (res.success) {
      passkeyService.unlockProject(trackId);
      setUnlockedProjectsNonce((prev) => prev + 1);
      soundEngine.playSuccessChime();
      if (activePasskeyPromptProject?.onSuccess) {
        activePasskeyPromptProject.onSuccess();
      }
      setActivePasskeyPromptProject(null);
      return true;
    }
    return false;
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
        currentUser,
        isAuthenticated: !!currentUser,
        passkeys,
        activePasskeyPromptProject,
        setActiveTrackId,
        openLockScreen,
        closeLockScreen,
        updateExperience,
        resetExperience,
        updateSettings,
        addDesignPreset,
        deleteDesignPreset,
        resetToDefaults,
        exportData,
        importData,
        login,
        loginWithPasskey,
        signup,
        logout,
        registerUserPasskey,
        isProjectProtectedWithPasskey,
        toggleProjectPasskeyProtection,
        isProjectUnlockedInSession,
        promptUnlockProject,
        closePasskeyPrompt,
        confirmUnlockProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const DEFAULT_APP_CONTEXT_VALUE: AppContextValue = {
  experiences: DEFAULT_EXPERIENCES,
  settings: {
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
  },
  presets: DEFAULT_DESIGN_PRESETS,
  activeTrackId: 'overview',
  isLockScreenActive: false,
  lockScreenTrackId: 'developer',
  currentUser: DEMO_USER,
  isAuthenticated: true,
  passkeys: [],
  activePasskeyPromptProject: null,
  setActiveTrackId: () => {},
  openLockScreen: () => {},
  closeLockScreen: () => {},
  updateExperience: () => {},
  resetExperience: () => {},
  updateSettings: () => {},
  addDesignPreset: () => {},
  deleteDesignPreset: () => {},
  resetToDefaults: () => {},
  exportData: () => {},
  importData: () => false,
  login: async () => ({ success: true }),
  loginWithPasskey: async () => ({ success: true }),
  signup: async () => ({ success: true }),
  logout: () => {},
  registerUserPasskey: async () => ({ success: true }),
  isProjectProtectedWithPasskey: () => false,
  toggleProjectPasskeyProtection: () => {},
  isProjectUnlockedInSession: () => true,
  promptUnlockProject: () => {},
  closePasskeyPrompt: () => {},
  confirmUnlockProject: async () => true,
};

export const useAppStore = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    console.warn('[OFFER MODE] useAppStore invoked outside of AppProvider; providing resilient fallback state.');
    return DEFAULT_APP_CONTEXT_VALUE;
  }
  return context;
};
