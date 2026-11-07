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

export const CareerSwitchModuleForm: React.FC<Props> = ({
  isOpen,
  onClose,
  experience,
  onSave,
  onReset,
}) => {
  const [currentJobRole, setCurrentJobRole] = useState(
    experience.currentJobRole || 'Legacy Infrastructure & Operations Lead'
  );
  const [targetJobRole, setTargetJobRole] = useState(experience.targetRole || '');
  const [currentTechnology, setCurrentTechnology] = useState(
    experience.currentTechnology || 'On-Premises Infrastructure & Windows Server'
  );
  const [targetTechnology, setTargetTechnology] = useState(
    experience.targetTechnology || 'Distributed Cloud, Kubernetes & Terraform'
  );
  const [preferredLocation, setPreferredLocation] = useState(
    experience.preferredLocation || 'New York, NY / Remote'
  );
  const [expectedSalary, setExpectedSalary] = useState(
    experience.expectedSalary || experience.compensation.targetTotalComp || 195000
  );
  const [transitionDeadline, setTransitionDeadline] = useState(
    experience.targetOfferDate ? experience.targetOfferDate.slice(0, 10) : ''
  );
  const [motivationalMessage, setMotivationalMessage] = useState(
    experience.motivationalMessage || 'Your next chapter starts now. Transferable skills + focused tech skills = unstoppable pivot.'
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
    if (!transitionDeadline) {
      setErrorMsg('Career transition deadline is required.');
      return;
    }

    setErrorMsg(null);
    const fullTargetDate = `${transitionDeadline}T18:00:00`;

    const updated: CareerExperience = {
      ...experience,
      currentJobRole: currentJobRole.trim(),
      targetRole: targetJobRole.trim(),
      currentTechnology: currentTechnology.trim(),
      targetTechnology: targetTechnology.trim(),
      preferredLocation: preferredLocation.trim(),
      expectedSalary: Number(expectedSalary) || 195000,
      targetOfferDate: fullTargetDate,
      compensation: {
        ...experience.compensation,
        targetTotalComp: Number(expectedSalary) || experience.compensation.targetTotalComp,
      },
      motivationalMessage: motivationalMessage.trim(),
    };

    onSave(updated);
    soundEngine.playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-teal-500/30 bg-zinc-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-400 flex items-center justify-center">
              <Icon name="arrow-left-right" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Configure Career Switch Countdown
              </h2>
              <p className="text-xs text-zinc-400">
                Module 5 — 90-day disciplined transition to modern cloud & high-growth domains
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
                Current Job Role
              </label>
              <input
                type="text"
                value={currentJobRole}
                onChange={(e) => setCurrentJobRole(e.target.value)}
                placeholder="e.g. Legacy Infrastructure & Operations Lead"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Job Role <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                placeholder="e.g. Principal Cloud & Solutions Architect"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Current Technology
              </label>
              <input
                type="text"
                value={currentTechnology}
                onChange={(e) => setCurrentTechnology(e.target.value)}
                placeholder="e.g. On-Premises Windows Server & VMware"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Technology
              </label>
              <input
                type="text"
                value={targetTechnology}
                onChange={(e) => setTargetTechnology(e.target.value)}
                placeholder="e.g. Distributed Cloud, Kubernetes & Terraform"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Preferred Location
              </label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. New York, NY / Remote"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Expected Salary (USD)
              </label>
              <input
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(Number(e.target.value))}
                placeholder="195000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Transition Deadline (90 Days) <span className="text-teal-400">*</span>
              </label>
              <input
                type="date"
                value={transitionDeadline}
                onChange={(e) => setTransitionDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-teal-500 focus:outline-none"
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
              placeholder="e.g. Your next chapter starts now."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              iconLeft="RotateCcw"
              onClick={() => {
                if (window.confirm('Reset Career Switch Countdown module back to default presets?')) {
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
                  backgroundColor: '#10b981',
                  color: '#000',
                  fontWeight: 700,
                }}
              >
                Save 90-Day Transition Plan
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

