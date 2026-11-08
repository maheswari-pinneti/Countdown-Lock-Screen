import React, { useState, useEffect } from 'react';
import {
  BookHeart,
  Smile,
  ShieldCheck,
  Send,
  Calendar,
  Sparkles,
  Trophy,
  Tag,
  Search,
} from 'lucide-react';
import { JournalEntry, MoodScore } from '../../types';
import { loadJournalEntries, saveJournalEntries } from '../../services/lifeStorageService';

const MOOD_OPTIONS: { score: MoodScore; label: string; icon: string; color: string }[] = [
  { score: 1, label: 'Exhausted', icon: '😴', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { score: 2, label: 'Anxious', icon: '🌧️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { score: 3, label: 'Steady', icon: '🌱', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { score: 4, label: 'Energized', icon: '⚡', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
  { score: 5, label: 'In Flow', icon: '🚀', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
];

const QUICK_TAGS = ['Mindset', 'Growth', 'Interview Prep', 'Breakthrough', 'Resilience', 'Rest'];

export const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodScore>(4);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Mindset']);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [winOfTheDay, setWinOfTheDay] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setEntries(loadJournalEntries());
  }, []);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim() && !winOfTheDay.trim()) return;

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      date: todayStr,
      title: title.trim() || `Daily Reflection (${new Date().toLocaleDateString()})`,
      content: content.trim(),
      mood: selectedMood,
      moodTags: selectedTags,
      gratitude: [gratitude1.trim(), gratitude2.trim(), gratitude3.trim()],
      winOfTheDay: winOfTheDay.trim(),
      tags: selectedTags,
      isLocked: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveJournalEntries(updated);

    // Reset inputs
    setTitle('');
    setContent('');
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setWinOfTheDay('');
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredEntries = entries.filter((entry) => {
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q) ||
      (entry.winOfTheDay && entry.winOfTheDay.toLowerCase().includes(q)) ||
      (entry.tags && entry.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/40 via-card-bg to-slate-900 border border-purple-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                <BookHeart className="w-3.5 h-3.5" />
                Private Well-Being & Mindset Vault
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Local-First Offline Encryption
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Private Journal & Emotional Decompression
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Job searches and high-stakes goals can be taxing. Journaling grounds your nervous system,
              anchors self-efficacy through micro-wins, and turns anxious thoughts into structured reflection.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 text-center px-6">
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Total Reflections</p>
            <p className="text-3xl font-black text-purple-400 mt-1">{entries.length}</p>
            <p className="text-[11px] text-text-muted mt-0.5">Anchored in memory</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Journal Entry Editor */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveEntry} className="card p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Today&apos;s Mindset & Decompression
              </h2>
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Mood Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5" />
                How are you feeling right now?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {MOOD_OPTIONS.map((mood) => {
                  const isSelected = selectedMood === mood.score;
                  return (
                    <button
                      key={mood.score}
                      type="button"
                      onClick={() => setSelectedMood(mood.score)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? `${mood.color} scale-[1.03] shadow-md`
                          : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xl">{mood.icon}</span>
                      <span className="text-[10px] font-bold">{mood.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Win of the Day */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5 text-amber-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Win of the Day (Big or Small)
              </label>
              <input
                type="text"
                value={winOfTheDay}
                onChange={(e) => setWinOfTheDay(e.target.value)}
                placeholder="e.g. Mastered distributed rate limiting algorithm or stayed calm during interview"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Gratitude Prompts */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Three Things I Am Grateful For
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={gratitude1}
                  onChange={(e) => setGratitude1(e.target.value)}
                  placeholder="1. Something about today that brought peace or clarity..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={gratitude2}
                  onChange={(e) => setGratitude2(e.target.value)}
                  placeholder="2. A person, mentor, or friend who supported me..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={gratitude3}
                  onChange={(e) => setGratitude3(e.target.value)}
                  placeholder="3. An opportunity to grow or build something meaningful..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Title & Freeform Reflection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Freeform Mindset Stream / Brain Dump
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title (e.g. Breaking through the plateau)..."
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
              />
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write freely. No one is judging. Untangle your thoughts, reframe challenges, or celebrate a breakthrough..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 resize-y"
              />
            </div>

            {/* Tag Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                        isChecked
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-slate-900 text-slate-400 border border-white/5 hover:border-white/20'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-xs text-emerald-400 font-medium">
                {isSavedRecently && '✓ Saved to your local vault!'}
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                <Send className="w-3.5 h-3.5" />
                Save Reflection
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Historical Entries Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Journal History
            </h2>
            <div className="relative flex-1 max-w-[200px]">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="card p-8 text-center text-text-muted space-y-2">
                <BookHeart className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold">No journal entries found</p>
                <p className="text-xs">Your reflections will appear here securely stored in your local browser.</p>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const moodObj = MOOD_OPTIONS.find((m) => m.score === entry.mood);

                return (
                  <div key={entry.id} className="card p-5 border border-white/5 space-y-3 hover:border-purple-500/20 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{moodObj?.icon || '📝'}</span>
                          <span className="text-xs font-semibold text-text-muted">
                            {new Date(entry.createdAt || entry.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-base mt-1">{entry.title}</h3>
                      </div>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-purple-300">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Win of the Day */}
                    {entry.winOfTheDay && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                        <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-300">Win: </span>
                          {entry.winOfTheDay}
                        </div>
                      </div>
                    )}

                    {/* Content snippet */}
                    {entry.content && (
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                        {entry.content}
                      </p>
                    )}

                    {/* Gratitude bullets */}
                    {entry.gratitude && entry.gratitude.some(Boolean) && (
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-500">Gratitudes:</p>
                        {entry.gratitude.filter(Boolean).map((g, idx) => (
                          <p key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                            <span className="text-purple-400 font-bold">•</span>
                            <span>{g}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
