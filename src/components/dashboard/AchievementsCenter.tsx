import React, { useState } from 'react';
import { CareerExperience } from '../../types';
import { Icon } from '../common/Icon';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  experiences: CareerExperience[];
  className?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Milestones' | 'Streak' | 'Security' | 'Outreach';
  isUnlocked: boolean;
  unlockedDate?: string;
  progressText: string;
}

export const AchievementsCenter: React.FC<Props> = ({ experiences, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Compute live criteria
  const totalCompletedMilestones = experiences.reduce(
    (acc, exp) => acc + exp.milestones.filter((m) => m.completed).length,
    0
  );
  const maxStreak = Math.max(...experiences.map((exp) => exp.streakDays || 0), 0);
  const hasPasskey = experiences.some((exp) => exp.passkeyProtected);
  const totalApplications = experiences.reduce(
    (acc, exp) => acc + (exp.applications?.length || 0),
    0
  );
  const totalStarStories = experiences.reduce(
    (acc, exp) => acc + (exp.starStories?.length || 0),
    0
  );
  const hasCompletedTrack = experiences.some((exp) => {
    const total = exp.milestones.length;
    const done = exp.milestones.filter((m) => m.completed).length;
    return total > 0 && done === total;
  });

  const achievements: Achievement[] = [
    {
      id: 'ach-1',
      title: 'First Milestone Down',
      description: 'Mark your very first career milestone complete.',
      icon: 'Target',
      category: 'Milestones',
      isUnlocked: totalCompletedMilestones >= 1,
      progressText: `${Math.min(totalCompletedMilestones, 1)} / 1 Done`,
    },
    {
      id: 'ach-2',
      title: 'Sprint Momentum Master',
      description: 'Maintain an unbroken daily focus streak of 7+ days.',
      icon: 'Flame',
      category: 'Streak',
      isUnlocked: maxStreak >= 7,
      progressText: `${maxStreak} / 7 Days`,
    },
    {
      id: 'ach-3',
      title: 'Halfway Velocity',
      description: 'Complete 25+ milestones across your career workstations.',
      icon: 'Zap',
      category: 'Milestones',
      isUnlocked: totalCompletedMilestones >= 25,
      progressText: `${totalCompletedMilestones} / 25 Milestones`,
    },
    {
      id: 'ach-4',
      title: 'Offer Ready Champion',
      description: 'Achieve 100% milestone completion on any career track.',
      icon: 'Award',
      category: 'Milestones',
      isUnlocked: hasCompletedTrack,
      progressText: hasCompletedTrack ? 'Goal Achieved!' : 'In Progress',
    },
    {
      id: 'ach-5',
      title: 'Biometric Shield',
      description: 'Protect a project using hardware WebAuthn Passkeys.',
      icon: 'ShieldCheck',
      category: 'Security',
      isUnlocked: hasPasskey,
      progressText: hasPasskey ? 'Hardware Protected' : 'Not Activated',
    },
    {
      id: 'ach-6',
      title: 'Pipeline Pioneer',
      description: 'Log 3+ active target applications in the Job Hunt CRM.',
      icon: 'Briefcase',
      category: 'Outreach',
      isUnlocked: totalApplications >= 3,
      progressText: `${totalApplications} / 3 Applications`,
    },
    {
      id: 'ach-7',
      title: 'STAR Storyteller',
      description: 'Craft and save a behavioral STAR interview story.',
      icon: 'Sparkles',
      category: 'Outreach',
      isUnlocked: totalStarStories >= 1,
      progressText: `${totalStarStories} / 1 Stories Saved`,
    },
    {
      id: 'ach-8',
      title: 'Master Scheduler',
      description: 'Export workstation deadlines to Apple, Google, or Outlook calendar.',
      icon: 'Calendar',
      category: 'Milestones',
      isUnlocked: true, // Always ready to sync
      progressText: 'iCalendar Ready',
    },
  ];

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const pct = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Overview Banner Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Icon name="Trophy" className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-display">
                Career Achievement Vault
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {unlockedCount} of {achievements.length} Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Earn badges as you hit milestones, maintain deep work streaks, and expand your interview pipeline.
            </p>
          </div>
        </div>

        {/* Action Button & Mini Progress */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:block text-right">
            <div className="text-xs font-mono font-bold text-amber-300">{pct}% Mastery</div>
            <div className="w-24 h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playKeyClick();
              setIsOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <Icon name="Award" className="w-3.5 h-3.5" />
            <span>View All Badges</span>
          </button>
        </div>
      </div>

      {/* Modal / Drawer for full badge breakdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Icon name="Trophy" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Executive Badges & Career Milestones
                  </h3>
                  <p className="text-xs text-slate-400">
                    Track your career discipline across all 5 workstations.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    ach.isUnlocked
                      ? 'bg-slate-950/70 border-amber-500/30 shadow-md'
                      : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      ach.isUnlocked
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    <Icon name={ach.icon} className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-white truncate">{ach.title}</h4>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          ach.isUnlocked
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {ach.isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                      <span>{ach.category}</span>
                      <span className={ach.isUnlocked ? 'text-amber-300 font-semibold' : ''}>
                        {ach.progressText}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
