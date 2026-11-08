import React, { useState, useEffect } from 'react';
import {
  Compass,
  Plane,
  Sparkles,
  Trophy,
  Plus,
  ShoppingBag,
  Users,
  Palette,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { DreamBucketItem } from '../../types';
import { loadDreams, saveDreams } from '../../services/lifeStorageService';

export const DreamsPage: React.FC = () => {
  const [dreams, setDreams] = useState<DreamBucketItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DreamBucketItem['category']>('travel');
  const [newYear, setNewYear] = useState('2027');
  const [newCost, setNewCost] = useState('3000');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    setDreams(loadDreams());
  }, []);

  const handleToggleStatus = (dreamId: string) => {
    const statusOrder: DreamBucketItem['status'][] = ['dreaming', 'planning', 'booked', 'achieved'];
    const updated = dreams.map((d) => {
      if (d.id === dreamId) {
        const nextIdx = (statusOrder.indexOf(d.status) + 1) % statusOrder.length;
        return { ...d, status: statusOrder[nextIdx] };
      }
      return d;
    });
    setDreams(updated);
    saveDreams(updated);
  };

  const handleAddDream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDream: DreamBucketItem = {
      id: `dream-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetYear: newYear,
      estimatedCost: Number(newCost) || 0,
      status: 'dreaming',
      notes: newNotes.trim(),
    };

    const updated = [newDream, ...dreams];
    setDreams(updated);
    saveDreams(updated);
    setNewTitle('');
    setNewNotes('');
    setIsAddingDream(false);
  };

  const filteredDreams = selectedFilter === 'all'
    ? dreams
    : dreams.filter((d) => d.status === selectedFilter || d.category === selectedFilter);

  const achievedCount = dreams.filter((d) => d.status === 'achieved').length;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-950/40 via-card-bg to-slate-900 border border-pink-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/30">
                <Compass className="w-3.5 h-3.5" />
                Aspirations & Bucket List
              </span>
              <span className="text-xs text-text-muted">Why We Work & Build</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Dreams, Bucket List & Life Adventures
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Career milestones are not the destination; they are the engine that funds the life,
              experiences, family adventures, and creative dreams you actually care about.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-white/5">
            <div className="text-center px-2">
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Dreams Logged</p>
              <p className="text-3xl font-black text-pink-400 mt-1">{dreams.length}</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">{achievedCount} achieved</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <button
              onClick={() => setIsAddingDream(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-pink-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Dream
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['all', 'planning', 'booked', 'achieved', 'travel', 'creative', 'experience', 'purchase'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors ${
              selectedFilter === f
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                : 'bg-card-bg text-text-muted hover:text-white border border-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Dreams Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDreams.map((dream) => {
          const isAchieved = dream.status === 'achieved';

          return (
            <div
              key={dream.id}
              className={`card p-5 border transition-all duration-300 flex flex-col justify-between ${
                isAchieved
                  ? 'border-emerald-500/40 bg-gradient-to-br from-card-bg to-emerald-950/20 shadow-md shadow-emerald-500/10'
                  : 'border-white/5 hover:border-pink-500/30'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-900 border border-white/5 text-slate-300">
                    {dream.category === 'travel' && <Plane className="w-3.5 h-3.5 text-sky-400" />}
                    {dream.category === 'creative' && <Palette className="w-3.5 h-3.5 text-purple-400" />}
                    {dream.category === 'experience' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                    {dream.category === 'purchase' && <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />}
                    {dream.category === 'family' && <Users className="w-3.5 h-3.5 text-pink-400" />}
                    {dream.category}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(dream.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                      dream.status === 'achieved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : dream.status === 'booked'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : dream.status === 'planning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border border-white/5'
                    }`}
                  >
                    {dream.status}
                  </button>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{dream.title}</h3>

                {dream.notes && (
                  <p className="text-xs text-text-muted leading-relaxed">{dream.notes}</p>
                )}
              </div>

              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  Target: {dream.targetYear || 'Flexible'}
                </span>
                {dream.estimatedCost !== undefined && dream.estimatedCost > 0 && (
                  <span className="font-bold text-emerald-400">
                    Est. ${dream.estimatedCost.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Dream Modal */}
      {isAddingDream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-md w-full p-6 border border-pink-500/30 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-pink-400" />
              Capture Life Dream
            </h3>

            <form onSubmit={handleAddDream} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                  Dream Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Road trip across the Swiss Alps"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DreamBucketItem['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="travel">Travel & Adventure</option>
                    <option value="creative">Creative / Open Source</option>
                    <option value="experience">Unique Experience</option>
                    <option value="purchase">Meaningful Purchase</option>
                    <option value="family">Family / Relationship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Target Year
                  </label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="2027"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                  Notes / Inspiration
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Key details, links, or specific places to visit..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDream(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-pink-500/20"
                >
                  Save Dream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamsPage;
