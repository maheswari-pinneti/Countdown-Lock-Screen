import React, { useState, useEffect, useMemo } from 'react';
import { CareerExperience, ExperienceTrackId } from '../../types';
import { POPULAR_TIMEZONES, calculateCountdownEngine } from '../../utils/countdownEngine';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from './Icon';
import { Button } from './Button';
import { Badge } from './Badge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  experience: CareerExperience;
  allExperiences?: CareerExperience[];
  onSave: (updated: CareerExperience) => void;
  onSelectTrack?: (trackId: ExperienceTrackId) => void;
}

export const CountdownConfigModal: React.FC<Props> = ({
  isOpen,
  onClose,
  experience,
  allExperiences = [],
  onSave,
  onSelectTrack,
}) => {
  // Form State
  const [selectedTrack, setSelectedTrack] = useState<ExperienceTrackId>(experience.id);
  const [goalName, setGoalName] = useState(experience.name);
  const [goalDescription, setGoalDescription] = useState(experience.goalDescription || experience.tagline);
  const [targetCompany, setTargetCompany] = useState(experience.targetCompany);
  const [targetJobRole, setTargetJobRole] = useState(experience.targetRole);
  const [startDate, setStartDate] = useState(
    experience.startDateIso ? experience.startDateIso.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [deadlineDate, setDeadlineDate] = useState(
    experience.targetOfferDate ? experience.targetOfferDate.slice(0, 10) : ''
  );
  const [deadlineTime, setDeadlineTime] = useState(
    experience.deadlineTime || (experience.targetOfferDate.length >= 16 ? experience.targetOfferDate.slice(11, 16) : '18:00')
  );
  const [timeZone, setTimeZone] = useState(experience.timeZone || 'Local');
  const [motivationalMessage, setMotivationalMessage] = useState(
    experience.motivationalMessage || experience.quotes[0] || 'Every deadline deserves a plan. Lock in.'
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state when active experience changes
  useEffect(() => {
    setSelectedTrack(experience.id);
    setGoalName(experience.name);
    setGoalDescription(experience.goalDescription || experience.tagline);
    setTargetCompany(experience.targetCompany);
    setTargetJobRole(experience.targetRole);
    setStartDate(experience.startDateIso ? experience.startDateIso.slice(0, 10) : '');
    setDeadlineDate(experience.targetOfferDate ? experience.targetOfferDate.slice(0, 10) : '');
    setDeadlineTime(
      experience.deadlineTime || (experience.targetOfferDate.length >= 16 ? experience.targetOfferDate.slice(11, 16) : '18:00')
    );
    setTimeZone(experience.timeZone || 'Local');
    setMotivationalMessage(
      experience.motivationalMessage || experience.quotes[0] || 'Every deadline deserves a plan. Lock in.'
    );
    setValidationError(null);
  }, [experience]);

  // Handle switching to a different track inside the modal
  const handleTrackChange = (newTrackId: ExperienceTrackId) => {
    soundEngine.playKeyClick();
    setSelectedTrack(newTrackId);
    if (onSelectTrack) {
      onSelectTrack(newTrackId);
    }
  };

  // Live countdown calculation preview based on current form inputs
  const livePreview = useMemo(() => {
    const completedCount = experience.milestones.filter((m) => m.completed).length;
    const totalCount = experience.milestones.length;

    return calculateCountdownEngine(
      deadlineDate,
      startDate,
      timeZone,
      deadlineTime,
      completedCount,
      totalCount
    );
  }, [deadlineDate, startDate, timeZone, deadlineTime, experience.milestones]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playKeyClick();

    // Validation
    if (!goalName.trim()) {
      setValidationError('Goal name is required.');
      return;
    }
    if (!targetCompany.trim()) {
      setValidationError('Target company is required.');
      return;
    }
    if (!targetJobRole.trim()) {
      setValidationError('Target job role is required.');
      return;
    }
    if (!deadlineDate) {
      setValidationError('Deadline date is required.');
      return;
    }
    if (startDate && deadlineDate && new Date(startDate) > new Date(deadlineDate)) {
      setValidationError('Start date cannot be after deadline date.');
      return;
    }

    setValidationError(null);

    // Assemble updated ISO timestamp for targetOfferDate
    const fullTargetDate = `${deadlineDate}T${deadlineTime || '18:00'}:00`;
    const fullStartDate = startDate ? `${startDate}T00:00:00` : experience.startDateIso;

    const updatedExperience: CareerExperience = {
      ...experience,
      name: goalName.trim(),
      tagline: goalDescription.trim(),
      goalDescription: goalDescription.trim(),
      targetCompany: targetCompany.trim(),
      targetRole: targetJobRole.trim(),
      startDateIso: fullStartDate,
      targetOfferDate: fullTargetDate,
      deadlineTime: deadlineTime || '18:00',
      timeZone,
      motivationalMessage: motivationalMessage.trim(),
    };

    onSave(updatedExperience);
    soundEngine.playSuccessChime();
    onClose();
  };

  // Helper for status badge variant
  const getStatusBadgeVariant = () => {
    switch (livePreview.deadlineStatus) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl rounded-3xl border border-zinc-700/80 bg-zinc-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          boxShadow: `0 0 50px ${experience.theme.primary}20`,
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `${experience.theme.primary}20`,
                borderColor: `${experience.theme.primary}50`,
                color: experience.theme.primary,
              }}
            >
              <Icon name="Sliders" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Configure Career Countdown</h2>
              <p className="text-xs text-zinc-400">
                Precision engine with IANA timezone calculations & milestone alignment
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              onClose();
            }}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Validation Banner */}
          {validationError && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-center gap-3 animate-in shake">
              <Icon name="AlertTriangle" className="w-5 h-5 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Track Selector */}
          {allExperiences.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Selected Career Experience Module
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {allExperiences.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => handleTrackChange(exp.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedTrack === exp.id
                        ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-lg'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <Icon name={exp.icon} className="w-4 h-4 mb-1.5" style={{ color: exp.theme.primary }} />
                    <span className="text-xs font-bold truncate block">{exp.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-zinc-500 truncate">{exp.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Live Calculation Preview Bar */}
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-800/80">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-sans font-semibold">
                <Icon name="Clock" className="w-3.5 h-3.5 text-cyan-400" />
                Live Engine Calculation Preview
              </span>
              <Badge
                label={livePreview.statusLabel}
                variant={getStatusBadgeVariant() as any}
                className="text-[10px]"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 text-center py-2">
              <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
                <div className="text-xl md:text-2xl font-black text-white">{livePreview.formatted.days}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500">Days</div>
              </div>
              <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
                <div className="text-xl md:text-2xl font-black text-white">{livePreview.formatted.hours}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500">Hours</div>
              </div>
              <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
                <div className="text-xl md:text-2xl font-black text-white">{livePreview.formatted.minutes}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500">Minutes</div>
              </div>
              <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
                <div className="text-xl md:text-2xl font-black text-cyan-400">{livePreview.formatted.seconds}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500">Seconds</div>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-zinc-400 flex flex-wrap items-center justify-between gap-1 font-sans">
              <span>Target: <strong className="text-zinc-200">{livePreview.targetDateFormatted}</strong></span>
              <span>Composite Progress: <strong className="text-emerald-400">{livePreview.compositeProgressPercentage}%</strong></span>
            </div>
          </div>

          {/* 3. Goal Name & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Goal / Experience Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Senior Staff Engineering Loop"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Goal Description / Subtitle
              </label>
              <input
                type="text"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                placeholder="e.g. 5 rounds of high-concurrency systems design"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 4. Target Company & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Company / Organization <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google Architecture / Citadel / Mandiant"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Job Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                placeholder="e.g. Senior Staff Distributed Systems Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* 5. Date & Time Engine Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Start Date (Baseline)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Deadline Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Deadline Time (24h)
              </label>
              <input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 6. Time Zone Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Execution Timezone (IANA Standard)</span>
              <span className="text-zinc-500 text-[11px] font-normal">Handles DST & Global Offsets</span>
            </label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              {POPULAR_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Motivational Quote */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Motivational Message (Featured on Dashboard & Lock Screen)
            </label>
            <textarea
              rows={2}
              value={motivationalMessage}
              onChange={(e) => setMotivationalMessage(e.target.value)}
              placeholder="e.g. Every deadline deserves a plan. Every goal deserves progress."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                soundEngine.playKeyClick();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" iconLeft="Check">
              Apply Configuration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
