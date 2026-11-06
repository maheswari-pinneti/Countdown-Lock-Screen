import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { useCountdown } from '../../hooks/useCountdown';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/feedback/EmptyState';
import { soundEngine } from '../../services/soundEngine';
import { formatDate, getDaysDifference } from '../../utils/date';
import { ExperienceTrackId } from '../../types';

interface ExperienceCardData {
  id: ExperienceTrackId;
  name: string;
  tagline: string;
  icon: string;
  route: string;
  durationLabel: string;
  description: string;
  color: string;
  badge: string;
}

const CARDS_DATA: ExperienceCardData[] = [
  {
    id: 'interview',
    name: 'Interview Countdown',
    tagline: 'Your Big Day Starts Here.',
    icon: 'calendar-check',
    route: '/interview',
    durationLabel: '24-Day Target Window',
    description:
      'High-stakes interview preparation with live mental math sprints, options Greeks drills, and technical panel rehearsals.',
    color: '#ff9900',
    badge: 'Quant & HFT Superday',
  },
  {
    id: 'job-hunt',
    name: '30-Day Job Hunt Sprint',
    tagline: 'One Application Closer Every Day.',
    icon: 'briefcase-business',
    route: '/job-hunt',
    durationLabel: '30-Day Sprint Window',
    description:
      'High-velocity pipeline management, post-money SAFE cap table modeler, cash runway tracking, and feature release burn-up.',
    color: '#00E5FF',
    badge: 'Founder / 0-to-1 Sprint',
  },
  {
    id: 'developer',
    name: 'Developer Skill Upgrade',
    tagline: 'Code Today. Grow Tomorrow.',
    icon: 'code',
    route: '/developer',
    durationLabel: '39-Day Mastery Window',
    description:
      'Staff engineer leveling roadmap, distributed systems deep-dives, algorithm velocity tracking, and 4-year total compensation modeling.',
    color: '#22c55e',
    badge: 'Staff / L6 Protocol',
  },
  {
    id: 'first-job',
    name: 'First Job Countdown',
    tagline: 'Your First Offer Is Worth the Preparation.',
    icon: 'graduation-cap',
    route: '/first-job',
    durationLabel: '46-Day Target Window',
    description:
      'Transition from campus/junior to high-impact offensive security operator with live CVE exploit logs and negotiation leverage formulas.',
    color: '#ef4444',
    badge: 'Tactical Defense Launch',
  },
  {
    id: 'career-switch',
    name: 'Career Switch Countdown',
    tagline: 'Your Next Chapter Starts Now.',
    icon: 'arrow-left-right',
    route: '/career-switch',
    durationLabel: '55-Day Freedom Window',
    description:
      'Shift into high-leverage remote fractional consulting with 24-hour client daylight overlap analysis and geo-arbitrage cost calculators.',
    color: '#10b981',
    badge: 'Nomad Autonomy Leap',
  },
];

// Experience Card component with live countdown
const ExperienceCard: React.FC<{
  data: ExperienceCardData;
  targetDate: string;
  startDateIso: string;
  onPreviewLock: () => void;
}> = ({ data, targetDate, startDateIso, onPreviewLock }) => {
  const countdown = useCountdown(targetDate, startDateIso);
  const navigate = useNavigate();

  return (
    <Card
      accentColor={data.color}
      hoverGlow
      className="bg-[#0F172A]/80 border-[#1E293B] flex flex-col justify-between group hover:border-[#334155] transition-all duration-300"
    >
      <div>
        {/* Top Header: Badge & Duration */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            label={data.badge}
            variant="zinc"
            className="border text-[11px]"
            style={{
              backgroundColor: `${data.color}15`,
              borderColor: `${data.color}35`,
              color: data.color,
            }}
          />

          <span className="text-[11px] font-mono text-zinc-400 font-semibold flex items-center gap-1.5">
            <Icon name="Clock" className="w-3.5 h-3.5 text-zinc-500" />
            <span>{data.durationLabel}</span>
          </span>
        </div>

        {/* Card Title & Headline */}
        <div className="flex items-start gap-3.5 mb-2">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm group-hover:scale-105 transition-transform"
            style={{
              backgroundColor: `${data.color}15`,
              borderColor: `${data.color}35`,
              color: data.color,
            }}
          >
            <Icon name={data.icon} className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
              {data.name}
            </h3>
            <p className="text-xs font-semibold text-cyan-400 mt-0.5">
              {data.tagline}
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed my-3">
          {data.description}
        </p>

        {/* Live Mini Countdown Widget */}
        <div className="p-3.5 rounded-2xl bg-[#070B14]/80 border border-[#1E293B] my-4 font-mono">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
            <span>OFFER LOCK-IN</span>
            <span style={{ color: data.color }}>
              {countdown.progressPercentage.toFixed(0)}% ELAPSED
            </span>
          </div>

          <div className="text-xl font-black text-white flex items-baseline gap-1">
            <span>{countdown.formatted.days}d</span>
            <span className="text-zinc-600">:</span>
            <span>{countdown.formatted.hours}h</span>
            <span className="text-zinc-600">:</span>
            <span>{countdown.formatted.minutes}m</span>
            <span className="text-zinc-600">:</span>
            <span style={{ color: data.color }}>{countdown.formatted.seconds}s</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-zinc-800 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${countdown.progressPercentage}%`,
                backgroundColor: data.color,
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons: Start Planning & Preview */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#1E293B]">
        <Button
          size="sm"
          variant="secondary"
          iconLeft="Eye"
          onClick={() => {
            soundEngine.playKeyClick();
            onPreviewLock();
          }}
          className="flex-1 text-xs"
        >
          Preview
        </Button>

        <Button
          size="sm"
          iconRight="ArrowRight"
          onClick={() => {
            soundEngine.playKeyClick();
            navigate(data.route);
          }}
          className="flex-1 text-xs"
          style={{
            backgroundColor: data.color,
            color: '#000',
            boxShadow: `0 0 15px ${data.color}30`,
          }}
        >
          Start Planning
        </Button>
      </div>
    </Card>
  );
};

export const OverviewPage: React.FC = () => {
  const { experiences, openLockScreen } = useAppStore();
  const navigate = useNavigate();

  // 1. Dashboard summary metrics from real user data
  const activeCountdownsCount = experiences.length;
  const totalMilestones = experiences.reduce((acc, exp) => acc + exp.milestones.length, 0);
  const completedMilestones = experiences.reduce(
    (acc, exp) => acc + exp.milestones.filter((m) => m.completed).length,
    0
  );
  const overallProgressPct =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // 2. Calculate upcoming deadline
  const allMilestones = experiences.flatMap((exp) =>
    exp.milestones.map((m) => ({
      ...m,
      trackName: exp.name,
      trackColor: exp.theme.primary,
    }))
  );

  const upcomingMilestones = allMilestones
    .filter((m) => !m.completed && new Date(m.deadline).getTime() >= Date.now())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const nextUpcoming = upcomingMilestones[0] || null;
  const daysUntilNext = nextUpcoming ? getDaysDifference(nextUpcoming.deadline) : null;

  // 3. Real recent activity items (completed milestones or daily goals)
  const recentCompletedActivities = allMilestones
    .filter((m) => m.completed)
    .slice(0, 5);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* SaaS Hero Section */}
      <section className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#070B14] border border-[#1E293B] overflow-hidden shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>OFFER MODE • CAREER ACCELERATION WORKSTATION</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              OFFER MODE
            </h1>

            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              Your Goals. Your Deadline. Your Future.
            </h2>

            <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium">
              Every deadline deserves a plan. Every goal deserves progress.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="md"
                iconLeft="Lock"
                onClick={() => {
                  soundEngine.playSuccessChime();
                  openLockScreen('developer');
                }}
                className="bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_25px_rgba(0,229,255,0.35)]"
              >
                Launch Universal Lock Screen
              </Button>

              <Button
                size="md"
                variant="secondary"
                iconRight="Palette"
                onClick={() => {
                  soundEngine.playKeyClick();
                  navigate('/countdown-studio');
                }}
              >
                Customize in Studio
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
            <div className="p-4 rounded-2xl bg-[#070B14]/80 border border-[#1E293B] text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">ACTIVE COUNTDOWNS</span>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {activeCountdownsCount} Tracks
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070B14]/80 border border-[#1E293B] text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">TOTAL PROGRESS</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {overallProgressPct}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070B14]/80 border border-[#1E293B] text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">COMPLETED</span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {completedMilestones} Done
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070B14]/80 border border-[#1E293B] text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">TOTAL MILESTONES</span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {totalMilestones} Targets
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Summary Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Card 1: Milestone Velocity */}
        <Card className="bg-[#0F172A]/70 border-[#1E293B]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">Milestone Velocity</span>
            <Icon name="Activity" className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-white font-mono">{completedMilestones}</span>
            <span className="text-xs text-zinc-400">of {totalMilestones} completed</span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden mb-3">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-zinc-400 font-mono">
            <span>Progress: {overallProgressPct}%</span>
            <span>{totalMilestones - completedMilestones} Remaining</span>
          </div>
        </Card>

        {/* Summary Card 2: Next Upcoming Deadline */}
        <Card className="bg-[#0F172A]/70 border-[#1E293B]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">Upcoming Deadline</span>
            <Icon name="Calendar" className="w-4 h-4 text-amber-400" />
          </div>

          {nextUpcoming ? (
            <div>
              <div className="text-xl font-bold text-white tracking-tight line-clamp-1 mb-1">
                {nextUpcoming.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                <span className="text-amber-400 font-semibold">{nextUpcoming.trackName}</span>
                <span>•</span>
                <span className="font-mono text-zinc-300">{formatDate(nextUpcoming.deadline)}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                <Icon name="Clock" className="w-3.5 h-3.5" />
                <span>{daysUntilNext !== null ? `${daysUntilNext} Days Remaining` : 'Due soon'}</span>
              </div>
            </div>
          ) : (
            <div className="py-2 text-xs text-zinc-400">
              <span>All scheduled milestones up to date! Create new goals in any workstation.</span>
            </div>
          )}
        </Card>

        {/* Summary Card 3: System Status & Primary Lock Screen */}
        <Card className="bg-[#0F172A]/70 border-[#1E293B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">Active Workstation</span>
              <Icon name="Sparkles" className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="text-xl font-bold text-white mb-1">
              5 Elite Career Tracks
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              All 5 career tracks are initialized, persisted locally, and ready for full-screen lock countdowns.
            </p>
          </div>

          <Button
            size="sm"
            iconLeft="Lock"
            onClick={() => {
              soundEngine.playSuccessChime();
              openLockScreen('developer');
            }}
          >
            Launch Offer Mode
          </Button>
        </Card>
      </section>

      {/* The Five Individual Experience Cards Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Icon name="Layers" className="w-6 h-6 text-cyan-400" />
            <span>Five Dedicated Career Experiences</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Choose your focus track. Each workstation includes specialized countdown timers, domain calculators, practice drills, and full-screen lock modes.
          </p>
        </div>

        {/* 5 Cards Grid: 1 to 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS_DATA.map((card) => {
            const exp = experiences.find((e) => e.id === card.id) || experiences[0];
            return (
              <ExperienceCard
                key={card.id}
                data={card}
                targetDate={exp.targetOfferDate}
                startDateIso={exp.startDateIso}
                onPreviewLock={() => openLockScreen(card.id)}
              />
            );
          })}
        </div>
      </section>

      {/* Recent Countdown Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Icon name="Clock" className="w-5 h-5 text-cyan-400" />
            <span>Active Countdowns & Fast Jump</span>
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Live Sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {experiences.map((exp) => (
            <button
              key={exp.id}
              onClick={() => {
                soundEngine.playKeyClick();
                navigate(exp.route);
              }}
              className="p-3.5 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] hover:border-[#334155] text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-cyan-300">
                    {exp.badge}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: exp.theme.primary }}
                  />
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">
                  {exp.targetRole}
                </div>
              </div>

              <div className="mt-3 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>{new Date(exp.targetOfferDate).toLocaleDateString()}</span>
                <span className="font-bold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                  ➔
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Activity Section (Uses Real User Data with Empty State Fallback) */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-emerald-400" />
          <span>Recent Activity & Completed Milestones</span>
        </h3>

        {recentCompletedActivities.length > 0 ? (
          <Card className="bg-[#0F172A]/70 border-[#1E293B] divide-y divide-zinc-800/80">
            {recentCompletedActivities.map((act) => (
              <div
                key={act.id}
                className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Icon name="CheckCircle2" className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Track: {act.trackName} • Completed
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </div>
            ))}
          </Card>
        ) : (
          <EmptyState
            icon="CheckCircle2"
            title="No Recent Activity Yet"
            description="As you check off milestones and daily goals in your career tracks, your real-time activity and velocity will appear here."
            actionLabel="View All Milestones"
            onAction={() => navigate('/milestones')}
          />
        )}
      </section>
    </div>
  );
};
