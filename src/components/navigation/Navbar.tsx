import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../common/Icon';
import { soundEngine } from '../../services/soundEngine';

export const Navbar: React.FC = () => {
  const { experiences, settings, updateSettings, openLockScreen } = useAppStore();
  const navigate = useNavigate();

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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-black/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6 shrink-0">
          <NavLink
            to="/"
            onClick={() => soundEngine.playKeyClick()}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <Icon name="Sparkles" className="w-5 h-5" />
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
          </NavLink>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <NavLink
            to="/"
            end
            onClick={() => soundEngine.playKeyClick()}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`
            }
          >
            Overview
          </NavLink>

          {experiences.map((exp) => (
            <NavLink
              key={exp.id}
              to={exp.route}
              onClick={() => soundEngine.playKeyClick()}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`
              }
            >
              <Icon name={exp.icon} className="w-3.5 h-3.5" style={{ color: exp.theme.primary }} />
              <span>{exp.name.split(' ')[0]}</span>
            </NavLink>
          ))}

          <span className="w-px h-4 bg-zinc-800 mx-1" />

          <NavLink
            to="/countdown-studio"
            onClick={() => soundEngine.playKeyClick()}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`
            }
          >
            <Icon name="Palette" className="w-3.5 h-3.5 text-cyan-400" />
            <span>Studio</span>
          </NavLink>

          <NavLink
            to="/milestones"
            onClick={() => soundEngine.playKeyClick()}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`
            }
          >
            <Icon name="CheckCircle2" className="w-3.5 h-3.5 text-amber-400" />
            <span>Milestones</span>
          </NavLink>
        </nav>

        {/* Right Action Icons & Lock Screen Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTimeFormat}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all"
            title="Toggle 12h / 24h Clock"
          >
            <Icon name="Clock" className="w-3.5 h-3.5 text-zinc-400" />
            <span>{settings.timeFormat}</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
            title={settings.soundEnabled ? 'Mute generative audio' : 'Enable sound'}
          >
            <Icon name={settings.soundEnabled ? 'Volume2' : 'VolumeX'} className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
            title="Toggle Fullscreen (F)"
          >
            <Icon name="Maximize" className="w-4 h-4" />
          </button>

          <button
            onClick={() => openLockScreen()}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95"
            title="Activate Fullscreen Lock Screen Mode (Hotkeys: 'L' or 'Space')"
          >
            <Icon name="Lock" className="w-3.5 h-3.5 fill-black" />
            <span className="hidden sm:inline">Offer Mode</span>
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Links Scroller */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-zinc-900 bg-black/90 scrollbar-none">
        <NavLink
          to="/"
          end
          onClick={() => soundEngine.playKeyClick()}
          className={({ isActive }) =>
            `px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`
          }
        >
          Overview
        </NavLink>

        {experiences.map((exp) => (
          <NavLink
            key={exp.id}
            to={exp.route}
            onClick={() => soundEngine.playKeyClick()}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400'
              }`
            }
          >
            <Icon name={exp.icon} className="w-3 h-3" style={{ color: exp.theme.primary }} />
            <span>{exp.badge}</span>
          </NavLink>
        ))}

        <NavLink
          to="/countdown-studio"
          onClick={() => soundEngine.playKeyClick()}
          className={({ isActive }) =>
            `px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`
          }
        >
          Studio
        </NavLink>
      </div>
    </header>
  );
};
