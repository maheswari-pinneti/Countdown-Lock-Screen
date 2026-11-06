import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../common/Icon';
import { soundEngine } from '../../services/soundEngine';
import { formatTime } from '../../utils/date';

interface TopNavProps {
  onToggleMobileSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleMobileSidebar }) => {
  const { settings, updateSettings, openLockScreen } = useAppStore();
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    updateSettings({ soundEnabled: next });
    soundEngine.setMuted(!next);
    if (next) soundEngine.playSuccessChime();
  };

  const toggleTimeFormat = () => {
    soundEngine.playKeyClick();
    updateSettings({
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

  // Derive current page title from pathname
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'Dashboard Overview';
      case '/interview': return 'Interview Countdown';
      case '/job-hunt': return '30-Day Job Hunt Sprint';
      case '/developer': return 'Developer Skill Upgrade';
      case '/first-job': return 'First Job Countdown';
      case '/career-switch': return 'Career Switch Countdown';
      case '/countdown-studio': return 'Countdown Design Studio';
      case '/my-lock-screens': return 'My Lock Screens';
      case '/saved-designs': return 'Saved Countdown Presets';
      case '/settings': return 'System Settings';
      default: return 'Career Workstation';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 w-full border-b border-[#1E293B]/80 bg-[#070B14]/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#0F172A] border border-[#1E293B]"
          title="Open Navigation"
        >
          <Icon name="Layers" className="w-5 h-5 text-cyan-400" />
        </button>

        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold hidden sm:block">
            OFFER MODE SYSTEM
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {getPageTitle(location.pathname)}
          </h2>
        </div>
      </div>

      {/* Right: Wall Clock & Actions */}
      <div className="flex items-center gap-3">
        {/* Wall Clock */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs font-mono text-zinc-300">
          <Icon name="Clock" className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatTime(time, settings.timeFormat)}</span>
        </div>

        {/* Time format button */}
        <button
          onClick={toggleTimeFormat}
          className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#141E33] border border-[#1E293B] text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Toggle 12h/24h"
        >
          {settings.timeFormat}
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-[#0F172A] hover:bg-[#141E33] border border-[#1E293B] text-zinc-400 hover:text-zinc-200 transition-colors"
          title={settings.soundEnabled ? 'Mute generative audio' : 'Enable sound'}
        >
          <Icon name={settings.soundEnabled ? 'Volume2' : 'VolumeX'} className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2 rounded-xl bg-[#0F172A] hover:bg-[#141E33] border border-[#1E293B] text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Fullscreen (F)"
        >
          <Icon name="Maximize" className="w-4 h-4" />
        </button>

        {/* Lock Screen Primary Trigger */}
        <button
          onClick={() => {
            soundEngine.playSuccessChime();
            openLockScreen('developer');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] active:scale-95"
          title="Activate Fullscreen Lock Screen Mode (Hotkeys: 'L')"
        >
          <Icon name="Lock" className="w-3.5 h-3.5 fill-black" />
          <span className="hidden sm:inline">Offer Mode</span>
          <span>Lock</span>
        </button>
      </div>
    </header>
  );
};
