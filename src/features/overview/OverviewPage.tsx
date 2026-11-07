import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { useCountdownEngine } from '../../hooks/useCountdownEngine';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/feedback/EmptyState';
import { DashboardSkeleton } from '../../components/common/SkeletonLoader';
import { Typewriter } from '../../components/common/Typewriter';
import { CareerPersonasModal } from '../../components/common/CareerPersonasModal';
import { soundEngine } from '../../services/soundEngine';
import {
  formatDate,
  formatDisplayDate,
  formatRelativeDate,
  formatCurrency,
  getDaysDifference
} from '../../utils/date';
import { ExperienceTrackId, CareerExperience } from '../../types';
import { SimpleKpiCards } from '../../components/dashboard/SimpleKpiCards';

interface ExperienceCardConfig {
  id: ExperienceTrackId;
  name: string;
  tagline: string;
  icon: string;
  route: string;
  defaultDuration: string;
  description: string;
  accentColor: string;
  badge: string;
  gradient: string;
}

const FIVE_EXPERIENCE_CARDS: ExperienceCardConfig[] = [
  {
    id: 'interview',
    name: 'Interview Countdown',
    tagline: 'Your big day starts here.',
    icon: 'Target',
    route: '/interview',
    defaultDuration: '21 Days Remaining',
    description:
      'Master technical rounds, STAR behavioral stories, system architecture trade-offs, and high-impact questions for interviewers.',
    accentColor: '#F59E0B',
    badge: 'Interview Preparation',
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
  },
  {
    id: 'job-hunt',
    name: '30-Day Job Hunt Sprint',
    tagline: 'One application closer every day.',
    icon: 'Briefcase',
    route: '/job-hunt',
    defaultDuration: '24 Days Remaining',
    description:
      'Daily 3-application target, warm LinkedIn outreach, alumni referral follow-ups, and interview conversion pipeline.',
    accentColor: '#06B6D4',
    badge: 'Job Hunt Sprint',
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
  },
  {
    id: 'developer',
    name: 'Developer Skill Upgrade',
    tagline: 'Code today, grow tomorrow.',
    icon: 'Code',
    route: '/developer',
    defaultDuration: '32 Days Remaining',
    description:
      'Structured daily deep-work syllabus covering modern TypeScript, distributed systems design, concurrency patterns, and architecture.',
    accentColor: '#10B981',
    badge: 'Skill Mastery',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
  },
  {
    id: 'first-job',
    name: 'First Job Countdown',
    tagline: 'Your first offer is worth preparing for.',
    icon: 'GraduationCap',
    route: '/first-job',
    defaultDuration: '39 Days Remaining',
    description:
      'Campus placement drive preparation, tax and onboarding documents checklist, and first 90-day success roadmap.',
    accentColor: '#F43F5E',
    badge: 'Campus to Career',
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
  },
  {
    id: 'career-switch',
    name: 'Career Switch Countdown',
    tagline: 'Your next chapter starts right now.',
    icon: 'ArrowLeftRight',
    route: '/career-switch',
    defaultDuration: '48 Days Remaining',
    description:
      'Turn your prior professional experience into an advantage in tech, build a deployed capstone project, and network with peers who made the jump.',
    accentColor: '#8B5CF6',
    badge: 'Career Transition',
    gradient: 'from-purple-500/10 via-indigo-500/5 to-transparent',
  },
];

// Experience Card component with live countdown and passkey protection
const ExperienceCard: React.FC<{
  config: ExperienceCardConfig;
  experience: CareerExperience;
  onPreviewLock: () => void;
}> = ({ config, experience, onPreviewLock }) => {
  const {
    isProjectProtectedWithPasskey,
    isProjectUnlockedInSession,
    toggleProjectPasskeyProtection,
    promptUnlockProject,
  } = useAppStore();

  const isProtected = isProjectProtectedWithPasskey(config.id);
  const isUnlocked = isProjectUnlockedInSession(config.id);

  const completedCount = experience.milestones.filter((m) => m.completed).length;
  const totalCount = experience.milestones.length;

  const countdown = useCountdownEngine({
    targetDate: experience.targetOfferDate,
    startDate: experience.startDateIso,
    deadlineTime: experience.deadlineTime || '18:00',
    timeZone: experience.timeZone || 'Local',
    completedMilestones: completedCount,
    totalMilestones: totalCount,
  });
  const navigate = useNavigate();

  const handleOpenProject = () => {
    soundEngine.playKeyClick();
    if (isProtected && !isUnlocked) {
      promptUnlockProject(config.id, config.name, () => navigate(config.route));
    } else {
      navigate(config.route);
    }
  };

  return (
    <Card
      accentColor={config.accentColor}
      hoverGlow
      className={`bg-gradient-to-b ${config.gradient} bg-slate-900/70 border-slate-800/80 flex flex-col justify-between group hover:border-slate-700 transition-all duration-300 shadow-lg`}
    >
      <div>
        {/* Top Header: Badge, Passkey Toggle & Streak */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <Badge
            label={config.badge}
            variant="zinc"
            className="border text-xs font-semibold"
            style={{
              backgroundColor: `${config.accentColor}15`,
              borderColor: `${config.accentColor}35`,
              color: config.accentColor,
            }}
          />

          <div className="flex items-center gap-2">
            {/* Project Passkey Protection Pill */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleProjectPasskeyProtection(config.id);
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
              <Icon
                name={isProtected ? (isUnlocked ? 'ShieldCheck' : 'Fingerprint') : 'Key'}
                className="w-3 h-3"
              />
              <span>{isProtected ? (isUnlocked ? 'Passkey Open' : 'Passkey') : '+ Passkey'}</span>
            </button>

            <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <Icon name="Flame" className="w-3 h-3 text-amber-400" />
              <span>{experience.streakDays}d</span>
            </span>
          </div>
        </div>

        {/* Target Role & Tagline */}
        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
          {experience.targetRole}
        </h3>
        <p className="text-xs text-slate-400 font-medium mt-1 mb-4 flex items-center gap-1.5">
          <Icon name="Briefcase" className="w-3.5 h-3.5 text-slate-500" />
          <span>{experience.targetCompany}</span>
        </p>

        {/* Live Countdown Display */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-4 shadow-inner backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span className="flex items-center gap-1.5">
              <Icon name="Clock" className="w-3.5 h-3.5 text-slate-400" />
              <span>Time Remaining</span>
            </span>
            <span
              className="font-semibold text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${config.accentColor}20`,
                color: config.accentColor,
              }}
            >
              {countdown.compositeProgressPercentage.toFixed(0)}% ready
            </span>
          </div>

          {/* 4 Unit Countdown Blocks */}
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
                style={{ color: config.accentColor }}
              >
                {countdown.formatted.seconds}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Secs</div>
            </div>
          </div>

          {/* Target Date & Progress Bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Target: {formatDisplayDate(experience.targetOfferDate)}</span>
              <span className="font-medium text-slate-300">
                {completedCount} of {totalCount} completed
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${countdown.compositeProgressPercentage}%`,
                  background: `linear-gradient(90deg, ${config.accentColor}cc, ${config.accentColor})`,
                  boxShadow: `0 0 10px ${config.accentColor}40`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Metrics: Compensation & Status */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-normal">Target Compensation</span>
            <span className="font-bold text-emerald-400 text-xs">
              {formatCurrency(experience.compensation.targetTotalComp)} / yr
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-normal">Milestones Finished</span>
            <span className="font-bold text-white text-xs">
              {completedCount} of {totalCount} done
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Focus Mode & Open Track (Passkey Protected) */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
        <Button
          size="sm"
          variant="secondary"
          iconLeft="Lock"
          onClick={() => {
            soundEngine.playKeyClick();
            onPreviewLock();
          }}
          className="text-xs"
          title="Open Focus Lock Screen"
        >
          Focus
        </Button>

        <Button
          size="sm"
          iconLeft={isProtected && !isUnlocked ? 'Fingerprint' : undefined}
          iconRight={isProtected && !isUnlocked ? undefined : 'ArrowRight'}
          onClick={handleOpenProject}
          className="flex-1 text-xs font-semibold"
          style={{
            backgroundColor: config.accentColor,
            color: '#000',
            boxShadow: `0 4px 14px ${config.accentColor}30`,
          }}
        >
          {isProtected && !isUnlocked ? 'Unlock with Passkey' : 'Open Workstation'}
        </Button>
      </div>
    </Card>
  );
};

export const OverviewPage: React.FC = () => {
  const {
    experiences,
    updateExperience,
    openLockScreen,
    currentUser,
    isProjectProtectedWithPasskey,
    isProjectUnlockedInSession,
    toggleProjectPasskeyProtection,
    promptUnlockProject,
  } = useAppStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'guided' | 'all'>('guided');
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Aggregate metrics
  const activeCountdownsCount = experiences.length;
  const totalMilestones = experiences.reduce((acc, exp) => acc + exp.milestones.length, 0);
  const completedMilestones = experiences.reduce(
    (acc, exp) => acc + exp.milestones.filter((m) => m.completed).length,
    0
  );
  const overallProgressPct =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  const totalTargetComp = experiences.reduce((acc, exp) => acc + exp.compensation.targetTotalComp, 0);

  // Flat list of milestones for roadmap step
  const allMilestones = experiences.flatMap((exp) =>
    exp.milestones.map((m) => ({
      ...m,
      expId: exp.id,
      trackName: exp.name,
      trackBadge: exp.badge,
      trackColor: exp.theme.primary,
    }))
  );

  const upcomingMilestones = allMilestones
    .filter((m) => !m.completed)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const nextUpcoming = upcomingMilestones[0] || null;
  const daysUntilNext = nextUpcoming ? getDaysDifference(nextUpcoming.deadline) : null;

  // Toggle milestone completion directly from dashboard
  const handleToggleMilestone = (expId: string, milestoneId: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const updatedMilestones = exp.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    updateExperience({ ...exp, milestones: updatedMilestones });
    soundEngine.playSuccessChime();
  };

  const stepsList = [
    {
      num: 1,
      id: 'step-1',
      title: 'Active Career Tracks',
      desc: '5 goal tracks & live countdown clocks',
      icon: 'Layers',
      badge: 'Step 1 of 4',
    },
    {
      num: 2,
      id: 'step-2',
      title: 'Milestone Roadmap',
      desc: 'Daily task checklist & preparedness',
      icon: 'CheckCircle2',
      badge: 'Step 2 of 4',
    },
    {
      num: 3,
      id: 'step-3',
      title: 'Passkey Protection',
      desc: 'Hardware security for every project',
      icon: 'Fingerprint',
      badge: 'Step 3 of 4',
    },
    {
      num: 4,
      id: 'step-4',
      title: 'Focus Lock Screen',
      desc: 'Distraction-free ambient workstation',
      icon: 'Lock',
      badge: 'Step 4 of 4',
    },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome & Executive Hero Banner */}
      <section className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Step-by-Step Career Workstation • {currentUser?.name ? `Signed in as ${currentUser.name}` : 'Authenticated'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
              Your Career Roadmap, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                One Day Closer to Your Target Offer.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Execute your transition systematically. Follow the 4-step sequence below to explore career tracks, tick off daily milestones, secure your projects with passkeys, and activate ambient focus lock screens.
            </p>

            {/* What you're working toward typewriter */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-indigo-500/30 text-xs text-slate-300 flex flex-wrap items-center gap-2 backdrop-blur-md">
              <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                <Icon name="Sparkles" className="w-3.5 h-3.5 text-amber-400" />
                <span>Working toward:</span>
              </span>
              <Typewriter
                phrases={[
                  'Targeting L5 Senior Software Engineer offer in 21 days...',
                  'Executing daily 3-application sprint with alumni referrals...',
                  'Mastering distributed systems & concurrency deep-work syllabus...',
                  'Completing college placement drive docs & onboarding prep...',
                  'Pivot from Support to Cloud Architect with deployed capstone...',
                ]}
                className="text-xs text-indigo-200 font-medium"
              />
            </div>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center backdrop-blur-md">
              <span className="text-[11px] text-slate-400 font-medium block">Active Goals</span>
              <div className="text-xl font-bold text-indigo-300 mt-0.5 tabular-nums">
                {activeCountdownsCount} in progress
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center backdrop-blur-md">
              <span className="text-[11px] text-slate-400 font-medium block">Overall Readiness</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5 tabular-nums">
                {overallProgressPct}%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center backdrop-blur-md">
              <span className="text-[11px] text-slate-400 font-medium block">Milestones Done</span>
              <div className="text-xl font-bold text-amber-400 mt-0.5 tabular-nums">
                {completedMilestones}/{totalMilestones}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center backdrop-blur-md">
              <span className="text-[11px] text-slate-400 font-medium block">Target Package</span>
              <div className="text-lg font-bold text-white mt-0.5 tabular-nums">
                {formatCurrency(totalTargetComp, true)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SimpleKPI Executive KPI Cards */}
      <SimpleKpiCards experiences={experiences} />

      {/* Interactive Step-by-Step Navigation Stepper */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Icon name="Target" className="w-5 h-5 text-indigo-400" />
              <span>Step-by-Step Dashboard Workflow</span>
            </h2>
            <p className="text-xs text-slate-400">
              Complete each stage sequentially or navigate directly using the step switcher below.
            </p>
          </div>

          {/* View Mode Toggle: Guided vs All Steps */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto text-xs">
            <button
              onClick={() => {
                soundEngine.playKeyClick();
                setViewMode('guided');
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'guided'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Step Focus
            </button>
            <button
              onClick={() => {
                soundEngine.playKeyClick();
                setViewMode('all');
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'all'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              View All Steps
            </button>
          </div>
        </div>

        {/* 4 Interactive Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stepsList.map((step) => {
            const isCurrent = activeStep === step.num;
            return (
              <button
                key={step.id}
                onClick={() => {
                  soundEngine.playKeyClick();
                  setActiveStep(step.num);
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between group ${
                  isCurrent
                    ? 'bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-400/30'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Step active top accent bar */}
                {isCurrent && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                        isCurrent
                          ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      {step.badge}
                    </span>
                    <Icon
                      name={step.icon}
                      className={`w-4 h-4 ${isCurrent ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                    />
                  </div>

                  <h3 className={`text-sm font-bold tracking-tight ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className={isCurrent ? 'text-indigo-300 font-semibold' : 'text-slate-500'}>
                    {isCurrent ? '● Active Step' : 'Click to View'}
                  </span>
                  <Icon
                    name="ArrowRight"
                    className={`w-3.5 h-3.5 transition-transform ${isCurrent ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STEP 1: CHOOSE CAREER TRACK & LIVE COUNTDOWNS                             */}
      {/* ========================================================================= */}
      {(viewMode === 'all' || activeStep === 1) && (
        <section id="step-1" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                01
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold mb-1">
                  <span>STEP 1 OF 4</span>
                  <span>•</span>
                  <span>SELECT ACTIVE CAREER TRACK</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Choose Your Target Goal & Countdown Workstation
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select between 5 dedicated tracks. Each features live countdown tickers, target compensation modeling, and passkey security.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="gradient"
              iconRight="ArrowRight"
              onClick={() => {
                soundEngine.playKeyClick();
                setActiveStep(2);
              }}
              className="shrink-0 text-xs font-semibold"
            >
              Next: Step 2 Milestones
            </Button>
          </div>

          {/* 5 Experience Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FIVE_EXPERIENCE_CARDS.map((cardConfig) => {
              const exp = experiences.find((e) => e.id === cardConfig.id) || experiences[0];
              return (
                <ExperienceCard
                  key={cardConfig.id}
                  config={cardConfig}
                  experience={exp}
                  onPreviewLock={() => openLockScreen(cardConfig.id)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: MILESTONE ROADMAP & DAILY PREPAREDNESS                            */}
      {/* ========================================================================= */}
      {(viewMode === 'all' || activeStep === 2) && (
        <section id="step-2" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                02
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold mb-1">
                  <span>STEP 2 OF 4</span>
                  <span>•</span>
                  <span>MILESTONE ROADMAP & CHECKLIST</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Track Deliverables & Build Daily Momentum
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any milestone checkbox to tick off completed targets. Your preparedness score updates in real-time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="secondary"
                iconLeft="ArrowLeft"
                onClick={() => {
                  soundEngine.playKeyClick();
                  setActiveStep(1);
                }}
                className="text-xs"
              >
                Back to Step 1
              </Button>
              <Button
                size="sm"
                variant="gradient"
                iconRight="ArrowRight"
                onClick={() => {
                  soundEngine.playKeyClick();
                  setActiveStep(3);
                }}
                className="text-xs font-semibold"
              >
                Next: Step 3 Passkeys
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Checklist (2 cols) */}
            <Card className="lg:col-span-2 bg-slate-900/70 border-slate-800/80">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Icon name="CheckCircle2" className="w-4 h-4 text-emerald-400" />
                    <span>Interactive Milestone Action Checklist</span>
                  </h3>
                  <span className="text-xs text-slate-400">Click checkboxes to mark deliverables as finished</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {completedMilestones} of {totalMilestones} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {allMilestones.slice(0, 7).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.expId, m.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      m.completed
                        ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                          m.completed
                            ? 'bg-emerald-500 border-emerald-400 text-black'
                            : 'border-slate-600 bg-slate-900 hover:border-indigo-400'
                        }`}
                      >
                        {m.completed && <Icon name="Check" className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <span
                          className={`text-xs font-semibold block truncate ${
                            m.completed ? 'line-through text-slate-400' : 'text-slate-200'
                          }`}
                        >
                          {m.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span style={{ color: m.trackColor }}>{m.trackBadge}</span>
                          <span>•</span>
                          <span>Due {formatDisplayDate(m.deadline)}</span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      label={m.completed ? 'Done' : 'Pending'}
                      variant={m.completed ? 'emerald' : 'zinc'}
                      size="sm"
                      className="shrink-0 text-[11px]"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  iconRight="ArrowRight"
                  onClick={() => navigate('/milestones')}
                  className="text-xs"
                >
                  View All Master Milestones
                </Button>
              </div>
            </Card>

            {/* Upcoming Deadline Card (1 col) */}
            <div className="space-y-4">
              <Card className="bg-slate-900/70 border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">
                    Next Critical Milestone
                  </span>
                  <Icon name="Calendar" className="w-4 h-4 text-amber-400" />
                </div>

                {nextUpcoming ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {nextUpcoming.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Track: <span style={{ color: nextUpcoming.trackColor }} className="font-semibold">{nextUpcoming.trackBadge}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-2xl font-bold text-amber-400 block tabular-nums">
                        {daysUntilNext !== null ? `${daysUntilNext} Days` : 'Due soon'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Target Date: {formatDisplayDate(nextUpcoming.deadline)}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-400 rounded-full transition-all duration-300"
                        style={{ width: `${overallProgressPct}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">All immediate milestones completed!</p>
                )}
              </Card>

              {/* Preparedness summary */}
              <Card className="bg-slate-900/70 border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Overall Preparedness Score
                </span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-emerald-400 tabular-nums">
                    {overallProgressPct}%
                  </span>
                  <span className="text-xs text-slate-400">Readiness index</span>
                </div>
                <p className="text-xs text-slate-400 font-normal leading-relaxed">
                  Based on validated milestone completions, mock reviews, and scheduled submission dates.
                </p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: PASSKEY PROTECTION FOR EVERY PROJECT                              */}
      {/* ========================================================================= */}
      {(viewMode === 'all' || activeStep === 3) && (
        <section id="step-3" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                03
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold mb-1">
                  <span>STEP 3 OF 4</span>
                  <span>•</span>
                  <span>BIOMETRIC PASSKEY SECURITY CENTER</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Protect Your Career Workstations with Hardware Passkeys
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Secure any project with biometric Touch ID, Face ID, Windows Hello, or physical security key before opening.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="secondary"
                iconLeft="ArrowLeft"
                onClick={() => {
                  soundEngine.playKeyClick();
                  setActiveStep(2);
                }}
                className="text-xs"
              >
                Back to Step 2
              </Button>
              <Button
                size="sm"
                variant="gradient"
                iconRight="ArrowRight"
                onClick={() => {
                  soundEngine.playKeyClick();
                  setActiveStep(4);
                }}
                className="text-xs font-semibold"
              >
                Next: Step 4 Lock Screen
              </Button>
            </div>
          </div>

          {/* 5 Project Passkey Controls Table/Card */}
          <Card className="bg-slate-900/70 border-slate-800/80">
            <div className="space-y-3">
              {experiences.map((exp) => {
                const isProtected = isProjectProtectedWithPasskey(exp.id);
                const isUnlocked = isProjectUnlockedInSession(exp.id);

                return (
                  <div
                    key={exp.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold"
                        style={{
                          backgroundColor: `${exp.theme.primary}20`,
                          border: `1px solid ${exp.theme.primary}40`,
                          color: exp.theme.primary,
                        }}
                      >
                        <Icon name="Briefcase" className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {exp.name}
                          </h4>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${exp.theme.primary}15`,
                              color: exp.theme.primary,
                            }}
                          >
                            {exp.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Target: {exp.targetRole} • {formatDisplayDate(exp.targetOfferDate)}
                        </p>
                      </div>
                    </div>

                    {/* Passkey Status & Toggle Action */}
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-semibold block text-slate-300">
                          {isProtected
                            ? isUnlocked
                              ? 'Passkey Session Verified'
                              : 'Passkey Protected'
                            : 'Standard Access'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {isProtected ? 'Biometric verification active' : 'Click toggle to secure'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playKeyClick();
                          toggleProjectPasskeyProtection(exp.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                          isProtected
                            ? isUnlocked
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon
                          name={isProtected ? (isUnlocked ? 'ShieldCheck' : 'Fingerprint') : 'Key'}
                          className="w-4 h-4"
                        />
                        <span>{isProtected ? (isUnlocked ? 'Passkey Open' : 'Protected') : '+ Add Passkey'}</span>
                      </button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          soundEngine.playKeyClick();
                          if (isProtected && !isUnlocked) {
                            promptUnlockProject(exp.id, exp.name, () => navigate(exp.route));
                          } else {
                            navigate(exp.route);
                          }
                        }}
                        className="text-xs"
                      >
                        Enter Workstation
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: DISTRACTION-FREE FOCUS LOCK SCREEN                                */}
      {/* ========================================================================= */}
      {(viewMode === 'all' || activeStep === 4) && (
        <section id="step-4" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                04
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-semibold mb-1">
                  <span>STEP 4 OF 4</span>
                  <span>•</span>
                  <span>ACTIVATE AMBIENT FOCUS WORKSTATION</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Launch Ambient Distraction-Free Lock Screen
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transform any monitor or laptop into a calm, focused countdown clock. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">L</kbd> anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="secondary"
                iconLeft="ArrowLeft"
                onClick={() => {
                  soundEngine.playKeyClick();
                  setActiveStep(3);
                }}
                className="text-xs"
              >
                Back to Step 3
              </Button>
              <Button
                size="sm"
                variant="gradient"
                iconLeft="Lock"
                onClick={() => {
                  soundEngine.playSuccessChime();
                  openLockScreen('developer');
                }}
                className="text-xs font-semibold shadow-lg shadow-purple-500/20"
              >
                Launch Focus Mode (L)
              </Button>
            </div>
          </div>

          {/* Interactive Lock Screen Preview Hero */}
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-radial-at-c from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-xl mx-auto space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Icon name="Sparkles" className="w-3.5 h-3.5 text-amber-400" />
                <span>Distraction-Free Ambient Display</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                Calm, Continuous Countdown Station
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Features live millisecond precision, ambient gradient lighting, motivational affirmations, and keyboard quick-controls.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  size="md"
                  variant="gradient"
                  iconLeft="Lock"
                  onClick={() => {
                    soundEngine.playSuccessChime();
                    openLockScreen('interview');
                  }}
                  className="shadow-xl shadow-purple-500/30 text-xs font-bold px-6 py-3"
                >
                  Start Focus Screen Now
                </Button>

                <Button
                  size="md"
                  variant="secondary"
                  iconLeft="Palette"
                  onClick={() => {
                    soundEngine.playKeyClick();
                    navigate('/countdown-studio');
                  }}
                  className="text-xs"
                >
                  Customize in Studio
                </Button>
              </div>

              {/* Keyboard Shortcuts Hint */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                <span>Shortcuts:</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <kbd className="font-bold">L</kbd> Focus Mode
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <kbd className="font-bold">1-5</kbd> Switch Track
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <kbd className="font-bold">0</kbd> Dashboard
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Career Personas Modal */}
      <CareerPersonasModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
      />
    </div>
  );
};
