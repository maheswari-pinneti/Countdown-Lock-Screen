import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Command,
  Compass,
  Sparkles,
  BookHeart,
  Timer,
  Wallet,
  Brain,
  GraduationCap,
  Briefcase,
  Layers,
  Settings,
  HelpCircle,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { loadHabits, loadSecondBrainNotes } from '../../services/lifeStorageService';

interface CommandItem {
  id: string;
  title: string;
  category: 'Command Center' | 'Career Tracks' | 'Habits' | 'Second Brain' | 'Quick Actions';
  path?: string;
  action?: () => void;
  icon: React.ReactNode;
}

interface GlobalCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalCommandBar: React.FC<GlobalCommandBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build searchable index
  const baseItems: CommandItem[] = [
    // Life Command Center
    { id: 'nav-home', title: 'Executive Home Dashboard', category: 'Command Center', path: '/', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
    { id: 'nav-routines', title: 'Routines & Anti-Guilt Habits', category: 'Command Center', path: '/life', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { id: 'nav-journal', title: 'Private Journal & Mindset Decompression', category: 'Command Center', path: '/journal', icon: <BookHeart className="w-4 h-4 text-purple-400" /> },
    { id: 'nav-planner', title: 'Smart Daily Planner & MITs', category: 'Command Center', path: '/planner', icon: <Compass className="w-4 h-4 text-blue-400" /> },
    { id: 'nav-focus', title: 'Deep Work Focus Hub & Ambient Audio', category: 'Command Center', path: '/focus', icon: <Timer className="w-4 h-4 text-teal-400" /> },
    { id: 'nav-learning', title: 'Career Learning Center & Roadmaps', category: 'Career Tracks', path: '/learning', icon: <GraduationCap className="w-4 h-4 text-amber-400" /> },

    // Career Workstations
    { id: 'track-overview', title: 'Executive Countdown Hub', category: 'Career Tracks', path: '/countdowns', icon: <Briefcase className="w-4 h-4 text-cyan-400" /> },
    { id: 'track-interview', title: 'Interview Countdown Workstation', category: 'Career Tracks', path: '/interview', icon: <Briefcase className="w-4 h-4 text-cyan-400" /> },
    { id: 'track-job-hunt', title: '30-Day Job Hunt Sprint CRM', category: 'Career Tracks', path: '/job-hunt', icon: <Briefcase className="w-4 h-4 text-cyan-400" /> },
    { id: 'track-developer', title: 'Developer Skill Upgrade Track', category: 'Career Tracks', path: '/developer', icon: <Briefcase className="w-4 h-4 text-cyan-400" /> },
    { id: 'track-first-job', title: 'First Tech Job Acceleration Track', category: 'Career Tracks', path: '/first-job', icon: <Briefcase className="w-4 h-4 text-cyan-400" /> },
    { id: 'track-career-switch', title: 'Strategic Career Switch Track', category: 'Career Tracks', path: '/career-switch', icon: <Briefcase className="w-4 h-4 text-cyan-400" /> },

    // Dreams, Finance & Studio
    { id: 'nav-finance', title: 'Personal Finance & Career Runway', category: 'Command Center', path: '/finance', icon: <Wallet className="w-4 h-4 text-emerald-400" /> },
    { id: 'nav-dreams', title: 'Dreams & Life Bucket List', category: 'Command Center', path: '/dreams', icon: <Compass className="w-4 h-4 text-pink-400" /> },
    { id: 'nav-second-brain', title: 'Personal Second Brain (P.A.R.A.)', category: 'Second Brain', path: '/second-brain', icon: <Brain className="w-4 h-4 text-indigo-400" /> },
    { id: 'nav-studio', title: 'Lock Screen Wallpaper Studio', category: 'Quick Actions', path: '/countdown-studio', icon: <Sparkles className="w-4 h-4 text-yellow-400" /> },
    { id: 'nav-settings', title: 'Security & App Settings', category: 'Quick Actions', path: '/settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
    { id: 'nav-help', title: 'Documentation & Architecture FAQs', category: 'Quick Actions', path: '/help', icon: <HelpCircle className="w-4 h-4 text-slate-400" /> },
  ];

  // Dynamically load user habits and second-brain notes into search
  const habits = loadHabits();
  const habitItems: CommandItem[] = habits.map((h) => ({
    id: `cmd-habit-${h.id}`,
    title: `Habit: ${h.title} (${h.streakCount}d streak)`,
    category: 'Habits',
    path: '/life',
    icon: <Flame className="w-4 h-4 text-amber-400" />,
  }));

  const notes = loadSecondBrainNotes();
  const noteItems: CommandItem[] = notes.map((n) => ({
    id: `cmd-note-${n.id}`,
    title: `Note: ${n.title}`,
    category: 'Second Brain',
    path: '/second-brain',
    icon: <Brain className="w-4 h-4 text-indigo-400" />,
  }));

  const allItems = [...baseItems, ...habitItems, ...noteItems];

  const filteredItems = allItems.filter((item) => {
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  const handleSelect = (item: CommandItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="card max-w-xl w-full border border-white/20 shadow-2xl overflow-hidden animate-scaleIn bg-slate-950/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search across your entire command center..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-slate-500"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-900 border border-white/10 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-text-muted space-y-1">
              <Command className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold">No commands found</p>
              <p className="text-xs">Try searching for &quot;Habits&quot;, &quot;Journal&quot;, &quot;Focus&quot;, or &quot;System Design&quot;</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                    isSelected
                      ? 'bg-slate-800/90 text-white border border-white/10'
                      : 'text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.title}</p>
                      <span className="text-[10px] text-text-muted uppercase font-semibold">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 text-text-muted transition-transform ${isSelected ? 'translate-x-1 text-white' : ''}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-900/50 border-t border-white/5 flex items-center justify-between text-[11px] text-text-muted">
          <span>Navigate with <kbd className="px-1 rounded bg-slate-800">↑</kbd> <kbd className="px-1 rounded bg-slate-800">↓</kbd></span>
          <span>Select with <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-bold">↵</kbd></span>
        </div>
      </div>
    </div>
  );
};

export default GlobalCommandBar;
