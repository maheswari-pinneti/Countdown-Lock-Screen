import React from 'react';
import { CareerExperience } from '../../types';
import { useCountdownEngine } from '../../hooks/useCountdownEngine';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { generateIcsForCareerTrack, downloadIcsFile } from '../../utils/calendarSync';

interface Props {
  experience: CareerExperience;
  onOpenEditForm: () => void;
  onResetModule: () => void;
  onLaunchLockScreen: () => void;
  statsSnippet?: React.ReactNode;
}

export const ModuleHeroHeader: React.FC<Props> = ({
  experience,
  onOpenEditForm,
  onResetModule,
  onLaunchLockScreen,
  statsSnippet,
}) => {
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

  const getStatusBadgeVariant = () => {
    switch (countdown.deadlineStatus) {
      case 'expired':
        return 'red';
      case 'today':
      case 'urgent':
        return 'amber';
      case 'invalid':
        return 'zinc';
      default:
        return 'cyan';
    }
  };

  return (
    <div
      className="p-6 md:p-8 rounded-3xl border relative overflow-hidden backdrop-blur-xl mb-8 transition-all"
      style={{
        backgroundColor: '#0a0d14',
        borderColor: `${experience.theme.primary}35`,
        boxShadow: `0 0 50px ${experience.theme.primary}12`,
      }}
    >
      <div
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
        style={{ backgroundColor: experience.theme.primary }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Module Details */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge
              label={experience.badge}
              icon={experience.icon}
              variant="zinc"
              className="border text-xs"
              style={{
                backgroundColor: `${experience.theme.primary}15`,
                borderColor: `${experience.theme.primary}40`,
                color: experience.theme.primary,
              }}
            />

            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1 font-mono">
              <Icon name="Flame" className="w-3.5 h-3.5 text-amber-500" />
              <span>{experience.streakDays}d Streak</span>
            </span>

            <Badge
              label={countdown.statusLabel}
              variant={getStatusBadgeVariant() as any}
              className="text-xs"
            />

            <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
              TZ: {countdown.timeZone.split('/').pop()}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {experience.name}
              </h1>
              <button
                onClick={() => {
                  soundEngine.playKeyClick();
                  onOpenEditForm();
                }}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Edit Module Form & Details"
              >
                <Icon name="Edit3" className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm md:text-base text-zinc-300 font-medium mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-cyan-400 font-bold">{experience.targetRole}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300 font-semibold">{experience.targetCompany}</span>
              {experience.compensation?.targetTotalComp > 0 && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    ${(experience.compensation.targetTotalComp / 1000).toFixed(0)}k Target
                  </span>
                </>
              )}
            </p>

            {experience.motivationalMessage && (
              <p className="text-xs md:text-sm text-zinc-400 mt-2 italic max-w-xl">
                "{experience.motivationalMessage}"
              </p>
            )}

            {statsSnippet && <div className="mt-3">{statsSnippet}</div>}
          </div>
        </div>

        {/* Right: Live Precision Countdown Ticker & Action Buttons */}
        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800/80 font-mono shadow-inner w-full sm:w-auto">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1 flex items-center justify-between gap-4">
              <span>TARGET DEADLINE: {countdown.targetDateFormatted}</span>
              <span className="text-emerald-400 font-mono">
                {countdown.compositeProgressPercentage}% Progress
              </span>
            </div>

            <div className="text-2xl md:text-3xl font-black text-white flex items-baseline gap-1.5">
              <span>{countdown.formatted.days}d</span>
              <span>{countdown.formatted.hours}h</span>
              <span>{countdown.formatted.minutes}m</span>
              <span style={{ color: experience.theme.primary }}>
                {countdown.formatted.seconds}s
              </span>
            </div>

            {/* Progress Bar inside ticker */}
            <div className="w-full h-1.5 rounded-full bg-zinc-800 mt-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${countdown.compositeProgressPercentage}%`,
                  backgroundColor: experience.theme.primary,
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Button
              size="sm"
              variant="secondary"
              iconLeft="Calendar"
              onClick={() => {
                soundEngine.playSuccessChime();
                const ics = generateIcsForCareerTrack(experience);
                downloadIcsFile(`${experience.id}-deadlines.ics`, ics);
              }}
              className="flex-1 sm:flex-initial text-xs"
              title="Download iCalendar (.ics) for Apple Calendar, Google Calendar, and Outlook"
            >
              Sync Calendar
            </Button>

            <Button
              size="sm"
              variant="secondary"
              iconLeft="Edit3"
              onClick={() => {
                soundEngine.playKeyClick();
                onOpenEditForm();
              }}
              className="flex-1 sm:flex-initial"
            >
              Edit Form
            </Button>

            <Button
              size="sm"
              variant="ghost"
              iconLeft="RotateCcw"
              onClick={() => {
                if (
                  window.confirm(
                    `Reset "${experience.name}" to preset milestones and default parameters?`
                  )
                ) {
                  onResetModule();
                }
              }}
              className="text-xs text-zinc-500 hover:text-red-400 flex-1 sm:flex-initial"
            >
              Reset
            </Button>

            <Button
              size="sm"
              iconLeft="Lock"
              onClick={onLaunchLockScreen}
              className="flex-1 sm:flex-initial font-bold"
              style={{
                backgroundColor: experience.theme.primary,
                color: '#000',
                boxShadow: `0 0 25px ${experience.theme.primary}50`,
              }}
            >
              Lock Screen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

