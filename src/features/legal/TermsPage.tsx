import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/common/Icon';
import { soundEngine } from '../../services/soundEngine';

export const TermsPage: React.FC = () => {
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
            to="/login"
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            Sign In
          </Link>
          <span className="text-slate-600">•</span>
          <Link
            to="/signup"
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            Create Account
          </Link>
          <span className="text-slate-600">•</span>
          <Link
            to="/privacy"
            className="text-slate-400 hover:text-indigo-400 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Icon name="FileText" className="w-3.5 h-3.5" />
          <span>Official Legal Document</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Effective Date: November 1, 2026 • Version 2.0 • Applicable to all OFFER MODE web applications, countdown workstations, and lock screen wallpaper services.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-8 text-sm text-slate-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs font-mono text-indigo-300">
              01
            </span>
            <span>Acceptance of Terms</span>
          </h2>
          <p>
            By accessing, creating an account on, or interacting with <strong>OFFER MODE</strong> (&quot;the Service&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions, together with our Privacy Policy. If you do not agree to these terms, you must discontinue using the application immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs font-mono text-indigo-300">
              02
            </span>
            <span>Local-First Data Ownership & Privacy Guarantee</span>
          </h2>
          <p>
            OFFER MODE is built on a <strong>Local-First Architecture</strong>. Your career milestone goals, personal compensation numbers, target offer dates, reverse interview notes, and habit logs are saved directly in your device&apos;s browser storage (<code>localStorage</code> and <code>sessionStorage</code>).
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-400 text-xs">
            <li>We do not transmit your sensitive career salary targets or proprietary preparation notes to external analytics servers.</li>
            <li>You retain complete, exclusive ownership over all milestone checklists and career data you enter.</li>
            <li>You are responsible for exporting backup copies of your local state via the Settings workstation (<code>/settings</code>) to prevent data loss when clearing browser cookies or caches.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs font-mono text-indigo-300">
              03
            </span>
            <span>WebAuthn Biometric Passkeys & Security Protocols</span>
          </h2>
          <p>
            OFFER MODE supports <strong>W3C Web Authentication (WebAuthn)</strong> biometric hardware authenticators (Apple Touch ID, Face ID, Windows Hello, and FIDO2 physical keys).
          </p>
          <p className="text-slate-400 text-xs">
            When you register a passkey, biometric matching occurs entirely inside your device&apos;s secure enclave / TPM chip. Biometric samples, fingerprint templates, and facial geometry are never exposed to our web application or stored on external databases. You agree to take reasonable precautions to safeguard your physical devices and authenticators against unauthorized physical access.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs font-mono text-indigo-300">
              04
            </span>
            <span>Career Modules & Countdown Precision</span>
          </h2>
          <p>
            The Service provides live countdown clocks, milestone roadmaps, and career preparation tools across 5 specialized workstations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-amber-400">Interview Countdown:</strong> Technical interview loops, STAR stories, and live prep timers.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-cyan-400">30-Day Job Hunt Sprint:</strong> Daily quotas, outreach logs, and pipeline tracking.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-emerald-400">Developer Skill Upgrade:</strong> Algorithms, distributed systems, and deep-work tracking.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-rose-400">First Job Countdown:</strong> Campus drives, resume tailoring, and onboarding checklists.
            </div>
          </div>
          <p className="text-xs text-slate-400 pt-1">
            While countdown mathematical formulas compute millisecond precision against user-selected IANA timezones, OFFER MODE is an educational productivity aid and does not guarantee job offers, interview scheduling, or employment outcomes.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs font-mono text-indigo-300">
              05
            </span>
            <span>Countdown Studio & Lock Screen Wallpaper License</span>
          </h2>
          <p>
            Users may customize and export high-density PNG lock-screen wallpapers at smartphone aspect ratios (9:16, 9:19.5, and 9:20). You are granted a personal, non-exclusive, royalty-free license to use, download, set as your device wallpaper, and share your generated countdown graphics.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs font-mono text-indigo-300">
              06
            </span>
            <span>User Accounts & Acceptable Use</span>
          </h2>
          <p>
            You agree to provide accurate registration information and not impersonate any person or entity. You agree not to attempt to reverse engineer, disrupt, or introduce malicious scripts or unauthorized automated bots to the application.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs font-mono text-indigo-300">
              07
            </span>
            <span>Disclaimer of Warranties & Limitation of Liability</span>
          </h2>
          <p className="text-slate-400 text-xs">
            THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, OFFER MODE AND ITS MAINTAINERS DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. IN NO EVENT SHALL OFFER MODE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs font-mono text-indigo-300">
              08
            </span>
            <span>Inquiries & Contact</span>
          </h2>
          <p>
            For questions or legal notifications regarding these Terms &amp; Conditions, please contact us at:
          </p>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-indigo-300">
            support@offermode.dev • pinnetimaheswari@gmail.com
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Ready to secure your career countdown workstation?
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/signup"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs text-center transition-colors shadow-lg shadow-indigo-500/20"
            >
              Accept &amp; Create Account
            </Link>
            <Link
              to="/login"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center border border-slate-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
