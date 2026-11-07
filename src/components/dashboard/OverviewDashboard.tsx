import React from 'react';
import { CareerExperience, AppSettings } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';
import { soundEngine } from '../../services/soundEngine';
import { ExperienceIcon } from '../common/ExperienceIcon';
import { useAppStore } from '../../store/AppContext';
import {
  Lock,
  ArrowRight,
  Flame,
  Briefcase,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Layers,
  ChevronRight,
  Target,
  Fingerprint,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { formatDisplayDate, formatCurrency } from '../../utils/date';

interface Props {
  experiences: CareerExperience[];
  settings: AppSettings;
  onSelectExperience: (id: string) => void;
  onLaunchLockScreen: (experienceId?: string) => void;
  onResetDefaults: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Sub-component for individual card countdown with passkey protection
const TrackCard: React.FC<{
  experience: CareerExperience;
  onSelect: () => void;
  onLaunchLock: () => void;
}> = ({ experience, onSelect, onLaunchLock }) => {
  const {
    isProjectProtectedWithPasskey,
    isProjectUnlockedInSession,
    toggleProjectPasskeyProtection,
    promptUnlockProject,
  } = useAppStore();

  const isProtected = isProjectProtectedWithPasskey(experience.id);
  const isUnlocked = isProjectUnlockedInSession(experience.id);

  const countdown = useCountdown(experience.targetOfferDate);
  const completedMilestones = experience.milestones.filter((m) => m.completed).length;
  const totalMilestones = experience.milestones.length;

  const handleOpenTrack = () => {
    soundEngine.playKeyClick();
    if (isProtected && !isUnlocked) {
      promptUnlockProject(experience.id, experience.targetRole, onSelect);
    } else {
      onSelect();
    }
  };

  return (
    <div
      className="group relative p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl hover:shadow-2xl hover:-translate-y-1"
      style={{
        boxShadow: `0 8px 30px -10px rgba(0, 0, 0, 0.4)`,
      }}
    >
      {/* Top Accent line on hover */}
      <div
        className="absolute inset-x-8 top-0 h-1 rounded-t-full transition-all duration-300 opacity-60 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${experience.theme.primary}, transparent)`,
        }}
      />

      <div>
        {/* Header: Badge, Passkey Toggle & Streak */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5"
            style={{
              backgroundColor: `${experience.theme.primary}15`,
              borderColor: `${experience.theme.primary}35`,
              color: experience.theme.primary,
            }}
          >
            <ExperienceIcon name={experience.icon} className="w-3.5 h-3.5" />
            <span>{experience.badge}</span>
          </span>

          <div className="flex items-center gap-2">
            {/* Project Passkey Protection Pill */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleProjectPasskeyProtection(experience.id);
              }}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium border flex items-center gap-1 transition-all ${
                isProtected
                  ? isUnlocked
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={
                isProtected
                  ? isUnlocked
                    ? 'Passkey verified for this session (Click to toggle)'
                    : 'Passkey Protected (Click to toggle)'
                  : 'Click to add passkey protection to this project'
              }
            >
              {isProtected ? (
                isUnlocked ? (
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Fingerprint className="w-3 h-3 text-indigo-400" />
                )
              ) : (
                <Key className="w-3 h-3 text-slate-400" />
              )}
              <span>{isProtected ? (isUnlocked ? 'Passkey Open' : 'Passkey') : '+ Passkey'}</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{experience.streakDays}-day streak</span>
            </div>
          </div>
        </div>

        {/* Target Role & Company */}
        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
          {experience.targetRole}
        </h3>
        <p className="text-xs text-slate-400 font-medium mt-1 mb-4 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
          <span>{experience.targetCompany}</span>
        </p>

        {/* Live Countdown Display */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-4 shadow-inner backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Time Remaining</span>
            </span>
            <span
              className="font-semibold text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${experience.theme.primary}20`,
                color: experience.theme.primary,
              }}
            >
              {countdown.progressPercentage.toFixed(0)}% ready
            </span>
          </div>

          {/* 4 Countdown Blocks */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                {countdown.days}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Days</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                {countdown.formatted.hours}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Hours</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                {countdown.formatted.minutes}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Mins</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div
                className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums"
                style={{ color: experience.theme.primary }}
              >
                {countdown.formatted.seconds}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Secs</div>
            </div>
          </div>

          {/* Target Date & Progress bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Target: {formatDisplayDate(experience.targetOfferDate)}</span>
              <span className="font-medium text-slate-300">
                {completedMilestones} of {totalMilestones} done
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${countdown.progressPercentage}%`,
                  background: `linear-gradient(90deg, ${experience.theme.primary}cc, ${experience.theme.primary})`,
                  boxShadow: `0 0 10px ${experience.theme.primary}40`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-5">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-normal">Target Compensation</span>
            <span className="font-bold text-emerald-400 text-xs">
              {formatCurrency(experience.compensation.targetTotalComp)} / yr
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-normal">Milestones Finished</span>
            <span className="font-bold text-white text-xs">
              {completedMilestones} of {totalMilestones} done
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={() => {
            soundEngine.playKeyClick();
            onLaunchLock();
          }}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all flex items-center justify-center"
          title="Open Focus Lock Screen"
        >
          <Lock className="w-4 h-4" />
        </button>

        <button
          onClick={handleOpenTrack}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
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
      <section className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-white/10 overflow-hidden shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Career Journey Dashboard • 5 Active Goals</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
              Your Career Goals, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                One Day Closer to Your Dream Offer.
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Turn any laptop or external monitor into a continuous, calm countdown workstation. Real-time days remaining, curated milestones, compensation modeling, and instant distraction-free lock screens.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundEngine.playSuccessChime();
                  onLaunchLockScreen('swe_faang');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-xs tracking-normal flex items-center gap-2.5 transition-all shadow-lg shadow-purple-500/25 active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Start Focus Lock Screen</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playKeyClick();
                  onSelectExperience('swe_faang');
                }}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <span>Explore Track</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium block">Target Package</span>
              <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">
                {formatCurrency(totalTargetComp, true)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium block">Average Readiness</span>
              <div className="text-2xl font-bold text-indigo-300 mt-1 tabular-nums">
                {avgReadiness}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium block">Milestones Done</span>
              <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">
                {completedMilestones} of {totalMilestones}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium block">Active Goals</span>
              <div className="text-2xl font-bold text-white mt-1 tabular-nums">
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
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-display">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Independent Career Tracks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Switch between 5 purpose-built workstations. Each features independent countdowns, milestones, and themed lock screens.
            </p>
          </div>

          {/* Data Management Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExportData}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all font-medium"
              title="Export state backup as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <label className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all font-medium">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={onImportData} className="hidden" />
            </label>

            <button
              onClick={onResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all font-medium"
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
