import React, { useState } from 'react';
import { CareerExperience } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  experience: CareerExperience;
  onSave: (updated: CareerExperience) => void;
  onReset: () => void;
}

const TECH_CHOICES = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Python',
  'SQL',
  'DSA',
  'System Design',
] as const;

export const DeveloperModuleForm: React.FC<Props> = ({
  isOpen,
  onClose,
  experience,
  onSave,
  onReset,
}) => {
  const [currentSkillLevel, setCurrentSkillLevel] = useState<
    'Beginner' | 'Intermediate' | 'Advanced'
  >(experience.currentSkillLevel || 'Intermediate');
  const [targetJobRole, setTargetJobRole] = useState(experience.targetRole || '');
  const [selectedTechnology, setSelectedTechnology] = useState<any>(
    experience.selectedTechnology || 'TypeScript'
  );
  const [dailyStudyDuration, setDailyStudyDuration] = useState(
    experience.dailyStudyDuration || '2.5 hours'
  );
  const [deadline, setDeadline] = useState(
    experience.targetOfferDate ? experience.targetOfferDate.slice(0, 10) : ''
  );
  const [motivationalMessage, setMotivationalMessage] = useState(
    experience.motivationalMessage || 'Code today. Grow tomorrow. Mastery is built through daily focused deep work.'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playKeyClick();

    if (!targetJobRole.trim()) {
      setErrorMsg('Target job role is required.');
      return;
    }
    if (!deadline) {
      setErrorMsg('Learning deadline is required.');
      return;
    }

    setErrorMsg(null);
    const fullTargetDate = `${deadline}T20:00:00`;

    const updated: CareerExperience = {
      ...experience,
      targetRole: targetJobRole.trim(),
      currentSkillLevel,
      selectedTechnology,
      dailyStudyDuration: dailyStudyDuration.trim(),
      targetOfferDate: fullTargetDate,
      motivationalMessage: motivationalMessage.trim(),
    };

    onSave(updated);
    soundEngine.playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-emerald-500/30 bg-zinc-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Icon name="code" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Configure Developer Skill Upgrade
              </h2>
              <p className="text-xs text-zinc-400">
                Module 3 — 60-day deep technical mastery syllabus & study schedule
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <Icon name="AlertTriangle" className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Job Role <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                placeholder="e.g. Senior Staff Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Current Skill Level
              </label>
              <select
                value={currentSkillLevel}
                onChange={(e) => setCurrentSkillLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Selected Core Technology
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TECH_CHOICES.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => {
                    soundEngine.playKeyClick();
                    setSelectedTechnology(tech);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedTechnology === tech
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Daily Study Duration
              </label>
              <input
                type="text"
                value={dailyStudyDuration}
                onChange={(e) => setDailyStudyDuration(e.target.value)}
                placeholder="e.g. 2.5 hours / 4 hours"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Deadline (60 Days) <span className="text-emerald-400">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Motivational Message
            </label>
            <input
              type="text"
              value={motivationalMessage}
              onChange={(e) => setMotivationalMessage(e.target.value)}
              placeholder="e.g. Code today. Grow tomorrow."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              iconLeft="RotateCcw"
              onClick={() => {
                if (window.confirm('Reset Developer Skill Upgrade module back to default presets?')) {
                  onReset();
                  onClose();
                }
              }}
              className="text-xs text-zinc-500 hover:text-red-400"
            >
              Reset to Defaults
            </Button>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  soundEngine.playKeyClick();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                iconLeft="Check"
                style={{
                  backgroundColor: '#22c55e',
                  color: '#000',
                  fontWeight: 700,
                }}
              >
                Save 60-Day Upgrade Plan
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

