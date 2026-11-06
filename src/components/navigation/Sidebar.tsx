import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../common/Icon';
import { soundEngine } from '../../services/soundEngine';
import { useAppStore } from '../../store/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

const SIDEBAR_ITEMS: NavItem[] = [
  { title: 'Overview', path: '/', icon: 'LayoutDashboard' },
  { title: 'Interview Countdown', path: '/interview', icon: 'calendar-check', badge: 'Quant' },
  { title: 'Job Hunt Sprint', path: '/job-hunt', icon: 'briefcase-business', badge: '30d' },
  { title: 'Developer Upgrade', path: '/developer', icon: 'code', badge: 'Staff' },
  { title: 'First Job Countdown', path: '/first-job', icon: 'graduation-cap' },
  { title: 'Career Switch', path: '/career-switch', icon: 'arrow-left-right', badge: 'Nomad' },
  { title: 'Countdown Studio', path: '/countdown-studio', icon: 'Palette' },
  { title: 'My Lock Screens', path: '/my-lock-screens', icon: 'Lock' },
  { title: 'Saved Designs', path: '/saved-designs', icon: 'Layout' },
  { title: 'Settings', path: '/settings', icon: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { openLockScreen } = useAppStore();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Fixed Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 md:w-72 bg-[#070B14] border-r border-[#1E293B] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header Branding */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#1E293B]/80 bg-[#070B14]">
          <NavLink
            to="/"
            onClick={() => {
              soundEngine.playKeyClick();
              onCloseMobile();
            }}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)]">
              <Icon name="Sparkles" className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white uppercase font-display">
                  OFFER MODE
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-zinc-400 tracking-tight font-medium block">
                Executive Career Platform
              </span>
            </div>
          </NavLink>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* 10 Navigation Links List */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
            Navigation Menu
          </div>

          {SIDEBAR_ITEMS.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => {
                soundEngine.playKeyClick();
                onCloseMobile();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.1)] font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-[#0F172A]/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon
                  name={item.icon}
                  className="w-4 h-4 transition-colors group-hover:text-cyan-400"
                />
                <span>{item.title}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Lock Screen Workstation Trigger */}
        <div className="p-4 border-t border-[#1E293B] bg-[#070B14]">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] border border-cyan-500/20 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Full-Screen Mode
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Launch ambient millisecond lock screen on this display.
            </p>
            <button
              onClick={() => {
                soundEngine.playSuccessChime();
                openLockScreen('developer');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] active:scale-95"
            >
              <Icon name="Lock" className="w-3.5 h-3.5 fill-black" />
              <span>Launch Workstation</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
