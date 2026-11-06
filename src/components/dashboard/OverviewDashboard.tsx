import React, { useState } from 'react';
import { CareerExperience, AppSettings } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';
import { soundEngine } from '../../services/soundEngine';
import { ExperienceIcon } from '../common/ExperienceIcon';
import {
  Lock,
  ArrowRight,
  Sparkles,
  Flame,
  Award,
  DollarSign,
  Briefcase,
  TrendingUp,
  Clock,
  Sliders,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';

interface Props {
  experiences: CareerExperience[];
  settings: AppSettings;
  onSelectExperience: (id: string) => void;
  onLaunchLockScreen: (experienceId?: string) => void;
  onResetDefaults: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Sub-component for individual card countdown to avoid recalculation re-renders
const TrackCard: React.FC<{
  experience: CareerExperience;
  onSelect: () => void;
  onLaunchLock: () => void;
}> = ({ experience, onSelect, onLaunchLock }) => {
  const countdown = useCountdown(experience.targetOfferDate);

  return (
    <div
      className="group relative p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl hover:shadow-2xl hover:-translate-y-1"
      style={{
        boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4)`,
      }}
    >
      {/* Top Accent line on hover */}
      <div
        className="absolute inset-x-6 top-0 h-1 rounded-t-full transition-all duration-300 opacity-60 group-hover:opacity-100"
        style={{ backgroundColor: experience.theme.primary }}
      />

      <div>
        {/* Header: Badge & Streak */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5"
            style={{
              backgroundColor: `${experience.theme.primary}15`,
              borderColor: `${experience.theme.primary}35`,
              color: experience.theme.primary,
            }}
          >
            <ExperienceIcon name={experience.icon} className="w-3.5 h-3.5" />
            <span>{experience.badge}</span>
          </span>

          <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{experience.streakDays}d streak</span>
          </div>
        </div>

        {/* Target Role & Company */}
        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
          {experience.targetRole}
        </h3>
        <p className="text-xs text-zinc-400 font-medium mt-1 mb-4 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
          <span>{experience.targetCompany}</span>
        </p>

        {/* Live Countdown Grid inside card */}
        <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800/80 mb-4 font-mono">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1 flex items-center justify-between">
            <span>OFFER COUNTDOWN</span>
            <span className="text-emerald-400">{countdown.progressPercentage.toFixed(0)}% READY</span>
          </div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1">
            <span>{countdown.formatted.days}d</span>
            <span className="text-zinc-500">:</span>
            <span>{countdown.formatted.hours}h</span>
            <span className="text-zinc-500">:</span>
            <span>{countdown.formatted.minutes}m</span>
            <span className="text-zinc-500">:</span>
            <span style={{ color: experience.theme.primary }}>{countdown.formatted.seconds}s</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-800 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${countdown.progressPercentage}%`,
                backgroundColor: experience.theme.primary,
              }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-5">
          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">Target Total Comp</span>
            <span className="font-mono font-bold text-emerald-400">
              ${(experience.compensation.targetTotalComp / 1000).toFixed(0)}k /yr
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">Milestones Done</span>
            <span className="font-mono font-bold text-white">
              {experience.milestones.filter(m => m.completed).length} of {experience.milestones.length}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
        <button
          onClick={() => {
            soundEngine.playKeyClick();
            onLaunchLock();
          }}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center justify-center"
          title="Launch this Track's Lock Screen"
        >
          <Lock className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundEngine.playKeyClick();
            onSelect();
          }}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
          style={{
            backgroundColor: `${experience.theme.primary}20`,
            border: `1px solid ${experience.theme.primary}50`,
            color: experience.theme.primary,
          }}
        >
          <span>Open Workstation</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export const OverviewDashboard: React.FC<Props> = ({
  experiences,
  settings,
  onSelectExperience,
  onLaunchLockScreen,
  onResetDefaults,
  onExportData,
  onImportData,
}) => {
  // Aggregate stats
  const totalTargetComp = experiences.reduce((acc, exp) => acc + exp.compensation.targetTotalComp, 0);
  const avgReadiness = Math.round(experiences.reduce((acc, exp) => acc + exp.readinessScore, 0) / experiences.length);
  const totalMilestones = experiences.reduce((acc, exp) => acc + exp.milestones.length, 0);
  const completedMilestones = experiences.reduce(
    (acc, exp) => acc + exp.milestones.filter(m => m.completed).length,
    0
  );

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Executive Hero Banner */}
      <section className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-b from-zinc-900/90 via-black to-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OFFER MODE PROTOCOL • 5 ACTIVE ARCHETYPES</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              One Dashboard. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
                Five Elite Career Offers.
              </span>
            </h1>

            <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
              Turn any laptop or external monitor into a continuous, high-status countdown workstation. Live milliseconds, interactive interview simulators, compensation modeling, and instant distraction-free lock screens.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundEngine.playSuccessChime();
                  onLaunchLockScreen('swe_faang');
                }}
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2.5 transition-all shadow-[0_0_30px_rgba(34,197,94,0.35)] active:scale-95"
              >
                <Lock className="w-4 h-4 fill-black" />
                <span>Activate Universal Lock Screen</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playKeyClick();
                  onSelectExperience('swe_faang');
                }}
                className="px-5 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <span>Explore SWE Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Aggregate High-Score Radar */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">TOTAL TARGET TC</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                ${(totalTargetComp / 1000000).toFixed(2)}M
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">AVG READINESS</span>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {avgReadiness}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">MILESTONES DONE</span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {completedMilestones} / {totalMilestones}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">EXPERIENCES</span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                5 Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Independent Career Experiences Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Independent Career Tracks</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Switch between 5 purpose-built workstations. Each features independent countdowns, simulators, and themed lock screens.
            </p>
          </div>

          {/* Quick Data Management Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExportData}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-all"
              title="Export state backup as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <label className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={onImportData} className="hidden" />
            </label>

            <button
              onClick={onResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-all"
              title="Reset all tracks to initial defaults"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 5 Cards Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <TrackCard
              key={exp.id}
              experience={exp}
              onSelect={() => onSelectExperience(exp.id)}
              onLaunchLock={() => onLaunchLockScreen(exp.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

