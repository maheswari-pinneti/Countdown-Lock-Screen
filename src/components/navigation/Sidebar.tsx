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
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: '🌟 Life Command Center',
    items: [
      { title: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
      { title: 'Routines & Habits', path: '/life', icon: 'Sparkles', badge: 'Anti-Guilt' },
      { title: 'Private Journal', path: '/journal', icon: 'BookHeart', badge: 'Mind' },
      { title: 'Daily Planner', path: '/planner', icon: 'CalendarCheck', badge: 'MITs' },
      { title: 'Focus Hub & Audio', path: '/focus', icon: 'Timer', badge: 'Flow' },
    ],
  },
  {
    title: '💼 Career Command Center',
    items: [
      { title: 'My Countdowns', path: '/countdowns', icon: 'Clock' },
      { title: 'Learning Center', path: '/learning', icon: 'GraduationCap', badge: 'Skills' },
      { title: 'Interview Countdown', path: '/interview', icon: 'CalendarCheck', badge: 'Prep' },
      { title: '30-Day Job Hunt', path: '/job-hunt', icon: 'Briefcase', badge: 'CRM' },
      { title: 'Developer Upgrade', path: '/developer', icon: 'Code', badge: 'Track' },
      { title: 'First Tech Job', path: '/first-job', icon: 'GraduationCap', badge: 'Campus' },
      { title: 'Career Switch', path: '/career-switch', icon: 'ArrowLeftRight', badge: 'Pivot' },
      { title: 'Role Directory', path: '/directory', icon: 'Users', badge: 'Roles' },
    ],
  },
  {
    title: '🚀 Dreams, Finance & Studio',
    items: [
      { title: 'Finance & Runway', path: '/finance', icon: 'Wallet', badge: 'Runway' },
      { title: 'Dreams & Bucket List', path: '/dreams', icon: 'Target', badge: 'Life' },
      { title: 'Second Brain (PARA)', path: '/second-brain', icon: 'Brain', badge: 'Vault' },
      { title: 'Countdown Studio', path: '/countdown-studio', icon: 'Palette' },
      { title: 'Saved Presets', path: '/saved-designs', icon: 'Layout' },
      { title: 'Platform Showcase', path: '/showcase', icon: 'Sparkles' },
      { title: 'Settings & Security', path: '/settings', icon: 'Settings' },
      { title: 'Help & Architecture', path: '/help', icon: 'BookOpen' },
    ],
  },
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
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 md:w-72 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header Branding */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80 bg-[#0B0F19]">
          <NavLink
            to="/"
            onClick={() => {
              soundEngine.playKeyClick();
              onCloseMobile();
            }}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-pink-500/25 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-all shadow-md shadow-indigo-500/20">
              <Icon name="Target" className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white font-display">
                  Offer Mode
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-xs text-slate-400 tracking-normal font-normal block">
                Career Countdown Hub
              </span>
            </div>
          </NavLink>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close Navigation"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links List */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto scrollbar-thin">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>

              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => {
                    soundEngine.playKeyClick();
                    onCloseMobile();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/10 text-white border border-indigo-500/30 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      name={item.icon}
                      className="w-4 h-4 transition-colors group-hover:text-indigo-400 text-slate-400 flex-shrink-0"
                    />
                    <span className="truncate">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700/80 text-slate-300 flex-shrink-0 ml-1">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom Lock Screen Workstation Trigger */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0B0F19]">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/20 shadow-lg space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">
                Focus Lock Screen
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-snug font-normal">
              Turn your display into a calm, ambient countdown timer.
            </p>
            <button
              onClick={() => {
                soundEngine.playSuccessChime();
                openLockScreen('developer');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-xs tracking-normal flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 active:scale-95"
            >
              <Icon name="Lock" className="w-3.5 h-3.5" />
              <span>Start Focus Mode</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
