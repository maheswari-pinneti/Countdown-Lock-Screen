import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { useCountdown } from '../../hooks/useCountdown';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { CareerExperience } from '../../types';

const TrackCard: React.FC<{
  experience: CareerExperience;
  onLaunchLock: () => void;
}> = ({ experience, onLaunchLock }) => {
  const countdown = useCountdown(experience.targetOfferDate, experience.startDateIso);

  return (
    <Card
      accentColor={experience.theme.primary}
      hoverGlow
      className="group flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        {/* Header: Badge & Streak */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            label={experience.badge}
            icon={experience.icon}
            variant="zinc"
            style={{
              backgroundColor: `${experience.theme.primary}15`,
              borderColor: `${experience.theme.primary}35`,
              color: experience.theme.primary,
            }}
          />

          <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
            <Icon name="Flame" className="w-3.5 h-3.5 text-amber-500" />
            <span>{experience.streakDays}d streak</span>
          </div>
        </div>

        {/* Target Role & Company */}
        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
          {experience.targetRole}
        </h3>
        <p className="text-xs text-zinc-400 font-medium mt-1 mb-4 flex items-center gap-1.5">
          <Icon name="Briefcase" className="w-3.5 h-3.5 text-zinc-500" />
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
              {experience.milestones.filter((m) => m.completed).length} of {experience.milestones.length}
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
          <Icon name="Lock" className="w-4 h-4" />
        </button>

        <NavLink
          to={experience.route}
          onClick={() => soundEngine.playKeyClick()}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
          style={{
            backgroundColor: `${experience.theme.primary}20`,
            border: `1px solid ${experience.theme.primary}50`,
            color: experience.theme.primary,
          }}
        >
          <span>Open Workstation</span>
          <Icon name="ChevronRight" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </NavLink>
      </div>
    </Card>
  );
};

export const OverviewPage: React.FC = () => {
  const { experiences, openLockScreen, resetToDefaults, exportData, importData } = useAppStore();

  const totalTargetComp = experiences.reduce((acc, exp) => acc + exp.compensation.targetTotalComp, 0);
  const avgReadiness = Math.round(experiences.reduce((acc, exp) => acc + exp.readinessScore, 0) / experiences.length);
  const totalMilestones = experiences.reduce((acc, exp) => acc + exp.milestones.length, 0);
  const completedMilestones = experiences.reduce(
    (acc, exp) => acc + exp.milestones.filter((m) => m.completed).length,
    0
  );

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        alert('Data imported successfully!');
      } else {
        alert('Failed to import data: invalid format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Executive Hero Banner */}
      <section className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-b from-zinc-900/90 via-black to-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OFFER MODE PROTOCOL • 5 ACTIVE ARCHETYPES</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              One Dashboard.{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
                Five Elite Career Offers.
              </span>
            </h1>

            <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
              Turn any laptop or external monitor into a continuous, high-status countdown workstation. Millisecond timers, interactive interview simulators, compensation modeling, and instant distraction-free lock screens.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                iconLeft="Lock"
                onClick={() => openLockScreen('developer')}
              >
                Activate Universal Lock Screen
              </Button>

              <NavLink to="/developer" onClick={() => soundEngine.playKeyClick()}>
                <Button size="lg" variant="secondary" iconRight="ArrowRight">
                  Explore SWE Protocol
                </Button>
              </NavLink>
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
              <Icon name="Layers" className="w-5 h-5 text-emerald-400" />
              <span>Independent Career Tracks</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Switch between 5 purpose-built workstations. Each features independent countdowns, simulators, and themed lock screens.
            </p>
          </div>

          {/* Quick Data Management Controls */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" iconLeft="Download" onClick={exportData}>
              Export
            </Button>

            <label className="inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 select-none text-xs px-3 py-1.5 gap-1.5 bg-transparent hover:bg-white/5 text-zinc-200 border border-zinc-700 hover:border-zinc-500 cursor-pointer">
              <Icon name="Upload" className="w-4 h-4 shrink-0" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <Button
              size="sm"
              variant="outline"
              iconLeft="RefreshCw"
              onClick={() => {
                if (window.confirm('Reset all 5 tracks to default factory data?')) {
                  resetToDefaults();
                }
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* 5 Cards Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <TrackCard
              key={exp.id}
              experience={exp}
              onLaunchLock={() => openLockScreen(exp.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
