import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../navigation/Sidebar';
import { TopNav } from '../navigation/TopNav';
import { useAppStore } from '../../store/AppContext';
import { LockScreenModal } from '../../features/lockscreen/LockScreenModal';
import { useHotkeys } from '../../hooks/useHotkeys';
import { soundEngine } from '../../services/soundEngine';

export const AppLayout: React.FC = () => {
  const { isLockScreenActive, openLockScreen, closeLockScreen, experiences } = useAppStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
      navigate('/interview');
    },
    '2': () => {
      soundEngine.playKeyClick();
      navigate('/job-hunt');
    },
    '3': () => {
      soundEngine.playKeyClick();
      navigate('/developer');
    },
    '4': () => {
      soundEngine.playKeyClick();
      navigate('/first-job');
    },
    '5': () => {
      soundEngine.playKeyClick();
      navigate('/career-switch');
    },
  }, !isLockScreenActive);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex font-sans selection:bg-cyan-400 selection:text-black">
      {/* 1. Fixed Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Area with Left Margin for Fixed Sidebar on Desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Navigation */}
        <TopNav onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />

        {/* Main Content Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Restrained SaaS Footer */}
        <footer className="border-t border-[#1E293B]/60 bg-[#070B14] py-6 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300">OFFER MODE</span>
              <span>•</span>
              <span>Every deadline deserves a plan. Every goal deserves progress.</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span><kbd className="px-1.5 py-0.5 rounded bg-[#0F172A] border border-zinc-800 text-zinc-300">L</kbd> Lock Screen</span>
              <span>•</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-[#0F172A] border border-zinc-800 text-zinc-300">1-5</kbd> Switch Tracks</span>
              <span>•</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-[#0F172A] border border-zinc-800 text-zinc-300">0</kbd> Overview</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Fullscreen Interactive Lock Screen */}
      {isLockScreenActive && <LockScreenModal onClose={closeLockScreen} />}
    </div>
  );
};
