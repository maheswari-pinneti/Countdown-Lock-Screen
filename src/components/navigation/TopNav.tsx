import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../common/Icon';
import { soundEngine } from '../../services/soundEngine';
import { formatTime } from '../../utils/date';

interface TopNavProps {
  onToggleMobileSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleMobileSidebar }) => {
  const { settings, updateSettings, openLockScreen, currentUser, logout } = useAppStore();
  const [time, setTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();

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
      case '/login': return 'Sign In';
      case '/signup': return 'Create Account';
      case '/countdowns':
      case '/my-lock-screens': return 'My Countdowns & Lock Screens';
      case '/life': return 'Routines & Anti-Guilt Habits';
      case '/journal': return 'Private Journal & Mindset Vault';
      case '/planner': return 'Smart Daily Planner & MITs';
      case '/focus': return 'Deep Work Focus Hub & Ambient Audio';
      case '/learning': return 'Career Learning Center & Roadmaps';
      case '/finance': return 'Personal Finance & Career Runway';
      case '/dreams': return 'Dreams, Bucket List & Adventures';
      case '/second-brain': return 'Personal Second Brain (P.A.R.A.)';
      case '/interview': return 'Interview Countdown';
      case '/job-hunt': return '30-Day Job Hunt Sprint';
      case '/developer': return 'Developer Skill Upgrade';
      case '/first-job': return 'First Job Countdown';
      case '/career-switch': return 'Career Switch Countdown';
      case '/countdown-studio': return 'Countdown Design Studio';
      case '/saved-designs': return 'Saved Presets';
      case '/showcase': return 'Showcase & Benefits';
      case '/directory':
      case '/employees': return 'Career Directory';
      case '/notifications': return 'Notifications & Reminders';
      case '/settings': return 'Settings';
      case '/docs':
      case '/help':
      case '/about': return 'Help & Documentation';
      default: return 'Career Countdown';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
          title="Open Navigation"
        >
          <Icon name="Layers" className="w-5 h-5 text-indigo-400" />
        </button>

        <div>
          <div className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5 hidden sm:flex">
            <span>Welcome back</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400 font-normal">Personal Countdown Hub</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {getPageTitle(location.pathname)}
          </h2>
        </div>
      </div>

      {/* Right: Wall Clock, Passkey Profile & Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Global Spotlight / Command Bar Trigger */}
        <button
          onClick={() => {
            soundEngine.playKeyClick();
            window.dispatchEvent(new CustomEvent('open-global-command-bar'));
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-all group shadow-sm"
          title="Search Command Center (Ctrl+K or ⌘K)"
        >
          <Icon name="Search" className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300" />
          <span className="hidden md:inline text-slate-400 group-hover:text-slate-200">Search...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Career Personas Directory Pill */}
        <button
          onClick={() => {
            soundEngine.playKeyClick();
            window.dispatchEvent(new CustomEvent('open-career-personas-modal'));
          }}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-indigo-500/20 text-xs text-indigo-200 font-medium transition-colors"
          title="Explore Career Personas"
        >
          <Icon name="Users" className="w-3.5 h-3.5 text-indigo-400" />
          <span>Career Tracks</span>
        </button>

        {/* Wall Clock Display */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <Icon name="Clock" className="w-3.5 h-3.5 text-indigo-400" />
          <span className="tabular-nums font-medium">{formatTime(time, settings.timeFormat)}</span>
        </div>

        {/* Time format button */}
        <button
          onClick={toggleTimeFormat}
          className="hidden sm:flex px-2 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-colors tabular-nums font-medium"
          title="Toggle 12h/24h"
        >
          {settings.timeFormat}
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title={settings.soundEnabled ? 'Mute audio' : 'Enable sound'}
        >
          <Icon name={settings.soundEnabled ? 'Volume2' : 'VolumeX'} className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Fullscreen (F)"
        >
          <Icon name="Maximize" className="w-4 h-4" />
        </button>

        {/* User Account / Passkey Auth Status */}
        {currentUser ? (
          <div className="flex items-center gap-1.5 p-1 pl-2.5 pr-1.5 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-xs text-white">
            <span className="font-medium hidden md:inline truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
            {currentUser.hasPasskey && (
              <span
                className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400"
                title="Passkey Protected Account"
              >
                <Icon name="Fingerprint" className="w-3 h-3" />
              </span>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <Icon name="LogOut" className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={() => soundEngine.playKeyClick()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-colors"
          >
            <Icon name="LogIn" className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sign In</span>
          </Link>
        )}

        {/* Lock Screen Primary Trigger with Warm Gradient */}
        <button
          onClick={() => {
            soundEngine.playSuccessChime();
            openLockScreen('developer');
          }}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-xs tracking-normal transition-all shadow-md shadow-indigo-500/20 active:scale-95"
          title="Start Distraction-Free Lock Screen (Press 'L')"
        >
          <Icon name="Lock" className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Focus Mode</span>
          <span className="px-1 py-0.2 text-[10px] bg-white/20 rounded font-normal">L</span>
        </button>
      </div>
    </header>
  );
};
