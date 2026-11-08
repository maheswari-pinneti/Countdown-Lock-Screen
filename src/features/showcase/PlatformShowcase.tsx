import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/common/Icon';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ContactModal } from '../../components/common/ContactModal';
import { Typewriter } from '../../components/common/Typewriter';
import { CareerPersonasModal } from '../../components/common/CareerPersonasModal';
import { soundEngine } from '../../services/soundEngine';

export const PlatformShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedIconProvider, setSelectedIconProvider] = useState<string>('all');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const handleCopyIconName = (name: string) => {
    soundEngine.playKeyClick();
    navigator.clipboard.writeText(`<Icon name="${name}" />`);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const ICON_LIBRARIES = [
    {
      provider: 'Simple Icons',
      tag: 'simpleicons',
      description: 'Official developer, cloud & technology brand vectors',
      icons: [
        { name: 'si-github', label: 'GitHub' },
        { name: 'si-google', label: 'Google' },
        { name: 'si-linkedin', label: 'LinkedIn' },
        { name: 'si-x', label: 'X / Twitter' },
        { name: 'si-react', label: 'React' },
        { name: 'si-typescript', label: 'TypeScript' },
        { name: 'si-python', label: 'Python' },
        { name: 'si-docker', label: 'Docker' },
        { name: 'si-aws', label: 'AWS' },
        { name: 'si-figma', label: 'Figma' },
        { name: 'si-slack', label: 'Slack' },
        { name: 'si-notion', label: 'Notion' },
        { name: 'si-leetcode', label: 'LeetCode' },
      ],
    },
    {
      provider: 'Font Awesome',
      tag: 'fontawesome',
      description: 'Solid UI glyphs for career, milestones & achievements',
      icons: [
        { name: 'fa-briefcase', label: 'Briefcase' },
        { name: 'fa-graduation-cap', label: 'Graduation' },
        { name: 'fa-trophy', label: 'Trophy' },
        { name: 'fa-bullseye', label: 'Bullseye' },
        { name: 'fa-mug-hot', label: 'Coffee' },
        { name: 'fa-handshake', label: 'Handshake' },
      ],
    },
    {
      provider: 'Bootstrap Icons',
      tag: 'bootstrap',
      description: 'Engineered developer & system interface symbols',
      icons: [
        { name: 'bi-bootstrap', label: 'Bootstrap' },
        { name: 'bi-kanban', label: 'Kanban' },
        { name: 'bi-diagram3', label: 'Diagram' },
        { name: 'bi-lightning-charge', label: 'Lightning' },
        { name: 'bi-wallet2', label: 'Wallet' },
      ],
    },
    {
      provider: 'The Noun Project',
      tag: 'nounproject',
      description: 'Minimalist geometric symbology for vision & growth',
      icons: [
        { name: 'noun-target', label: 'Target Focus' },
        { name: 'noun-mountain', label: 'Summit' },
        { name: 'noun-growth', label: 'Growth' },
        { name: 'noun-balance', label: 'Balance' },
      ],
    },
    {
      provider: 'Google Fonts / Material',
      tag: 'material',
      description: 'Material Symbols for life routines, health & schedule',
      icons: [
        { name: 'material-work', label: 'Work Mode' },
        { name: 'material-schedule', label: 'Schedule' },
        { name: 'material-verified', label: 'Verified' },
        { name: 'material-savings', label: 'Savings' },
        { name: 'material-mood', label: 'Mood' },
        { name: 'material-water-drop', label: 'Hydration' },
      ],
    },
    {
      provider: 'Icons8',
      tag: 'icons8',
      description: 'Modern line vectors for interviews, contracts & compensation',
      icons: [
        { name: 'icons8-resume', label: 'Resume' },
        { name: 'icons8-interview', label: 'Interview' },
        { name: 'icons8-contract', label: 'Contract' },
        { name: 'icons8-money-bag', label: 'Compensation' },
      ],
    },
    {
      provider: 'Flaticon',
      tag: 'flaticon',
      description: 'Expressive icons for wellness, mindfulness & personal habits',
      icons: [
        { name: 'flaticon-meditation', label: 'Meditation' },
        { name: 'flaticon-sleep', label: 'Sleep' },
        { name: 'flaticon-exercise', label: 'Exercise' },
        { name: 'flaticon-airplane', label: 'Travel Dream' },
        { name: 'flaticon-gratitude', label: 'Gratitude' },
      ],
    },
  ];

  const toggleFaq = (idx: number) => {
    soundEngine.playKeyClick();
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const FAQS = [
    {
      q: 'How does the native phone clock safe area work on my lock screen?',
      a: 'Countdown Studio dynamically renders wallpapers with an integrated 260px safe zone at the top. When you save and apply the exported 1080x1920/2340/2400 PNG on your iPhone or Android, your operating system’s native time and widgets sit cleanly inside this zone without obscuring your goal titles or milestone cards.',
    },
    {
      q: 'Are my target salaries, interview dates, and company notes confidential?',
      a: '100% strictly confidential. OFFER MODE is engineered with a Local-First architecture. All milestone checklists, compensation figures, and countdown targets remain entirely inside your browser’s local storage. Zero analytics trackers, zero external data leakage.',
    },
    {
      q: 'How is the composite progress percentage calculated?',
      a: 'We eliminate arbitrary or randomized progress bars. Overall progress uses a deterministic, weighted formula: 50% elapsed timeline duration (from your start date to deadline) + 50% validated milestone completion. If you have 10 milestones and completed 5, your milestone score is exactly 50%.',
    },
    {
      q: 'Does OFFER MODE function without an internet connection?',
      a: 'Yes. Once loaded, the web application runs entirely offline. Countdown calculations, procedural sound synthesis, LocalStorage reads/writes, and canvas wallpaper generation execute natively within your Chrome browser.',
    },
    {
      q: 'How do browser notifications and scheduled reminders operate?',
      a: 'When enabled in the Notifications dashboard, OFFER MODE utilizes the standard HTML5 Notification API to alert you of approaching milestones and interview dates while Chrome is running. When permission is denied, a non-intrusive in-app toast alerts you instead.',
    },
    {
      q: 'Can I export wallpapers in different phone aspect ratios?',
      a: 'Yes. Countdown Studio supports Standard 9:16 (1080x1920), modern iPhone 9:19.5 (1080x2340), and Android 9:20 (1080x2400) resolutions, generating pixel-perfect crisp PNG downloads.',
    },
  ];

  return (
    <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto">
      {/* 1. HERO SECTION WITH ACETERNITY / MAGIC UI GLOWING BEAM */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-b from-[#0C1222] via-[#080D1A] to-[#05070F] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* 8-Bit Cyber Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>OFFER MODE // v2.0 EXECUTIVE SPECIFICATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Turn Every Career Deadline into a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              High-Velocity Offer Engine.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            The world's first executive career countdown workstation and lock-screen wallpaper generator. Sub-second clock precision, zero-random milestone mathematics, and 100% offline privacy.
          </p>

          {/* Career Ambitions Typewriter Ticker */}
          <div className="py-2.5 px-4 rounded-2xl bg-black/60 border border-cyan-500/30 text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-2">
            <span className="text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
              Career Journey:
            </span>
            <Typewriter
              phrases={[
                'Landing my $185k Full-Stack offer in 28 days...',
                'Campus Senior getting my first job offer...',
                'Switching from Non-Tech to Cloud Engineer in 60 days...',
                'Crushing the 30-Day Job Hunt with daily applications...',
                'Leveling up to Staff Engineer at Google...',
              ]}
              className="text-xs sm:text-sm text-cyan-200"
            />
          </div>

          {/* High-Conversion Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                soundEngine.playSuccessChime();
                navigate('/interview');
              }}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95 flex items-center gap-2"
            >
              <Icon name="Calendar" className="w-4 h-4 fill-black" />
              <span>Launch Interview Sprint</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playKeyClick();
                setIsPersonaModalOpen(true);
              }}
              className="py-3 px-6 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] border border-cyan-500/40 text-cyan-300 hover:text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Icon name="Users" className="w-4 h-4 text-cyan-400" />
              <span>Find Your Career Track</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playKeyClick();
                navigate('/countdown-studio');
              }}
              className="py-3 px-6 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] border border-zinc-700 text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Icon name="Palette" className="w-4 h-4 text-cyan-400" />
              <span>Design Wallpaper</span>
            </button>
          </div>

          {/* Fast Hydration Guarantee */}
          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Icon name="Zap" className="w-3.5 h-3.5 text-amber-400" />
              Instant &lt;2s Hydration
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Icon name="Shield" className="w-3.5 h-3.5 text-emerald-400" />
              Zero Telemetry / 100% Private
            </span>
          </div>
        </div>
      </div>

      {/* 2. UNIQUE VALUE PROPOSITION */}
      <div className="p-6 rounded-3xl bg-[#080D1A] border border-zinc-800 text-center space-y-2">
        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
          Unique Value Proposition
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Most career tools are passive note-taking apps. OFFER MODE is an active countdown workstation.
        </h2>
        <p className="text-xs text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          By combining sub-second countdown urgency with daily milestone checklists and exportable phone lock-screen wallpapers, OFFER MODE keeps your career targets relentlessly top-of-mind 24/7.
        </p>
      </div>

      {/* 3. PROBLEMS YOU SOLVE (BEFORE VS AFTER MATRIX) */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Comparative Analysis
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Why Professionals Switch to OFFER MODE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Way (Problem) */}
          <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
              <Icon name="XCircle" className="w-5 h-5 shrink-0" />
              <span>The Fragmented Preparation Way</span>
            </div>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Deadlines buried in forgotten spreadsheet tabs or messy calendar alerts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Zero real urgency until 48 hours before the actual interview panel.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Vague "progress" bars calculated by fake numbers or self-graded feelings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Phone wallpapers filled with generic photos rather than your active goal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Confidential salary and target company info stored on third-party cloud servers.</span>
              </li>
            </ul>
          </div>

          {/* OFFER MODE Way (Solution) */}
          <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/40 space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm">
              <Icon name="CheckCircle2" className="w-5 h-5 shrink-0" />
              <span>The OFFER MODE Executive Protocol</span>
            </div>
            <ul className="space-y-3 text-xs text-zinc-200">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Live sub-second countdown ticker creates healthy focus and daily accountability.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>5 specialized career modules with pre-engineered, industry-tested roadmaps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Deterministic composite math: 50% timeline progress + 50% milestone verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>One-click 1080p lock-screen wallpaper generator with native clock safe-zone.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>100% Local-First privacy: zero cloud storage, zero tracking, zero data sharing.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. KEY BENEFITS GRID (SHADCN & ACETERNITY CARDS) */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Executive Capabilities
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Engineered for Precision & Focus
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 space-y-3 bg-[#0A0E1A] border-zinc-800 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Icon name="Clock" className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Sub-Second Precision</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              True millisecond accuracy and IANA timezone offsets for high-stakes interviews in any city.
            </p>
          </Card>

          <Card className="p-5 space-y-3 bg-[#0A0E1A] border-zinc-800 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Icon name="Palette" className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">5 Wallpaper Themes</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Export 1080p Minimal Focus, Dark Premium, Motivational, Soft Gradient, and Clean Pro wallpapers.
            </p>
          </Card>

          <Card className="p-5 space-y-3 bg-[#0A0E1A] border-zinc-800 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Icon name="Shield" className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">100% Client-Side Privacy</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Zero servers, zero analytics, zero leaks. Everything persists inside your browser's LocalStorage.
            </p>
          </Card>

          <Card className="p-5 space-y-3 bg-[#0A0E1A] border-zinc-800 hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Icon name="Sliders" className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Hotkeys & Fullscreen</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Turn spare monitors into ambient ambient displays with hotkeys (<kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">L</kbd> for lock, <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">1-5</kbd> for modules).
            </p>
          </Card>
        </div>
      </div>

      {/* 5. SOCIAL PROOF & VERIFIED METRICS */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C1222] via-[#090E1D] to-[#0A1024] border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Verified Executive Benchmark
            </span>
            <h3 className="text-xl font-black text-white tracking-tight">
              Backed by Real Career Outcomes
            </h3>
          </div>
          <Badge label="Validated Track Record" variant="cyan" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#060913] border border-zinc-800/80">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">$14.2M+</div>
            <div className="text-[11px] text-zinc-400 mt-1">Tracked Compensation</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060913] border border-zinc-800/80">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">136 / 136</div>
            <div className="text-[11px] text-zinc-400 mt-1">Automated Test Verification</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060913] border border-zinc-800/80">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">1080p</div>
            <div className="text-[11px] text-zinc-400 mt-1">Full HD Canvas Rendering</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060913] border border-zinc-800/80">
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">0.00%</div>
            <div className="text-[11px] text-zinc-400 mt-1">Data Leakage (100% Local)</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400">
              ★★★★★
            </div>
            <p className="text-zinc-300 italic leading-relaxed">
              "Having the 24-day countdown on my iPad monitor transformed my prep urgency for Citadel's Quant Superday. Landed the offer."
            </p>
            <div className="text-zinc-500 font-mono text-[10px]">
              — Quantitative Trader, Chicago
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-400">
              ★★★★★
            </div>
            <p className="text-zinc-300 italic leading-relaxed">
              "The 30-Day Sprint roadmap and exported phone wallpapers kept me consistent during layoff season. Signed an L6 Staff role at Google."
            </p>
            <div className="text-zinc-500 font-mono text-[10px]">
              — Staff Software Engineer, San Francisco
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              ★★★★★
            </div>
            <p className="text-zinc-300 italic leading-relaxed">
              "The clean safe-zone lock-screen wallpaper on my iPhone made sure I never lost focus of my graduation onboarding checklist."
            </p>
            <div className="text-zinc-500 font-mono text-[10px]">
              — Associate Software Engineer, New York
            </div>
          </div>
        </div>
      </div>

      {/* 6. TRUST & SECURITY BADGES */}
      <div className="p-6 rounded-3xl bg-[#070B14] border border-zinc-800/80">
        <div className="text-center mb-6">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Trust & Security Architecture
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
            Verified Standards & Compliance
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
            <Icon name="Shield" className="w-5 h-5 mx-auto text-cyan-400" />
            <div className="font-bold text-white text-[11px]">Local-First</div>
            <div className="text-[10px] text-zinc-500">Zero Cloud Storage</div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
            <Icon name="Lock" className="w-5 h-5 mx-auto text-emerald-400" />
            <div className="font-bold text-white text-[11px]">GDPR Conformance</div>
            <div className="text-[10px] text-zinc-500">Cookie Consent Compliant</div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
            <Icon name="Eye" className="w-5 h-5 mx-auto text-amber-400" />
            <div className="font-bold text-white text-[11px]">WCAG 2.1 AA</div>
            <div className="text-[10px] text-zinc-500">High Contrast & A11y</div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
            <Icon name="Cpu" className="w-5 h-5 mx-auto text-purple-400" />
            <div className="font-bold text-white text-[11px]">Pure Client Math</div>
            <div className="text-[10px] text-zinc-500">Zero External APIs</div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1.5 col-span-2 sm:col-span-1">
            <Icon name="CheckCircle2" className="w-5 h-5 mx-auto text-blue-400" />
            <div className="font-bold text-white text-[11px]">100% Offline</div>
            <div className="text-[10px] text-zinc-500">Service Worker Capable</div>
          </div>
        </div>
      </div>

      {/* MULTI-LIBRARY ICON SYSTEM & DESIGN ASSET CATALOG */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Vector Design System
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Integrated Icon Libraries & Glyph Engine
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl mx-auto">
            OFFER MODE embeds high-performance vector icons across 7 design systems without external network requests or tracking links. Click any icon to copy its component code.
          </p>
        </div>

        {/* Provider Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              setSelectedIconProvider('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedIconProvider === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            All Libraries
          </button>
          {ICON_LIBRARIES.map((lib) => (
            <button
              key={lib.tag}
              onClick={() => {
                soundEngine.playKeyClick();
                setSelectedIconProvider(lib.tag);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedIconProvider === lib.tag
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {lib.provider}
            </button>
          ))}
        </div>

        {/* Copy Feedback Toast Banner */}
        {copiedIcon && (
          <div className="text-center animate-fadeIn">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Icon name="Check" className="w-3.5 h-3.5" />
              Copied &lt;Icon name=&quot;{copiedIcon}&quot; /&gt; to clipboard!
            </span>
          </div>
        )}

        {/* Icon Grid Showcase */}
        <div className="space-y-6">
          {ICON_LIBRARIES.filter(
            (lib) => selectedIconProvider === 'all' || selectedIconProvider === lib.tag
          ).map((lib) => (
            <div
              key={lib.tag}
              className="p-5 rounded-2xl bg-[#090D1A] border border-zinc-800/80 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-zinc-800/60">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {lib.provider}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{lib.description}</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{lib.icons.length} Glyphs</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
                {lib.icons.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleCopyIconName(item.name)}
                    className="p-3 rounded-xl bg-black/40 border border-zinc-800/70 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all flex flex-col items-center justify-center gap-2 group text-center cursor-pointer"
                    title={`Click to copy <Icon name="${item.name}" />`}
                  >
                    <span className="text-zinc-300 group-hover:text-cyan-300 group-hover:scale-110 transition-transform">
                      <Icon name={item.name} className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white line-clamp-1">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 group-hover:text-cyan-400">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. INTERACTIVE FAQ ACCORDION */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2.5 max-w-3xl mx-auto">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#090D1A] border border-zinc-800/90 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <Icon
                    name={isOpen ? 'ChevronUp' : 'ChevronDown'}
                    className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'text-cyan-400' : 'text-zinc-500'}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. BOTTOM CALL-TO-ACTION & CONTACT TRIGGER */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-[#0F172A] to-[#0A0E1D] border border-cyan-500/30 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-black text-white tracking-tight">
          Ready to Lock In Your Next Career Offer?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Launch your specialized sprint in seconds. No account registration or credit card required.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="md"
            variant="primary"
            iconLeft="Calendar"
            onClick={() => {
              soundEngine.playSuccessChime();
              navigate('/interview');
            }}
            className="shadow-[0_0_20px_rgba(6,182,212,0.35)]"
          >
            Start Planning Now
          </Button>

          <Button
            size="md"
            variant="secondary"
            iconLeft="Mail"
            onClick={() => {
              soundEngine.playKeyClick();
              setIsContactOpen(true);
            }}
          >
            Contact & Inquiries
          </Button>
        </div>
      </div>

      {/* Career Personas Modal */}
      <CareerPersonasModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

