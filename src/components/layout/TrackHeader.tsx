import React, { useState } from 'react';
import { CareerExperience } from '../../types';
import { useCountdownEngine } from '../../hooks/useCountdownEngine';
import { useAppStore } from '../../store/AppContext';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CountdownConfigModal } from '../common/CountdownConfigModal';

interface Props {
  experience: CareerExperience;
  allExperiences?: CareerExperience[];
  onUpdateExperience: (updated: CareerExperience) => void;
  onLaunchLockScreen: () => void;
}

export const TrackHeader: React.FC<Props> = ({
  experience,
  allExperiences,
  onUpdateExperience,
  onLaunchLockScreen,
}) => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const {
    isProjectProtectedWithPasskey,
    isProjectUnlockedInSession,
    toggleProjectPasskeyProtection,
  } = useAppStore();

  const isProtected = isProjectProtectedWithPasskey(experience.id);
  const isUnlocked = isProjectUnlockedInSession(experience.id);

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
        return 'danger';
      case 'today':
      case 'urgent':
        return 'warning';
      case 'invalid':
        return 'zinc';
      default:
        return 'cyan';
    }
  };

  return (
    <>
      <div
        className="p-6 md:p-8 rounded-3xl border relative overflow-hidden backdrop-blur-xl mb-8 transition-all"
        style={{
          backgroundColor: '#0a0d14',
          borderColor: `${experience.theme.primary}30`,
          boxShadow: `0 0 50px ${experience.theme.primary}10`,
        }}
      >
        {/* Glow backdrop */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
          style={{ backgroundColor: experience.theme.primary }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Details */}
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

              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                <Icon name="Flame" className="w-3.5 h-3.5 text-amber-400" />
                <span>{experience.streakDays}-day streak</span>
              </span>

              <Badge
                label={countdown.statusLabel}
                variant={getStatusBadgeVariant() as any}
                className="text-xs"
              />

              {/* Project Passkey Protection Pill */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playKeyClick();
                  toggleProjectPasskeyProtection(experience.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  isProtected
                    ? isUnlocked
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={
                  isProtected
                    ? isUnlocked
                      ? 'Passkey verified for this workstation (Click to toggle)'
                      : 'Passkey Protected (Click to toggle)'
                    : 'Click to add passkey protection to this project'
                }
              >
                <Icon
                  name={isProtected ? (isUnlocked ? 'ShieldCheck' : 'Fingerprint') : 'Key'}
                  className="w-3.5 h-3.5"
                />
                <span>{isProtected ? (isUnlocked ? 'Passkey Verified' : 'Passkey Protected') : '+ Add Passkey'}</span>
              </button>

              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
                Timezone: {countdown.timeZone.split('/').pop()}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {experience.targetRole}
                </h1>
                <button
                  onClick={() => {
                    soundEngine.playKeyClick();
                    setIsConfigModalOpen(true);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Configure Countdown Goal & Engine"
                >
                  <Icon name="Sliders" className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm md:text-base text-slate-300 font-medium mt-1.5 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-white font-semibold">
                  <Icon name="Briefcase" className="w-4 h-4 text-slate-400" />
                  {experience.targetCompany}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold">
                  ${(experience.compensation.targetTotalComp).toLocaleString()} / year Target Compensation
                </span>
              </p>

              {(experience.goalDescription || experience.motivationalMessage) && (
                <p className="text-xs md:text-sm text-slate-400 mt-2 italic max-w-xl">
                  "{experience.motivationalMessage || experience.goalDescription}"
                </p>
              )}
            </div>
          </div>

          {/* Right: Live Engine Countdown Ticker */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-inner backdrop-blur-md">
              <div className="text-xs text-slate-400 font-medium mb-2 flex items-center justify-between gap-4">
                <span>Target: {countdown.targetDateFormatted}</span>
                <span className="text-emerald-400 font-semibold">{countdown.compositeProgressPercentage}% progress</span>
              </div>
              <div className="flex items-center gap-2 text-center">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 min-w-[50px]">
                  <div className="text-xl md:text-2xl font-bold tracking-tight text-white tabular-nums">
                    {countdown.days}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Days</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 min-w-[50px]">
                  <div className="text-xl md:text-2xl font-bold tracking-tight text-white tabular-nums">
                    {countdown.formatted.hours}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Hours</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 min-w-[50px]">
                  <div className="text-xl md:text-2xl font-bold tracking-tight text-white tabular-nums">
                    {countdown.formatted.minutes}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Mins</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 min-w-[50px]">
                  <div className="text-xl md:text-2xl font-bold tracking-tight tabular-nums" style={{ color: experience.theme.primary }}>
                    {countdown.formatted.seconds}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Secs</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Button
                size="sm"
                variant="secondary"
                iconLeft="Sliders"
                onClick={() => {
                  soundEngine.playKeyClick();
                  setIsConfigModalOpen(true);
                }}
                className="flex-1 lg:flex-initial"
              >
                Configure
              </Button>

              <Button
                size="sm"
                iconLeft="Lock"
                onClick={onLaunchLockScreen}
                className="flex-1 lg:flex-initial font-semibold text-xs"
                style={{
                  backgroundColor: experience.theme.primary,
                  color: '#000',
                  boxShadow: `0 4px 14px ${experience.theme.primary}40`,
                }}
              >
                Launch Lock Screen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Countdown Config Modal */}
      <CountdownConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        experience={experience}
        allExperiences={allExperiences}
        onSave={onUpdateExperience}
      />
    </>
  );
};
