import React from 'react';
import { CareerExperience, AppSettings, ExperienceId } from '../../types';
import { ExperienceIcon } from './ExperienceIcon';
import { soundEngine } from '../../services/soundEngine';
import {
  Lock,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Layers,
  Flame,
  Maximize,
  Minimize
} from 'lucide-react';

interface Props {
  experiences: CareerExperience[];
  activeId: ExperienceId | 'overview';
  settings: AppSettings;
  onSelectTab: (id: ExperienceId | 'overview') => void;
  onOpenLockScreen: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const Navbar: React.FC<Props> = ({
  experiences,
  activeId,
  settings,
  onSelectTab,
  onOpenLockScreen,
  onUpdateSettings,
}) => {
  const toggleSound = () => {
    const next = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: next });
    soundEngine.setMuted(!next);
    if (next) {
      soundEngine.playSuccessChime();
    }
  };

  const toggleTimeFormat = () => {
    soundEngine.playKeyClick();
    onUpdateSettings({
      timeFormat: settings.timeFormat === '12h' ? '24h' : '12h',
    });
  };

  const toggleFullscreen = () => {
    soundEngine.playKeyClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-black/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onSelectTab('overview');
            }}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-widest text-white uppercase font-display">
                  OFFER MODE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-zinc-500 font-mono tracking-tight block">
                5-TRACK CAREER WORKSTATION
              </span>
            </div>
          </button>
        </div>

        {/* Center: Experience Navigation Tabs (desktop) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onSelectTab('overview');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeId === 'overview'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            Overview
          </button>

          {experiences.map((exp) => {
            const isActive = activeId === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => {
                  soundEngine.playKeyClick();
                  onSelectTab(exp.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <ExperienceIcon
                  name={exp.icon}
                  className="w-3.5 h-3.5"
                  style={{ color: exp.theme.primary }}
                />
                <span>{exp.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Lock Screen Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Time format */}
          <button
            onClick={toggleTimeFormat}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all"
            title="Toggle 12h / 24h Clock"
          >
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{settings.timeFormat}</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
            title={settings.soundEnabled ? 'Mute generative audio' : 'Enable sound'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
            title="Toggle Fullscreen (F)"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Big Lock Screen CTA */}
          <button
            onClick={() => {
              soundEngine.playSuccessChime();
              onOpenLockScreen();
            }}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95"
            title="Activate Fullscreen Lock Screen Mode (Hotkeys: 'L' or 'Space')"
          >
            <Lock className="w-3.5 h-3.5 fill-black" />
            <span className="hidden sm:inline">Offer Mode</span>
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Mobile Experience Nav Scroller */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-zinc-900 bg-black/90 scrollbar-none">
        <button
          onClick={() => { soundEngine.playKeyClick(); onSelectTab('overview'); }}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeId === 'overview' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
          }`}
        >
          Overview
        </button>
        {experiences.map((exp) => (
          <button
            key={exp.id}
            onClick={() => { soundEngine.playKeyClick(); onSelectTab(exp.id); }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeId === exp.id ? 'bg-zinc-800 text-white' : 'text-zinc-500'
            }`}
          >
            <ExperienceIcon name={exp.icon} className="w-3 h-3" style={{ color: exp.theme.primary }} />
            <span>{exp.badge}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

