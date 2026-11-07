import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { soundEngine } from '../../services/soundEngine';

type SettingsTab = 'preferences' | 'data' | 'help' | 'faq';

interface FaqItem {
  id: string;
  category: 'General' | 'Lock Screen' | 'Passkeys' | 'Milestones' | 'Offline & Sync';
  question: string;
  answer: string;
  badge?: string;
}

const FAQ_DATABASE: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'What is Offer Mode and how does it help my career transition?',
    answer:
      'Offer Mode is a distraction-free career workstation and lock-screen wallpaper generator. It combines precision countdown clocks, curated 10-12 milestone tracks (Interview Prep, 30-Day Job Hunt, Skill Upgrade, First Job, and Career Switch), compensation modeling, and ambient lock-screen monitors that keep your career goals front and center.',
    badge: 'Overview',
  },
  {
    id: 'faq-2',
    category: 'Offline & Sync',
    question: 'Can I use Offer Mode offline without an active internet connection?',
    answer:
      'Yes! Offer Mode is engineered as a local-first web application. All countdown timers, milestone checklists, notes, and compensation plans are saved locally in your browser storage. You can run it offline, during flights, or on dedicated secondary monitors with zero network latency.',
    badge: 'Local-First',
  },
  {
    id: 'faq-3',
    category: 'Lock Screen',
    question: 'How do I download and set the countdown wallpaper on iPhone or Android?',
    answer:
      'Navigate to the Wallpaper Studio or click "Export Wallpaper" on any workstation. Select your phone resolution (9:16 standard, 9:19.5 iPhone, or 9:20 Android), click "Download High-Res PNG", and transfer it to your photo gallery. On iOS, go to Settings > Wallpaper > Add New Wallpaper. On Android, open the image and tap "Set as Wallpaper > Lock Screen".',
    badge: 'Mobile Guide',
  },
  {
    id: 'faq-4',
    category: 'Passkeys',
    question: 'How does Passkey biometric protection work and is my fingerprint safe?',
    answer:
      'Offer Mode implements the official W3C WebAuthn standard. When you protect a career track, your device (Face ID, Touch ID, Windows Hello, or YubiKey) generates a private cryptographic key pair stored securely in your hardware Secure Enclave. Biometric data never leaves your physical device and is never sent to any external server.',
    badge: 'Security',
  },
  {
    id: 'faq-5',
    category: 'Milestones',
    question: 'How is the Composite Readiness Percentage calculated?',
    answer:
      'Readiness is computed using a deterministic composite score: 60% based on completed milestones in your syllabus and 40% based on elapsed timeline progression toward your target offer deadline. This gives you a balanced, realistic metric that prevents false confidence early in your sprint.',
    badge: 'Algorithm',
  },
  {
    id: 'faq-6',
    category: 'Offline & Sync',
    question: 'How do I transfer my goals and notes to a new computer or browser?',
    answer:
      'Go to Settings > Data & Storage, click "Export Backup JSON", and save the file. On your new computer, open Offer Mode, go to Settings > Data & Storage, and click "Import Backup JSON". All 5 career tracks, custom deadlines, milestone statuses, and settings will restore instantaneously.',
    badge: 'Data Portability',
  },
  {
    id: 'faq-7',
    category: 'General',
    question: 'How do I customize my target deadline date and salary package?',
    answer:
      'Open any workstation (e.g., Interview Countdown or Job Hunt Sprint), click the "Edit Track" or "Configure Goal" button near the top header, adjust your target offer date, target company, and total compensation breakdown (Base, Equity, Bonus), then click Save. The countdown and KPI cards update instantly.',
    badge: 'Customization',
  },
  {
    id: 'faq-8',
    category: 'Lock Screen',
    question: 'What is Fullscreen Ambient Focus Mode and how do I trigger it?',
    answer:
      'Press the "L" key on your keyboard from anywhere in the app, or click the "Focus" lock button. It launches an immersive, distraction-free lock screen workstation with zero UI clutter, procedural audio pulses, and real-time seconds. Press Escape or click the exit lock button to return.',
    badge: 'Hotkeys',
  },
  {
    id: 'faq-9',
    category: 'Offline & Sync',
    question: 'How do I reset my data back to original factory presets?',
    answer:
      'In Settings > Data & Storage, click the red "Reset to Factory Demo Data" button. This will safely restore the original 5 curated career tracks and milestone templates without affecting other browser cookies or sites.',
    badge: 'Troubleshooting',
  },
];

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, exportData, importData, resetToDefaults } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Check URL query param for default tab (e.g., /settings?tab=faq)
  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') as SettingsTab) || 'preferences';
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // FAQ State
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Audio Handlers
  const handleSoundToggle = (enabled: boolean) => {
    updateSettings({ soundEnabled: enabled });
    soundEngine.setMuted(!enabled);
    if (enabled) soundEngine.playSuccessChime();
  };

  const handleVolumeChange = (vol: number) => {
    updateSettings({ soundVolume: vol });
    soundEngine.setVolume(vol);
  };

  const handleTestAudio = () => {
    soundEngine.playSuccessChime();
  };

  // Data Import Handler
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        soundEngine.playSuccessChime();
        alert('All tracks, goals, and settings restored successfully!');
      } else {
        alert('Failed to parse backup JSON file. Please verify file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered FAQ items
  const filteredFaqs = useMemo(() => {
    return FAQ_DATABASE.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = faqSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [faqSearch, selectedCategory]);

  const categories = ['All', 'General', 'Lock Screen', 'Passkeys', 'Milestones', 'Offline & Sync'];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <Icon name="Settings" className="w-3.5 h-3.5" />
          <span>System Settings & Knowledge Base</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
          <span>System & Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Configure clock display precision, procedural audio synthesizers, local storage backups, user guides, and comprehensive FAQs.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => {
            soundEngine.playKeyClick();
            setActiveTab('preferences');
          }}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'preferences'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Icon name="Sliders" className="w-4 h-4" />
          <span>Preferences & Audio</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playKeyClick();
            setActiveTab('data');
          }}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'data'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Icon name="Download" className="w-4 h-4" />
          <span>Data & Storage</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playKeyClick();
            setActiveTab('help');
          }}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'help'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Icon name="HelpCircle" className="w-4 h-4" />
          <span>Help & User Guide</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playKeyClick();
            setActiveTab('faq');
          }}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'faq'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Icon name="MessageSquare" className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/30 text-indigo-200">
            {FAQ_DATABASE.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PREFERENCES & AUDIO */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Display & Precision */}
          <Card className="space-y-4 bg-slate-900/70 border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <Icon name="Clock" className="w-4 h-4 text-cyan-400" />
              <span>Clock & Precision Standards</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Time Format</span>
                  <span className="text-[11px] text-slate-400">Toggle between standard 12-hour AM/PM and 24-hour military clock</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playKeyClick();
                      updateSettings({ timeFormat: '12h' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      settings.timeFormat === '12h'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    12-Hour
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playKeyClick();
                      updateSettings({ timeFormat: '24h' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      settings.timeFormat === '24h'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    24-Hour
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">High-Precision Milliseconds</span>
                  <span className="text-[11px] text-slate-400">50ms high-speed tick updates on countdown timers and lock-screen headers</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showMilliseconds}
                  onChange={(e) => {
                    soundEngine.playKeyClick();
                    updateSettings({ showMilliseconds: e.target.checked });
                  }}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer rounded"
                />
              </div>
            </div>
          </Card>

          {/* Procedural Audio Engine */}
          <Card className="space-y-4 bg-slate-900/70 border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                <Icon name="Volume2" className="w-4 h-4 text-emerald-400" />
                <span>Web Audio Synthesizer</span>
              </h3>
              <button
                onClick={handleTestAudio}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                title="Play sample chime"
              >
                <Icon name="Play" className="w-3 h-3" />
                <span>Test Chime</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Procedural Soundscapes</span>
                  <span className="text-[11px] text-slate-400">Synthesizes ambient focus drones, milestone completion chimes, and tactile keyclicks</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => handleSoundToggle(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer rounded"
                />
              </div>

              <div className="py-2">
                <div className="flex justify-between text-xs text-slate-300 mb-2 font-medium">
                  <span>Master Volume</span>
                  <span className="font-mono text-emerald-400">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: DATA & STORAGE */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <Card className="space-y-4 bg-slate-900/70 border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <Icon name="Download" className="w-4 h-4 text-cyan-400" />
              <span>Local Storage & Backup Management</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              All countdown deadlines, milestone checklists, notes, and compensation targets are saved locally in your browser's persistent LocalStorage. You can export a snapshot backup anytime to archive or migrate to another device.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Icon name="ShieldCheck" className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">Local Storage Status: Healthy</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">5 Active Career Tracks Cached</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Button size="sm" iconLeft="Download" onClick={exportData}>
                Export Backup JSON
              </Button>

              <label className="inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 select-none text-xs px-4 py-2.5 gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer">
                <Icon name="Upload" className="w-4 h-4 shrink-0" />
                <span>Import Backup JSON</span>
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>

              <Button
                size="sm"
                variant="danger"
                iconLeft="RefreshCw"
                onClick={() => {
                  if (window.confirm('Reset all 5 career tracks and presets back to factory demo defaults?')) {
                    resetToDefaults();
                    soundEngine.playSuccessChime();
                  }
                }}
              >
                Reset to Factory Defaults
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: HELP & USER GUIDE */}
      {activeTab === 'help' && (
        <div className="space-y-6">
          {/* Quick-Start Workflow */}
          <Card className="space-y-4 bg-slate-900/70 border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <Icon name="HelpCircle" className="w-4 h-4 text-indigo-400" />
              <span>Offer Mode User Guide & Quick-Start</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold font-mono">
                  01
                </div>
                <h4 className="text-xs font-bold text-white">Select Workstation</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Choose between Interview Prep, 30-Day Job Hunt, Skill Upgrade, First Job, or Career Switch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold font-mono">
                  02
                </div>
                <h4 className="text-xs font-bold text-white">Configure Target</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Set your target offer date, company, and target compensation package (base, bonus, equity).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold font-mono">
                  03
                </div>
                <h4 className="text-xs font-bold text-white">Complete Milestones</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Follow the structured 10-12 milestone syllabus. Check off tasks to increase your Readiness Score.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-xs font-bold font-mono">
                  04
                </div>
                <h4 className="text-xs font-bold text-white">Engage Focus Mode</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Press 'L' for an ambient, distraction-free lock screen on your laptop or external monitor.
                </p>
              </div>
            </div>
          </Card>

          {/* Keyboard Shortcuts Reference */}
          <Card className="space-y-4 bg-slate-900/70 border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <Icon name="Activity" className="w-4 h-4 text-cyan-400" />
              <span>Global Keyboard Shortcuts</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Launch Focus Lock Screen</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
                  L
                </kbd>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Jump to Executive Dashboard</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
                  0
                </kbd>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Switch Career Workstations</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
                  1 – 5
                </kbd>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Exit Fullscreen Lock Screen</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
                  Esc
                </kbd>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Toggle Mute / Audio</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
                  M
                </kbd>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Quick Search & Navigation</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
                  /
                </kbd>
              </div>
            </div>
          </Card>

          {/* External Full Docs Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Need deep technical specifications?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Visit the full in-app System Documentation to review countdown mathematics, WebAuthn flows, and mobile guides.
              </p>
            </div>
            <button
              onClick={() => navigate('/help')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              <span>Open System Manual</span>
              <Icon name="ArrowRight" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* FAQ Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Icon
                name="Search"
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search FAQ questions, passkeys, wallpapers, offline use..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundEngine.playKeyClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs">
                No matching questions found for "{faqSearch}". Try searching for "passkey", "wallpaper", or "backup".
              </div>
            ) : (
              filteredFaqs.map((item) => {
                const isExpanded = expandedFaqId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'bg-slate-900/90 border-indigo-500/40 shadow-lg'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playKeyClick();
                        setExpandedFaqId(isExpanded ? null : item.id);
                      }}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-mono">
                          {item.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                          {item.question}
                        </h4>
                      </div>
                      <div className="shrink-0 text-slate-400">
                        {isExpanded ? (
                          <Icon name="ChevronUp" className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Icon name="ChevronDown" className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 animate-fadeIn">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Still Have Questions Banner */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Icon name="MessageSquare" className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Still have questions or found a bug?</h4>
                <p className="text-[11px] text-slate-400">
                  Open an issue on GitHub or review the comprehensive legal terms and privacy disclosures.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate('/terms')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all font-medium"
              >
                Terms of Service
              </button>
              <button
                onClick={() => navigate('/privacy')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all font-medium"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
