import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../navigation/Sidebar';
import { TopNav } from '../navigation/TopNav';
import { useAppStore } from '../../store/AppContext';
import { LockScreenModal } from '../../features/lockscreen/LockScreenModal';
import { Toast } from '../feedback/Toast';
import { CookieConsentBanner } from '../common/CookieConsentBanner';
import { CareerPersonasModal } from '../common/CareerPersonasModal';
import { PasskeyModal } from '../common/PasskeyModal';
import { Icon } from '../common/Icon';
import { useHotkeys } from '../../hooks/useHotkeys';
import { soundEngine } from '../../services/soundEngine';

export const AppLayout: React.FC = () => {
  const { isLockScreenActive, openLockScreen, closeLockScreen, settings, isAuthenticated } = useAppStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message?: string } | null>(null);
  const [isPersonasModalOpen, setIsPersonasModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // Listen for custom in-app notifications dispatched by NotificationService
  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; body: string }>;
      if (customEvent.detail) {
        setActiveToast({
          title: customEvent.detail.title,
          message: customEvent.detail.body,
        });
      }
    };

    const handleOpenPersonas = () => setIsPersonasModalOpen(true);

    window.addEventListener('offer-mode-notification', handleNotification);
    window.addEventListener('open-career-personas-modal', handleOpenPersonas);
    return () => {
      window.removeEventListener('offer-mode-notification', handleNotification);
      window.removeEventListener('open-career-personas-modal', handleOpenPersonas);
    };
  }, []);

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

  const isLight = settings.themeMode === 'light';

  if (isAuthPage && !isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
          isLight ? 'theme-light bg-slate-50 text-slate-900' : 'bg-[#0B0F19] text-slate-100'
        }`}
      >
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-pink-500/25 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Icon name="Target" className="w-4 h-4 text-indigo-300" />
            </div>
            <span className="font-bold text-base tracking-tight text-white font-display">
              Offer Mode
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">• Personal Countdown Workstation</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium">
              Step 1: Sign in to unlock dashboard
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Outlet />
        </main>

        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60">
          <span>Offer Mode • Biometric Passkey & Countdown Workstations</span>
        </footer>

        <PasskeyModal />
        <CookieConsentBanner />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        isLight ? 'theme-light bg-slate-50 text-slate-900' : 'bg-[#0B0F19] text-slate-100'
      }`}
    >
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

        {/* Executive SaaS Footer */}
        <footer
          className={`border-t py-6 px-6 sm:px-8 transition-colors ${
            isLight
              ? 'border-slate-200 bg-white text-slate-600'
              : 'border-slate-800/80 bg-[#0B0F19] text-slate-400'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Offer Mode
              </span>
              <span>•</span>
              <span>Every deadline deserves a plan. Every goal deserves progress.</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-normal">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-policy-popup'))}
                className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 text-xs"
                title="Review Cookie & Local Storage Policy"
              >
                <span>🍪 Cookie Policy</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setIsPersonasModalOpen(true)}
                className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 text-xs"
                title="Explore 5 Career Archetypes"
              >
                <span>👤 Career Tracks</span>
              </button>
              <span>•</span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">L</kbd> Focus Mode
              </span>
              <span>•</span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">1-5</kbd> Switch
              </span>
              <span>•</span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">0</kbd> Dashboard
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Fullscreen Interactive Lock Screen */}
      {isLockScreenActive && <LockScreenModal onClose={closeLockScreen} />}

      {/* GDPR / Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Career Personas Modal */}
      <CareerPersonasModal
        isOpen={isPersonasModalOpen}
        onClose={() => setIsPersonasModalOpen(false)}
      />

      {/* Passkey Verification Modal */}
      <PasskeyModal />

      {/* Active In-App Toast Alert */}
      {activeToast && (
        <Toast
          title={activeToast.title}
          message={activeToast.message}
          onClose={() => setActiveToast(null)}
        />
      )}
    </div>
  );
};
