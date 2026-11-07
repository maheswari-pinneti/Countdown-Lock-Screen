import React, { useState } from 'react';
import { CareerExperience } from '../../types';
import { Icon } from '../common/Icon';
import { formatCurrency } from '../../utils/date';
import { soundEngine } from '../../services/soundEngine';

interface SimpleKpiCardsProps {
  experiences: CareerExperience[];
  className?: string;
  onExploreTrack?: (trackId: string) => void;
}

type Timeframe = '7d' | '30d' | 'quarter' | 'all';
type ViewMode = 'values' | 'targets';

export const SimpleKpiCards: React.FC<SimpleKpiCardsProps> = ({
  experiences,
  className = '',
  onExploreTrack,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [viewMode, setViewMode] = useState<ViewMode>('values');
  const [showInspoModal, setShowInspoModal] = useState<boolean>(false);

  // Compute live aggregate metrics
  const totalTargetComp = experiences.reduce((acc, exp) => acc + (exp.compensation?.targetTotalComp || 0), 0);
  const totalMilestones = experiences.reduce((acc, exp) => acc + exp.milestones.length, 0);
  const completedMilestones = experiences.reduce(
    (acc, exp) => acc + exp.milestones.filter((m) => m.completed).length,
    0
  );
  const milestoneRate = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  
  // Median days remaining
  const now = new Date().getTime();
  const daysRemainingList = experiences.map((exp) => {
    const diff = new Date(exp.targetOfferDate).getTime() - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }).sort((a, b) => a - b);
  const medianDays = daysRemainingList.length > 0
    ? daysRemainingList[Math.floor(daysRemainingList.length / 2)]
    : 21;

  // Max streak
  const maxStreak = Math.max(...experiences.map((exp) => exp.streakDays || 0), 14);

  // Average readiness
  const avgReadiness = Math.round(
    experiences.reduce((acc, exp) => acc + (exp.readinessScore || 70), 0) / (experiences.length || 1)
  );

  // Timeframe modifiers
  const timeframeMultiplier = timeframe === '7d' ? 0.35 : timeframe === '30d' ? 1.0 : timeframe === 'quarter' ? 2.4 : 3.8;

  // Trend data points for SVG sparklines
  const compSparkline = [
    { x: 0, y: 38 },
    { x: 18, y: 32 },
    { x: 36, y: 35 },
    { x: 54, y: 22 },
    { x: 72, y: 25 },
    { x: 90, y: 14 },
    { x: 110, y: 8 },
  ];

  const velocitySparkline = [
    { x: 0, y: 36 },
    { x: 18, y: 28 },
    { x: 36, y: 24 },
    { x: 54, y: 20 },
    { x: 72, y: 15 },
    { x: 90, y: 10 },
    { x: 110, y: 6 },
  ];

  const burndownSparkline = [
    { x: 0, y: 8 },
    { x: 18, y: 14 },
    { x: 36, y: 18 },
    { x: 54, y: 24 },
    { x: 72, y: 28 },
    { x: 90, y: 32 },
    { x: 110, y: 36 },
  ];

  const focusBars = [14, 22, 18, 28, 35, 42, 38];

  return (
    <section className={`space-y-4 ${className}`}>
      {/* Header bar: SimpleKPI Title, Controls, Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Icon name="Gauge" className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight font-display">
                Executive KPI Cards
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SimpleKPI Standard
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live executive metrics, sparkline velocity, and performance targets across your career pipeline.
            </p>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
            <button
              onClick={() => {
                soundEngine.playKeyClick();
                setViewMode('values');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'values'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Values
            </button>
            <button
              onClick={() => {
                soundEngine.playKeyClick();
                setViewMode('targets');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'targets'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              % Target
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
            {(['7d', '30d', 'quarter', 'all'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  soundEngine.playKeyClick();
                  setTimeframe(tf);
                }}
                className={`px-2 py-1 rounded-lg font-medium uppercase transition-all ${
                  timeframe === tf
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Design Inspo Button */}
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              setShowInspoModal(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all font-medium"
            title="Design System & UI Library References"
          >
            <Icon name="Sparkles" className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Design Stack</span>
          </button>
        </div>
      </div>

      {/* Bento Grid: 5 SimpleKPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Pipeline Compensation */}
        <div className="kpi-card p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Icon name="DollarSign" className="w-3.5 h-3.5 text-emerald-400" />
                <span>Comp Pipeline</span>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                <Icon name="TrendingUp" className="w-2.5 h-2.5" />
                <span>+18.4%</span>
              </span>
            </div>

            <div className="mt-1">
              <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums font-display">
                {viewMode === 'values'
                  ? formatCurrency(totalTargetComp, true)
                  : `${Math.round((totalTargetComp / 1000000) * 100)}%`}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Target: $1.00M • <span className="text-emerald-400 font-medium">105% Achieved</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60">
            {/* Area Sparkline */}
            <div className="h-8 w-full flex items-end">
              <svg className="w-full h-8 overflow-visible" viewBox="0 0 110 40">
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0 38 L18 32 L36 35 L54 22 L72 25 L90 14 L110 8 L110 40 L0 40 Z`}
                  fill="url(#compGrad)"
                />
                <path
                  d={`M0 38 L18 32 L36 35 L54 22 L72 25 L90 14 L110 8`}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  className="sparkline-emerald-glow"
                />
                <circle cx="110" cy="8" r="3" fill="#10B981" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Baseline</span>
              <span className="text-emerald-400 font-semibold">Ahead of Target</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Sprint Velocity & Completion */}
        <div className="kpi-card p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Icon name="Zap" className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sprint Velocity</span>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 flex items-center gap-0.5">
                <Icon name="TrendingUp" className="w-2.5 h-2.5" />
                <span>+12.6%</span>
              </span>
            </div>

            <div className="mt-1">
              <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums font-display">
                {viewMode === 'values'
                  ? `${milestoneRate.toFixed(1)}%`
                  : `${Math.round((milestoneRate / 75) * 100)}%`}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {completedMilestones} of {totalMilestones} done • <span className="text-indigo-300 font-medium">+5.4% vs Pace</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60">
            {/* Velocity Curve Sparkline */}
            <div className="h-8 w-full flex items-end">
              <svg className="w-full h-8 overflow-visible" viewBox="0 0 110 40">
                <defs>
                  <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0 36 L18 28 L36 24 L54 20 L72 15 L90 10 L110 6 L110 40 L0 40 Z`}
                  fill="url(#velGrad)"
                />
                <path
                  d={`M0 36 L18 28 L36 24 L54 20 L72 15 L90 10 L110 6`}
                  fill="none"
                  stroke="#818CF8"
                  strokeWidth="2"
                  className="sparkline-filter-glow"
                />
                <circle cx="110" cy="6" r="3" fill="#818CF8" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Goal: 75%</span>
              <span className="text-indigo-300 font-semibold">High Velocity</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Median Days to Offer */}
        <div className="kpi-card p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Icon name="Target" className="w-3.5 h-3.5 text-amber-400" />
                <span>Days to Offer</span>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                <Icon name="Clock" className="w-2.5 h-2.5" />
                <span>-4 Days</span>
              </span>
            </div>

            <div className="mt-1">
              <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums font-display">
                {viewMode === 'values'
                  ? `${medianDays} Days`
                  : `${Math.round(((30 - medianDays) / 30) * 100)}% Ahead`}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Median active countdown • <span className="text-amber-400 font-medium">Schedule On Track</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60">
            {/* Burndown Sparkline */}
            <div className="h-8 w-full flex items-end">
              <svg className="w-full h-8 overflow-visible" viewBox="0 0 110 40">
                <defs>
                  <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0 8 L18 14 L36 18 L54 24 L72 28 L90 32 L110 36 L110 40 L0 40 Z`}
                  fill="url(#burnGrad)"
                />
                <path
                  d={`M0 8 L18 14 L36 18 L54 24 L72 28 L90 32 L110 36`}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  className="sparkline-amber-glow"
                />
                <circle cx="110" cy="36" r="3" fill="#F59E0B" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Target: 30d</span>
              <span className="text-amber-400 font-semibold">9d Buffer</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Daily Momentum & Focus Hours */}
        <div className="kpi-card p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Icon name="Flame" className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deep Work Focus</span>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 flex items-center gap-0.5">
                <Icon name="Activity" className="w-2.5 h-2.5" />
                <span>100% Streak</span>
              </span>
            </div>

            <div className="mt-1">
              <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums font-display">
                {viewMode === 'values'
                  ? `${maxStreak}d Streak`
                  : '121% of Goal'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                42.5 hrs dedicated prep • <span className="text-cyan-300 font-medium">Target: 35 hrs</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60">
            {/* Daily Focus Histogram / Bars */}
            <div className="h-8 w-full flex items-end justify-between gap-1 pt-1">
              {focusBars.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-cyan-500/30 hover:bg-cyan-400 transition-all cursor-pointer"
                  style={{ height: `${height}px` }}
                  title={`Day ${i + 1}: ${Math.round(height / 6)} hrs`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Last 7 Days</span>
              <span className="text-cyan-300 font-semibold">Unbroken</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Offer Probability & Readiness Gauge */}
        <div className="kpi-card p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Icon name="ShieldCheck" className="w-3.5 h-3.5 text-rose-400" />
                <span>Readiness Score</span>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/20 flex items-center gap-0.5">
                <Icon name="TrendingUp" className="w-2.5 h-2.5" />
                <span>+6.8%</span>
              </span>
            </div>

            <div className="mt-1">
              <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums font-display">
                {viewMode === 'values' ? `${avgReadiness}%` : `${Math.round((avgReadiness / 80) * 100)}%`}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Composite assessment • <span className="text-rose-300 font-medium">Target: 80%</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60">
            {/* Progress Gauge */}
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mt-2 mb-1.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${avgReadiness}%`,
                  background: 'linear-gradient(90deg, #F43F5E, #FB7185)',
                  boxShadow: '0 0 10px rgba(244, 63, 94, 0.4)',
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Confidence</span>
              <span className="text-rose-300 font-semibold">High Potential</span>
            </div>
          </div>
        </div>

      </div>

      {/* Design Stack Inspiration Modal */}
      {showInspoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowInspoModal(false)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Icon name="Sparkles" className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Design Ecosystem & Inspiration Stack
                  </h3>
                  <p className="text-xs text-slate-400">
                    The curated UI patterns, component libraries, typography, and analytics powering Offer Mode.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInspoModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Icon name="BarChart3" className="w-4 h-4 text-emerald-400" />
                  <span>SimpleKPI & Analytics</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Executive dashboard metrics, Target vs Actual progress bars, area sparklines, delta performance tags (+18.4%), and velocity metrics inspired directly by <a href="https://www.simplekpi.com/kpi-dashboard-examples" target="_blank" rel="noreferrer" className="text-emerald-400 underline">SimpleKPI</a>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Icon name="Layers" className="w-4 h-4 text-indigo-400" />
                  <span>Aceternity UI & Magic UI</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Subtle radial glow spotlights, 1px translucent card borders with hover elevation, Bento grid layout, cutting mat background grid, and micro-interactions from <a href="https://ui.aceternity.com/" target="_blank" rel="noreferrer" className="text-indigo-400 underline">Aceternity</a> & <a href="https://magicui.design/" target="_blank" rel="noreferrer" className="text-indigo-400 underline">Magic UI</a>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Icon name="Code" className="w-4 h-4 text-cyan-400" />
                  <span>Typography & Font Stack</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Engineered with <strong>Space Grotesk</strong>, <strong>Plus Jakarta Sans</strong>, <strong>Geist Mono</strong>, and <strong>JetBrains Mono</strong> for tabular numbers, high legibility, and technical precision.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Icon name="Shield" className="w-4 h-4 text-rose-400" />
                  <span>Dark Mode & Keyline Icons</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Aesthetic inspired by DarkModeDesign, Minimal Gallery, and Keyline Icons — offering high contrast OLED blacks, subtle border lines, and zero visual clutter for distraction-free focus.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowInspoModal(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
