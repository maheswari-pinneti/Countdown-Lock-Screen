import React, { useState } from 'react';
import { CareerExperience } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { toIsoDatetimeLocal, formatDate } from '../../utils/date';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
  onLaunchLockScreen: () => void;
}

export const TrackHeader: React.FC<Props> = ({
  experience,
  onUpdateExperience,
  onLaunchLockScreen,
}) => {
  const countdown = useCountdown(experience.targetOfferDate, experience.startDateIso);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState(experience.targetRole);
  const [company, setCompany] = useState(experience.targetCompany);
  const [date, setDate] = useState(experience.targetOfferDate.slice(0, 16));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccessChime();
    onUpdateExperience({
      ...experience,
      targetRole: role,
      targetCompany: company,
      targetOfferDate: date,
    });
    setIsEditing(false);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-3xl border relative overflow-hidden backdrop-blur-xl mb-8"
      style={{
        backgroundColor: '#0a0d14',
        borderColor: `${experience.theme.primary}30`,
        boxShadow: `0 0 50px ${experience.theme.primary}10`,
      }}
    >
      <div
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
        style={{ backgroundColor: experience.theme.primary }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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

            <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold font-mono">
              Readiness: {experience.readinessScore}%
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3 pt-2">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-bold"
                placeholder="Target Role"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-bold"
                placeholder="Target Company"
              />
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-bold font-mono"
              />
              <div className="flex gap-2">
                <Button size="sm" type="submit" iconLeft="Save">
                  Save
                </Button>
                <Button size="sm" variant="secondary" type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span>{experience.targetRole}</span>
                <button
                  onClick={() => {
                    soundEngine.playKeyClick();
                    setIsEditing(true);
                  }}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Edit Target Details"
                >
                  <Icon name="Edit3" className="w-4 h-4" />
                </button>
              </h1>

              <p className="text-sm md:text-base text-zinc-300 font-medium mt-1 flex items-center gap-2">
                <Icon name="Briefcase" className="w-4 h-4 text-zinc-500" />
                <span>{experience.targetCompany}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  ${(experience.compensation.targetTotalComp / 1000).toFixed(0)}k Target Total Comp
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Countdown Pill & Lock Button */}
        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800/80 font-mono">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
              TARGET LOCK-IN: {formatDate(experience.targetOfferDate)}
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {countdown.formatted.days}d {countdown.formatted.hours}h {countdown.formatted.minutes}m{' '}
              <span style={{ color: experience.theme.primary }}>{countdown.formatted.seconds}s</span>
            </div>
          </div>

          <Button
            size="md"
            iconLeft="Lock"
            onClick={onLaunchLockScreen}
            style={{
              backgroundColor: experience.theme.primary,
              color: '#000',
              boxShadow: `0 0 25px ${experience.theme.primary}50`,
            }}
          >
            Launch Lock Screen
          </Button>
        </div>
      </div>
    </div>
  );
};
