import React, { useState, useEffect } from 'react';
import { CareerExperience, AppSettings, ExperienceId } from './types';
import {
  loadExperiences,
  saveExperiences,
  loadSettings,
  saveSettings,
  exportAppState,
  importAppState
} from './services/storageService';
import { DEFAULT_EXPERIENCES } from './data/defaultExperiences';
import { soundEngine } from './services/soundEngine';
import { Navbar } from './components/common/Navbar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ExperienceDetailView } from './components/experiences/ExperienceDetailView';
import { LockScreenModal } from './components/lockscreen/LockScreenModal';

export const App: React.FC = () => {
  const [experiences, setExperiences] = useState<CareerExperience[]>(loadExperiences);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [activeTab, setActiveTab] = useState<ExperienceId | 'overview'>('overview');
  const [isLockScreenOpen, setIsLockScreenOpen] = useState(false);
  const [lockScreenTargetId, setLockScreenTargetId] = useState<string>('swe_faang');

  // Auto-save experiences on change
  useEffect(() => {
    saveExperiences(experiences);
  }, [experiences]);

  // Auto-save settings on change
  useEffect(() => {
    saveSettings(settings);
    soundEngine.setMuted(!settings.soundEnabled);
    soundEngine.setVolume(settings.soundVolume);
  }, [settings]);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        soundEngine.playSuccessChime();
        setIsLockScreenOpen(true);
      } else if (e.key === '0') {
        soundEngine.playKeyClick();
        setActiveTab('overview');
      } else if (['1', '2', '3', '4', '5'].includes(e.key) && !isLockScreenOpen) {
        const idx = parseInt(e.key) - 1;
        if (experiences[idx]) {
          soundEngine.playKeyClick();
          setActiveTab(experiences[idx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [experiences, isLockScreenOpen]);

  const handleUpdateExperience = (updated: CareerExperience) => {
    setExperiences(prev => prev.map(exp => exp.id === updated.id ? updated : exp));
  };

  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const handleLaunchLockScreen = (targetId?: string) => {
    const chosen = targetId || (activeTab === 'overview' ? 'swe_faang' : activeTab);
    setLockScreenTargetId(chosen);
    setIsLockScreenOpen(true);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all 5 career tracks back to initial factory demo data?')) {
      soundEngine.playSuccessChime();
      setExperiences(DEFAULT_EXPERIENCES);
      saveExperiences(DEFAULT_EXPERIENCES);
    }
  };

  const handleExportData = () => {
    soundEngine.playSuccessChime();
    const json = exportAppState(experiences, settings);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offer-mode-career-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = importAppState(content);
        setExperiences(imported.experiences);
        setSettings(imported.settings);
        saveExperiences(imported.experiences);
        saveSettings(imported.settings);
        soundEngine.playSuccessChime();
        alert('Career state backup imported successfully!');
      } catch (err: any) {
        alert('Failed to import file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const currentActiveExperience = experiences.find(exp => exp.id === activeTab);

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-black">
      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar
        experiences={experiences}
        activeId={activeTab}
        settings={settings}
        onSelectTab={setActiveTab}
        onOpenLockScreen={() => handleLaunchLockScreen()}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <OverviewDashboard
            experiences={experiences}
            settings={settings}
            onSelectExperience={(id) => setActiveTab(id as ExperienceId)}
            onLaunchLockScreen={handleLaunchLockScreen}
            onResetDefaults={handleResetDefaults}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        ) : currentActiveExperience ? (
          <ExperienceDetailView
            experience={currentActiveExperience}
            settings={settings}
            onUpdateExperience={handleUpdateExperience}
            onLaunchLockScreen={() => handleLaunchLockScreen(currentActiveExperience.id)}
          />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold">Track not found</h2>
            <button
              onClick={() => setActiveTab('overview')}
              className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs"
            >
              Back to Overview
            </button>
          </div>
        )}
      </main>

      {/* Sleek Minimalist Footer */}
      <footer className="border-t border-zinc-900 bg-black/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">OFFER MODE</span>
            <span>•</span>
            <span>5-Experience Career Countdown Workstation</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">L</kbd> for Lock Screen</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">1-5</kbd> Quick Switch</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">0</kbd> Overview</span>
          </div>
        </div>
      </footer>

      {/* Fullscreen Interactive Lock Screen Modal */}
      {isLockScreenOpen && (
        <LockScreenModal
          experiences={experiences}
          activeExperienceId={lockScreenTargetId}
          settings={settings}
          onClose={() => setIsLockScreenOpen(false)}
          onSelectExperience={(id) => setLockScreenTargetId(id)}
          onUpdateSettings={handleUpdateSettings}
        />
      )}
    </div>
  );
};
