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
import { RouteLoadingFallback } from '../common/RouteLoadingFallback';
import { GlobalCommandBar } from '../search/GlobalCommandBar';
import { Icon } from '../common/Icon';
import { useHotkeys } from '../../hooks/useHotkeys';
import { soundEngine } from '../../services/soundEngine';

export const AppLayout: React.FC = () => {
  const { isLockScreenActive, openLockScreen, closeLockScreen, settings, isAuthenticated } = useAppStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message?: string } | null>(null);
  const [isPersonasModalOpen, setIsPersonasModalOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Global Command Bar shortcut (Ctrl+K or ⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandBarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track window scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Capture beforeinstallprompt for PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPwa = async () => {
    if (!installPrompt) return;
    soundEngine.playSuccessChime();
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

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
    const handleOpenCommandBar = () => setIsCommandBarOpen(true);

    window.addEventListener('offer-mode-notification', handleNotification);
    window.addEventListener('open-career-personas-modal', handleOpenPersonas);
    window.addEventListener('open-global-command-bar', handleOpenCommandBar);
    return () => {
      window.removeEventListener('offer-mode-notification', handleNotification);
      window.removeEventListener('open-career-personas-modal', handleOpenPersonas);
      window.removeEventListener('open-global-command-bar', handleOpenCommandBar);
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
          <React.Suspense fallback={<RouteLoadingFallback />}>
            <Outlet />
          </React.Suspense>
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
        isLight ? 'theme-light bg-slate-50 text-slate-900' : 'bg-[#0B0F19] text-slate-100 cutting-mat-grid'
      }`}
    >
      {/* Skip to Content Accessibility Landmark */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* 1. Fixed Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Area with Left Margin for Fixed Sidebar on Desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Navigation */}
        <TopNav onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />

        {/* PWA Install Banner */}
        {installPrompt && (
          <div className="bg-indigo-950/80 border-b border-indigo-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-indigo-200 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Icon name="Laptop" className="w-3.5 h-3.5" />
              </span>
              <span>Install Offer Mode on your desktop or mobile device for offline countdowns & quick launch.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallPwa}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                Install App
              </button>
              <button
                onClick={() => setInstallPrompt(null)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main id="main-content" className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto outline-none">
          <React.Suspense fallback={<RouteLoadingFallback />}>
            <Outlet />
          </React.Suspense>
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

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-normal">
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/terms');
                }}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Terms
              </a>
              <span>•</span>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/privacy');
                }}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Privacy
              </a>
              <span>•</span>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-policy-popup'))}
                className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 text-xs"
                title="Review Cookie & Local Storage Policy"
              >
                <span>🍪 Cookies</span>
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
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">L</kbd> Focus
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

      {/* Global Spotlight / Command Bar (Ctrl+K) */}
      <GlobalCommandBar
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
      />

      {/* Active In-App Toast Alert */}
      {activeToast && (
        <Toast
          title={activeToast.title}
          message={activeToast.message}
          onClose={() => setActiveToast(null)}
        />
      )}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => {
            soundEngine.playKeyClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-xl backdrop-blur border border-indigo-400/40 transition-all hover:scale-110 active:scale-95 animate-fadeIn"
          aria-label="Back to top"
          title="Back to top"
        >
          <Icon name="ChevronUp" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
