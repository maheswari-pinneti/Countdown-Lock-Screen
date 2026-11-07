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

export const JobHuntModuleForm: React.FC<Props> = ({
  isOpen,
  onClose,
  experience,
  onSave,
  onReset,
}) => {
  const [targetJobTitle, setTargetJobTitle] = useState(experience.targetRole || '');
  const [preferredLocation, setPreferredLocation] = useState(
    experience.preferredLocation || 'San Francisco, CA / Remote'
  );
  const [targetSalary, setTargetSalary] = useState(
    experience.targetSalary || experience.compensation.targetTotalComp || 185000
  );
  const [targetCompanies, setTargetCompanies] = useState(
    experience.targetCompanies || experience.targetCompany || ''
  );
  const [startDate, setStartDate] = useState(
    experience.startDateIso ? experience.startDateIso.slice(0, 10) : ''
  );
  const [endDate, setEndDate] = useState(
    experience.targetOfferDate ? experience.targetOfferDate.slice(0, 10) : ''
  );
  const [motivationalMessage, setMotivationalMessage] = useState(
    experience.motivationalMessage || 'One application closer every day. Consistency compounds into offers.'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playKeyClick();

    if (!targetJobTitle.trim()) {
      setErrorMsg('Target job title is required.');
      return;
    }
    if (!startDate) {
      setErrorMsg('Sprint start date is required.');
      return;
    }
    if (!endDate) {
      setErrorMsg('Sprint end date is required.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setErrorMsg('Start date cannot be after end date.');
      return;
    }

    setErrorMsg(null);
    const fullTargetDate = `${endDate}T18:00:00`;
    const fullStartDate = `${startDate}T00:00:00`;

    const updated: CareerExperience = {
      ...experience,
      targetRole: targetJobTitle.trim(),
      targetCompany: targetCompanies.trim() || experience.targetCompany,
      preferredLocation: preferredLocation.trim(),
      targetSalary: Number(targetSalary) || 185000,
      targetCompanies: targetCompanies.trim(),
      startDateIso: fullStartDate,
      targetOfferDate: fullTargetDate,
      compensation: {
        ...experience.compensation,
        targetTotalComp: Number(targetSalary) || experience.compensation.targetTotalComp,
      },
      motivationalMessage: motivationalMessage.trim(),
    };

    onSave(updated);
    soundEngine.playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-cyan-500/30 bg-zinc-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Icon name="briefcase-business" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Configure 30-Day Job Hunt Sprint
              </h2>
              <p className="text-xs text-zinc-400">
                Module 2 — Application funnel, target compensation & outreach schedule
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
                Target Job Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="e.g. Full Stack / AI Product Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Preferred Location
              </label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA / Remote"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Salary (USD / Total Comp)
              </label>
              <input
                type="number"
                value={targetSalary}
                onChange={(e) => setTargetSalary(Number(e.target.value))}
                placeholder="185000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Companies
              </label>
              <input
                type="text"
                value={targetCompanies}
                onChange={(e) => setTargetCompanies(e.target.value)}
                placeholder="e.g. OpenAI, Vercel, Stripe, Linear, Figma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Sprint Start Date <span className="text-cyan-400">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Sprint End Date (30 Days) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
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
              placeholder="e.g. One application closer every day. Consistency compounds into offers."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              iconLeft="RotateCcw"
              onClick={() => {
                if (window.confirm('Reset Job Hunt Sprint module back to default presets?')) {
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
                  backgroundColor: '#06b6d4',
                  color: '#000',
                  fontWeight: 700,
                }}
              >
                Save 30-Day Sprint
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

