import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/common/Icon';
import { soundEngine } from '../../services/soundEngine';

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    soundEngine.playKeyClick();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <Icon name="ArrowRight" className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3 text-xs">
          <Link
            to="/terms"
            className="text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Terms &amp; Conditions
          </Link>
          <span className="text-slate-600">•</span>
          <Link
            to="/login"
            className="text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Sign In
          </Link>
          <span className="text-slate-600">•</span>
          <Link
            to="/signup"
            className="text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Icon name="ShieldCheck" className="w-3.5 h-3.5" />
          <span>Privacy-First Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Effective Date: November 1, 2026 • Your career plans, salary targets, and biometrics remain 100% on your device.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-8 text-sm text-slate-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs font-mono text-emerald-300">
              01
            </span>
            <span>Zero Third-Party Telemetry</span>
          </h2>
          <p>
            OFFER MODE respects your career confidentiality. We do not use third-party behavioral trackers, commercial ad pixels, or intrusive keystroke analytics. Everything you calculate, write, or customize happens strictly inside your client browser sandbox.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs font-mono text-emerald-300">
              02
            </span>
            <span>Local Storage Data Storage</span>
          </h2>
          <p>
            The application serializes your workstation preferences, 5 career countdown targets, milestone checkboxes, and wallpaper presets into versioned <code>window.localStorage</code> keys:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-400 text-xs">
            <li><code>offer_mode_experiences_v2</code>: Your 5 career track targets and milestone lists.</li>
            <li><code>offer_mode_settings_v2</code>: Sound volumes, audio toggles, and theme preferences.</li>
            <li><code>offer_mode_presets_v2</code>: Saved custom wallpaper design presets.</li>
            <li><code>offer_mode_current_user_v1</code>: Active session user profile.</li>
          </ul>
          <p className="text-xs text-slate-400">
            You can permanently wipe all local data at any time via <strong>Settings → Reset to Defaults</strong> or by clearing your browser cache.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs font-mono text-emerald-300">
              03
            </span>
            <span>Biometric Hardware Isolation</span>
          </h2>
          <p>
            When registering or signing in with <strong>WebAuthn Passkeys</strong> (Apple Touch ID, Face ID, Windows Hello, or YubiKey), all cryptographic signing and biometric verification are executed by your physical operating system. We receive only a signed public verification challenge; raw biometric patterns are never readable by JavaScript.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs font-mono text-emerald-300">
              04
            </span>
            <span>Audio &amp; Notification Permissions</span>
          </h2>
          <p>
            Audio feedback is synthesized on-the-fly using the browser <strong>Web Audio API</strong> without downloading external media files. Browser Notification API permissions are requested solely to alert you of upcoming milestone deadlines and sprint targets when minimized, and can be disabled at any time in Settings.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs font-mono text-emerald-300">
              05
            </span>
            <span>Privacy Contact</span>
          </h2>
          <p>
            For privacy inquiries or technical architecture verification:
          </p>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-emerald-300">
            privacy@offermode.dev • pinnetimaheswari@gmail.com
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Link
            to="/terms"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Review Terms &amp; Conditions →
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center transition-colors shadow-lg shadow-emerald-500/20"
          >
            Accept &amp; Continue
          </Link>
        </div>
      </div>
    </div>
  );
};
