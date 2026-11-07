import React, { useState, useEffect } from 'react';
import { cookieService } from '../../services/cookieService';
import { Icon } from './Icon';
import { soundEngine } from '../../services/soundEngine';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [allowPreferences, setAllowPreferences] = useState(true);

  useEffect(() => {
    // Show immediately if user has not yet consented
    if (!cookieService.hasConsent()) {
      setIsVisible(true);
    }

    // Support opening the cookie policy popup on-demand (e.g. from footer or settings)
    const handleOpenPopup = () => setIsVisible(true);
    window.addEventListener('open-cookie-policy-popup', handleOpenPopup);
    return () => window.removeEventListener('open-cookie-policy-popup', handleOpenPopup);
  }, []);

  if (!isVisible) return null;

  // Immediately close and persist
  const handleAcceptAll = () => {
    soundEngine.playSuccessChime();
    cookieService.acceptAll();
    setIsVisible(false); // Disappears immediately
  };

  const handleAcceptEssential = () => {
    soundEngine.playKeyClick();
    cookieService.acceptEssential();
    setIsVisible(false); // Disappears immediately
  };

  const handleSaveCustom = () => {
    soundEngine.playSuccessChime();
    cookieService.savePreferences({
      essential: true,
      preferences: allowPreferences,
      analytics: false,
    });
    setIsVisible(false); // Disappears immediately
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie & Privacy Policy Pop-up"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      {/* Pop-up Card Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#080D1A] border-2 border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.25)] text-slate-100 animate-scaleUp">
        {/* Close "X" Button */}
        <button
          onClick={handleAcceptAll}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          title="Accept & Close Pop-up"
          aria-label="Close Pop-up"
        >
          <Icon name="X" className="w-5 h-5" />
        </button>

        {/* Pop-up Header with Cookie Icon */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/70 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.35)] text-2xl">
            🍪
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-wider">
                Privacy & Cookie Policy
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Cookie & Local Workstation Policy
            </h2>
          </div>
        </div>

        {/* Policy Body */}
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
          OFFER MODE uses cookies and browser LocalStorage strictly to operate your career sprint clocks, persist your 1080p wallpaper studio presets, and store sound preferences offline.
        </p>

        {/* 3 Pillars Summary Box */}
        <div className="p-4 rounded-2xl bg-[#040711] border border-zinc-800 space-y-2.5 mb-5 text-xs text-zinc-300">
          <div className="flex items-center gap-2.5">
            <Icon name="CheckCircle2" className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Essential Clocks:</strong> Powers live millisecond timers and milestone progress.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Icon name="CheckCircle2" className="w-4 h-4 text-cyan-400 shrink-0" />
            <span><strong>Themes & Studio:</strong> Keeps your dark/light mode and saved 9:16 wallpaper presets.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Icon name="CheckCircle2" className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>100% Privacy Guarantee:</strong> Zero external analytics or third-party ad trackers.</span>
          </div>
        </div>

        {/* Optional Custom Preferences Section */}
        {showPreferences && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#060A16] border border-zinc-800 space-y-3 text-xs animate-fadeIn">
            <div className="flex items-center justify-between py-1 border-b border-zinc-800">
              <div>
                <div className="font-bold text-white text-xs">Essential Workstation Cookies</div>
                <div className="text-[10px] text-zinc-400">Required for countdown engines, soundscapes, and milestone math.</div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="font-bold text-white text-xs">Theme & Sound Preferences</div>
                <div className="text-[10px] text-zinc-400">Stores dark/light mode choice and Web Audio volume state.</div>
              </div>
              <input
                type="checkbox"
                checked={allowPreferences}
                onChange={(e) => setAllowPreferences(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Action Buttons: MUST DISAPPEAR AFTER ACCEPT */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {showPreferences ? (
            <button
              onClick={handleSaveCustom}
              className="w-full py-3 px-5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-95"
            >
              Save Preferences & Close
            </button>
          ) : (
            <>
              {/* Primary ACCEPT Button (Disappears Pop-up Instantly) */}
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black font-black text-xs sm:text-sm tracking-wide uppercase transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-95 flex items-center justify-center gap-2"
              >
                <Icon name="CheckCircle2" className="w-4 h-4 fill-black text-cyan-400" />
                <span>Accept & Continue</span>
              </button>

              {/* Secondary ESSENTIAL ONLY Button */}
              <button
                onClick={handleAcceptEssential}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all active:scale-95"
              >
                Essential Only
              </button>

              {/* Customize Toggle */}
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="p-3 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Customize preferences"
              >
                <Icon name="Sliders" className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
