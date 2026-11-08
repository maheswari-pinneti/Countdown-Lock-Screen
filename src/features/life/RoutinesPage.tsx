import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Droplet,
  Heart,
  Brain,
  BookOpen,
  Briefcase,
  Clock,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { HabitItem, DailyRoutineItem, HydrationLog, HabitCategory } from '../../types';
import {
  loadHabits,
  saveHabits,
  loadRoutines,
  saveRoutines,
  loadHydration,
  saveHydration,
} from '../../services/lifeStorageService';
import {
  calculateHabitStreak,
  toggleHabitCompletion,
  isHabitCompletedOnDate,
  calculateConsistencyRate,
} from '../../services/habitService';

export const RoutinesPage: React.FC = () => {
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [routines, setRoutines] = useState<DailyRoutineItem[]>([]);
  const [hydration, setHydration] = useState<HydrationLog>({ date: '', glassesDrank: 0, targetGlasses: 8 });
  const [activeCategory, setActiveCategory] = useState<HabitCategory | 'all'>('all');
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>('health');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setHabits(loadHabits());
    setRoutines(loadRoutines());
    setHydration(loadHydration());
  }, []);

  const handleToggleHabit = (habitId: string) => {
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        return toggleHabitCompletion(h, todayStr);
      }
      return h;
    });
    setHabits(updated);
    saveHabits(updated);
  };

  const handleToggleRoutine = (routineId: string) => {
    const updated = routines.map((r) => {
      if (r.id === routineId) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });
    setRoutines(updated);
    saveRoutines(updated);
  };

  const handleUpdateHydration = (delta: number) => {
    const newGlasses = Math.max(0, Math.min(16, hydration.glassesDrank + delta));
    const updated: HydrationLog = { ...hydration, glassesDrank: newGlasses };
    setHydration(updated);
    saveHydration(updated);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: HabitItem = {
      id: `habit-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      frequency: 'daily',
      targetDaysPerWeek: 7,
      streakCount: 0,
      longestStreak: 0,
      completedDates: [],
      recoveryGraceDays: 1,
      restDays: [],
      createdAt: todayStr,
    };

    const updated = [newHabit, ...habits];
    setHabits(updated);
    saveHabits(updated);
    setNewTitle('');
    setIsAddingHabit(false);
  };

  // Past 7 days array
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const habitsInRecovery = habits.filter((h) => {
    const status = calculateHabitStreak(h, todayStr);
    return status.inRecoveryMode;
  });

  const filteredHabits = activeCategory === 'all'
    ? habits
    : habits.filter((h) => h.category === activeCategory);

  const completedTodayCount = habits.filter((h) => isHabitCompletedOnDate(h, todayStr)).length;
  const completionRate = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner: Anti-Guilt Philosophy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-card-bg to-slate-900 border border-emerald-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Anti-Guilt Habit Architecture
              </span>
              <span className="text-xs text-text-muted">Rule of Consistency</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Life Command: Routines & Habits
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              &ldquo;Never miss twice.&rdquo; Real life has unexpected meetings, late nights, and sickness.
              One missed day is life; two is the start of a new habit. Recover immediately with zero guilt.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-white/5">
            <div className="text-center px-2">
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Today&apos;s Score</p>
              <p className="text-2xl md:text-3xl font-black text-emerald-400 mt-1">{completionRate}%</p>
              <p className="text-[11px] text-text-muted mt-0.5">{completedTodayCount} of {habits.length} done</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <button
              onClick={() => setIsAddingHabit(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              New Habit
            </button>
          </div>
        </div>

        {/* Recovery Alert if any habit is in recovery mode */}
        {habitsInRecovery.length > 0 && (
          <div className="mt-6 flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-amber-300">Recovery Opportunity: </span>
              You missed {habitsInRecovery.length} habit{habitsInRecovery.length > 1 ? 's' : ''} yesterday ({habitsInRecovery.map((h) => h.title).join(', ')}).
              Complete today to safeguard your streak under the 1-day grace rule!
            </div>
          </div>
        )}
      </div>

      {/* Hydration & Daily Energy Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 md:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Hydration Log</h3>
                <p className="text-xs text-text-muted">Target: 2.5 Liters (8 Glasses)</p>
              </div>
            </div>
            <span className="text-lg font-black text-sky-400">
              {hydration.glassesDrank} / {hydration.targetGlasses}
            </span>
          </div>

          {/* Glass visual counters */}
          <div className="grid grid-cols-8 gap-1.5 my-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-9 rounded-md flex items-center justify-center transition-all duration-300 border ${
                  i < hydration.glassesDrank
                    ? 'bg-sky-500/30 border-sky-400/50 text-sky-300'
                    : 'bg-slate-900/40 border-white/5 text-slate-600'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <button
              onClick={() => handleUpdateHydration(-1)}
              className="flex-1 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-xs font-semibold text-text-muted hover:text-white transition-colors"
            >
              - 1 Glass
            </button>
            <button
              onClick={() => handleUpdateHydration(1)}
              className="flex-1 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold transition-colors"
            >
              + Drink Glass (300ml)
            </button>
          </div>
        </div>

        {/* Daily Routine Flow (Morning, Afternoon, Evening) */}
        <div className="card p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Daily Rituals & Anchor Routines</h3>
                <p className="text-xs text-text-muted">High-leverage low-friction energy rituals</p>
              </div>
            </div>
            <button
              onClick={() => {
                const reset = routines.map((r) => ({ ...r, completed: false }));
                setRoutines(reset);
                saveRoutines(reset);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
              title="Reset routines for today"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Rituals
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['morning', 'afternoon', 'evening'] as const).map((period) => {
              const periodItems = routines.filter((r) => r.period === period);
              const periodDone = periodItems.filter((r) => r.completed).length;

              return (
                <div key={period} className="bg-slate-950/40 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                        {period === 'morning' ? '🌅 Morning' : period === 'afternoon' ? '☀️ Afternoon' : '🌙 Evening'}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-400">
                        {periodDone}/{periodItems.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {periodItems.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleToggleRoutine(r.id)}
                          className="w-full flex items-start gap-2 text-left group p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          {r.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs leading-snug line-clamp-2 ${r.completed ? 'line-through text-text-muted' : 'text-slate-200'}`}>
                              {r.title}
                            </p>
                            {r.timeEstimate && (
                              <span className="text-[10px] text-text-muted">{r.timeEstimate}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Habits Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Core Habit Trackers & Streak Engine
          </h2>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'health', 'career', 'routine', 'learning', 'mindset'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-card-bg hover:bg-slate-800 text-text-muted hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Habit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map((habit) => {
            const streakStatus = calculateHabitStreak(habit, todayStr);
            const isDoneToday = isHabitCompletedOnDate(habit, todayStr);
            const consistencyRate = calculateConsistencyRate(habit);

            return (
              <div
                key={habit.id}
                className={`card p-5 transition-all duration-200 flex flex-col justify-between border ${
                  isDoneToday
                    ? 'border-emerald-500/30 bg-gradient-to-br from-card-bg to-emerald-950/20'
                    : streakStatus.inRecoveryMode
                    ? 'border-amber-500/30 bg-gradient-to-br from-card-bg to-amber-950/20'
                    : 'border-white/5'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800/80 text-text-muted">
                        {habit.category === 'health' && <Heart className="w-3 h-3 text-rose-400" />}
                        {habit.category === 'career' && <Briefcase className="w-3 h-3 text-cyan-400" />}
                        {habit.category === 'learning' && <BookOpen className="w-3 h-3 text-amber-400" />}
                        {habit.category === 'mindset' && <Brain className="w-3 h-3 text-purple-400" />}
                        {habit.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5 leading-snug">
                        {habit.title}
                      </h4>
                    </div>

                    {/* Streak Badge */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-black text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {streakStatus.currentStreak}d
                    </div>
                  </div>

                  {/* 7-Day Mini Sparkline */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <span>Past 7 Days</span>
                      <span>{consistencyRate}% 30d consistency</span>
                    </div>
                    <div className="flex items-center justify-between gap-1.5 bg-slate-950/40 p-2 rounded-lg border border-white/5">
                      {last7Days.map((dStr, idx) => {
                        const done = isHabitCompletedOnDate(habit, dStr);
                        const isToday = dStr === todayStr;
                        const dayLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(dStr).getDay()];

                        return (
                          <div key={dStr} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[9px] text-text-muted font-bold">{dayLabel}</span>
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                                done
                                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm shadow-emerald-500/30'
                                  : isToday
                                  ? 'border border-dashed border-emerald-400/60 text-emerald-400'
                                  : 'bg-slate-900 text-slate-600'
                              }`}
                            >
                              {done ? '✓' : idx === 6 ? '•' : ''}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-4 mt-2 border-t border-white/5">
                  <button
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 ${
                      isDoneToday
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : streakStatus.inRecoveryMode
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                        : 'bg-slate-800 hover:bg-slate-750 text-white hover:border-white/20 border border-transparent'
                    }`}
                  >
                    {isDoneToday ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Completed Today!
                      </>
                    ) : streakStatus.inRecoveryMode ? (
                      <>
                        <ShieldAlert className="w-4 h-4 text-slate-950" />
                        Protect Streak Today!
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-text-muted" />
                        Mark Complete Today
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      {isAddingHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-md w-full p-6 border border-emerald-500/30 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Create Anti-Guilt Habit
            </h3>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 15m System Design Reading"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as HabitCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="health">Health & Vitality</option>
                  <option value="career">Career & Skill Building</option>
                  <option value="routine">Daily Routine & Focus</option>
                  <option value="learning">Continuous Learning</option>
                  <option value="mindset">Mindset & Well-being</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                💡 Every habit automatically includes a 1-day anti-guilt recovery grace window.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingHabit(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutinesPage;
