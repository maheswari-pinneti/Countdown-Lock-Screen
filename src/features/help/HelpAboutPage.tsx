import React, { useState, useMemo } from 'react';
import { DOCUMENTATION_REGISTRY, DocSection } from '../../data/documentationData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import { soundEngine } from '../../services/soundEngine';

export const HelpAboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'guide'>('docs');
  const [selectedDocId, setSelectedDocId] = useState<string>('architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  // Filter docs by search query
  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return DOCUMENTATION_REGISTRY;
    const q = searchQuery.toLowerCase();
    return DOCUMENTATION_REGISTRY.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q)) ||
        doc.markdown.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeDoc = useMemo(
    () => DOCUMENTATION_REGISTRY.find((d) => d.id === selectedDocId) || DOCUMENTATION_REGISTRY[0],
    [selectedDocId]
  );

  const categories = ['Architecture & Dev', 'Core Engines', 'Features & Systems', 'Quality & Mobile'] as const;

  const handleCopyCode = (code: string, idx: number) => {
    soundEngine.playKeyClick();
    navigator.clipboard.writeText(code.trim());
    setCopiedCodeIndex(idx);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Simple Markdown Line Formatter for in-app reading
  const renderFormattedMarkdown = (markdown: string) => {
    const lines = markdown.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeBlockIndex = 0;

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Closing code block
          const codeString = codeBuffer.join('\n');
          const currentIdx = codeBlockIndex;
          elements.push(
            <div key={`code-${idx}`} className="relative my-4 rounded-2xl bg-black/80 border border-zinc-800 p-4 font-mono text-xs overflow-x-auto group">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                <span>Code / Shell Script</span>
                <button
                  onClick={() => handleCopyCode(codeString, currentIdx)}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[10px]"
                >
                  <Icon name="Copy" className="w-3 h-3" />
                  <span>{copiedCodeIndex === currentIdx ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-cyan-300 leading-relaxed">{codeString}</pre>
            </div>
          );
          codeBuffer = [];
          codeBlockIndex++;
          inCodeBlock = false;
        } else {
          // Opening code block
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={`empty-${idx}`} className="h-2" />);
        return;
      }

      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${idx}`} className="text-xl sm:text-2xl font-black text-white tracking-tight mt-6 mb-3 border-b border-zinc-800 pb-2">
            {trimmed.replace('# ', '')}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${idx}`} className="text-base sm:text-lg font-bold text-white tracking-tight mt-5 mb-2 text-cyan-400">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${idx}`} className="text-sm font-bold text-zinc-200 mt-4 mb-1">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        elements.push(
          <li key={`li-${idx}`} className="text-xs sm:text-sm text-zinc-300 ml-4 list-disc my-1 leading-relaxed">
            {trimmed.replace(/^[-•]\s*/, '')}
          </li>
        );
      } else if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
        elements.push(
          <div key={`math-${idx}`} className="my-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-xs sm:text-sm text-cyan-300 text-center tracking-wide">
            {trimmed.replace(/\$\$/g, '')}
          </div>
        );
      } else {
        elements.push(
          <p key={`p-${idx}`} className="text-xs sm:text-sm text-zinc-300 leading-relaxed my-1.5">
            {trimmed}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Knowledge Base & Engineering Manual
            </span>
            <Badge label="v2.0.0 Web-First" variant="cyan" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Documentation, System Manual & Guides
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse full in-app technical specifications, architectural blueprints, countdown mathematics, and smartphone guides.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              setActiveTab('docs');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'docs'
                ? 'bg-cyan-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon name="BookOpen" className="w-3.5 h-3.5" />
            <span>Interactive Docs</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playKeyClick();
              setActiveTab('guide');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guide'
                ? 'bg-cyan-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon name="Compass" className="w-3.5 h-3.5" />
            <span>User Guide & Shortcuts</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE DOCUMENTATION VIEWER */}
      {activeTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Documentation Sidebar / Table of Contents (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Icon name="Search" className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Document Navigation Tree */}
            <div className="p-3 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-4 max-h-[700px] overflow-y-auto scrollbar-thin">
              {categories.map((cat) => {
                const catDocs = filteredDocs.filter((d) => d.category === cat);
                if (catDocs.length === 0) return null;

                return (
                  <div key={cat} className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                      {cat}
                    </div>

                    {catDocs.map((doc) => {
                      const isSelected = selectedDocId === doc.id;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => {
                            soundEngine.playKeyClick();
                            setSelectedDocId(doc.id);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-1 ${
                            isSelected
                              ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm'
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate">{doc.title}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                              {doc.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 line-clamp-1">{doc.summary}</p>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active Document Reader (8 cols) */}
          <div className="lg:col-span-8">
            <Card className="p-6 md:p-8 space-y-6">
              {/* Doc Header */}
              <div className="border-b border-zinc-800 pb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    {activeDoc.category}
                  </span>
                  <Badge label={activeDoc.badge} variant="cyan" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeDoc.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">{activeDoc.summary}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeDoc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Formatted Content */}
              <div className="space-y-2 text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {renderFormattedMarkdown(activeDoc.markdown)}
              </div>

              {/* Footer Links */}
              <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span className="font-mono">Source: docs/{activeDoc.id.toUpperCase().replace('-', '_')}.md</span>
                <span className="text-cyan-400 font-bold">OFFER MODE v2.0.0 Architecture</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 2: USER GUIDE, SMARTPHONE SETUP & HOTKEYS */}
      {activeTab === 'guide' && (
        <div className="space-y-8 animate-fadeIn">
          {/* The 5 Experiences */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Icon name="Compass" className="w-4 h-4 text-cyan-400" />
              <span>The 5 Core Career Modules</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Icon name="Calendar" className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">1. Interview Countdown</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Target technical, coding, HR, and managerial interviews. Tracks round formats, meeting links, prep notes, and countdown timers.
                </p>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <Icon name="Briefcase" className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">2. 30-Day Job Hunt Sprint</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Structured sprint for aggressive job searches. Manage daily application targets, recruiter follow-ups, resume updates, and interview pipeline.
                </p>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <Icon name="Code" className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">3. Developer Skill Upgrade</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Deep-skill mastery for Staff/Senior leveling. Tracks React, TypeScript, DSA, System Design, daily study hours, and capstone milestones.
                </p>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <Icon name="GraduationCap" className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">4. First Job Countdown</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tailored for campus graduates and freshers. Tracks joining date, relocation, onboarding documents, background check, and day-one readiness.
                </p>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    <Icon name="ArrowRightLeft" className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">5. Career Switch Countdown</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Pivoting stacks or industries (e.g. Non-tech to Software Engineer). Manage target role transitions, bridge portfolios, and runway milestones.
                </p>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    <Icon name="Palette" className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Countdown Studio</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Export pixel-perfect 9:16 lock-screen wallpapers with live countdown stats, custom themes, phone safe guides, and PNG export.
                </p>
              </Card>
            </div>
          </div>

          {/* Guide: How to use Wallpaper on Phone */}
          <Card>
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Icon name="Smartphone" className="w-4 h-4 text-cyan-400" />
              <span>Setting Your Exported Wallpaper on Your Phone</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400 leading-relaxed">
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span>🍎 iPhone / iOS Instructions</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>In <strong className="text-zinc-200">Countdown Studio</strong>, customize your goal and click <strong className="text-cyan-400">Export Lock Screen PNG</strong>.</li>
                  <li>Save or AirDrop the image to your iPhone Photos.</li>
                  <li>Open <strong className="text-zinc-200">Settings → Wallpaper → Add New Wallpaper → Photos</strong>.</li>
                  <li>Select your downloaded OFFER MODE wallpaper. The native iOS clock aligns cleanly inside the designated safe zone!</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span>🤖 Android Instructions</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Export your wallpaper using the standard <strong className="text-cyan-400">9:16, 9:19.5, or 9:20</strong> aspect ratio.</li>
                  <li>Transfer or download the PNG to your device.</li>
                  <li>Long press your Android home screen and select <strong className="text-zinc-200">Wallpaper & Style</strong>.</li>
                  <li>Select the PNG file and set as <strong className="text-zinc-200">Lock Screen</strong>.</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Keyboard Shortcuts Reference */}
          <Card>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Sliders" className="w-4 h-4 text-emerald-400" />
              <span>Executive Hotkeys & Keyboard Navigation</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Lock Screen</span>
                <kbd className="px-2 py-1 rounded bg-[#0F172A] border border-zinc-700 text-cyan-400 font-mono font-bold">L</kbd>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Dashboard</span>
                <kbd className="px-2 py-1 rounded bg-[#0F172A] border border-zinc-700 text-cyan-400 font-mono font-bold">0</kbd>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Interview Module</span>
                <kbd className="px-2 py-1 rounded bg-[#0F172A] border border-zinc-700 text-cyan-400 font-mono font-bold">1</kbd>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Job Hunt Sprint</span>
                <kbd className="px-2 py-1 rounded bg-[#0F172A] border border-zinc-700 text-cyan-400 font-mono font-bold">2</kbd>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Developer Upgrade</span>
                <kbd className="px-2 py-1 rounded bg-[#0F172A] border border-zinc-700 text-cyan-400 font-mono font-bold">3</kbd>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">First Job Track</span>
                <kbd className="px-2 py-1 rounded bg-[#0F172A] border border-zinc-700 text-cyan-400 font-mono font-bold">4</kbd>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Career Switch</span>
                <kbd className="px-2 py-1 rounded bg-[#0F172A] border border-zinc-700 text-cyan-400 font-mono font-bold">5</kbd>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Exit Fullscreen</span>
                <kbd className="px-2 py-1 rounded bg-[#0F172A] border border-zinc-700 text-zinc-400 font-mono font-bold">ESC</kbd>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
