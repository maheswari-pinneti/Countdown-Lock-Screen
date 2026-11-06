import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { useAppStore } from '../../store/AppContext';
import { LockScreenModal } from '../../features/lockscreen/LockScreenModal';
import { useHotkeys } from '../../hooks/useHotkeys';
import { soundEngine } from '../../services/soundEngine';

export const AppLayout: React.FC = () => {
  const { isLockScreenActive, openLockScreen, closeLockScreen, experiences } = useAppStore();
  const navigate = useNavigate();

  // Global hotkeys mapping
  useHotkeys({
    l: () => openLockScreen(),
    L: () => openLockScreen(),
    '0': () => {
      soundEngine.playKeyClick();
      navigate('/');
    },
    '1': () => {
      soundEngine.playKeyClick();
      navigate(experiences[0]?.route || '/developer');
    },
    '2': () => {
      soundEngine.playKeyClick();
      navigate(experiences[1]?.route || '/interview');
    },
    '3': () => {
      soundEngine.playKeyClick();
      navigate(experiences[2]?.route || '/job-hunt');
    },
    '4': () => {
      soundEngine.playKeyClick();
      navigate(experiences[3]?.route || '/career-switch');
    },
    '5': () => {
      soundEngine.playKeyClick();
      navigate(experiences[4]?.route || '/first-job');
    },
  }, !isLockScreenActive);

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-900 bg-black/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">OFFER MODE</span>
            <span>•</span>
            <span>Production Career Countdown Workstation</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">L</kbd> Lock Screen</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">1-5</kbd> Switch Tracks</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">0</kbd> Overview</span>
          </div>
        </div>
      </footer>

      {/* Fullscreen Interactive Lock Screen */}
      {isLockScreenActive && <LockScreenModal onClose={closeLockScreen} />}
    </div>
  );
};
