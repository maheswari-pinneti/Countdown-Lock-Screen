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

export const InterviewModuleForm: React.FC<Props> = ({
  isOpen,
  onClose,
  experience,
  onSave,
  onReset,
}) => {
  const [companyName, setCompanyName] = useState(experience.targetCompany || '');
  const [jobTitle, setJobTitle] = useState(experience.targetRole || '');
  const [interviewDate, setInterviewDate] = useState(
    experience.targetOfferDate ? experience.targetOfferDate.slice(0, 10) : ''
  );
  const [interviewTime, setInterviewTime] = useState(
    experience.deadlineTime || (experience.targetOfferDate.length >= 16 ? experience.targetOfferDate.slice(11, 16) : '14:00')
  );
  const [interviewType, setInterviewType] = useState<
    'Technical' | 'HR' | 'Coding' | 'Managerial' | 'Other'
  >(experience.interviewType || 'Technical');
  const [prepNotes, setPrepNotes] = useState(
    experience.prepNotes || experience.notes || ''
  );
  const [motivationalMessage, setMotivationalMessage] = useState(
    experience.motivationalMessage || 'Every question is an opportunity to demonstrate competence and clarity.'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playKeyClick();

    if (!companyName.trim()) {
      setErrorMsg('Company name is required.');
      return;
    }
    if (!jobTitle.trim()) {
      setErrorMsg('Job title is required.');
      return;
    }
    if (!interviewDate) {
      setErrorMsg('Interview date is required.');
      return;
    }

    setErrorMsg(null);
    const fullTargetDate = `${interviewDate}T${interviewTime || '14:00'}:00`;

    const updated: CareerExperience = {
      ...experience,
      targetCompany: companyName.trim(),
      targetRole: jobTitle.trim(),
      targetOfferDate: fullTargetDate,
      deadlineTime: interviewTime || '14:00',
      interviewType,
      prepNotes: prepNotes.trim(),
      notes: prepNotes.trim(),
      motivationalMessage: motivationalMessage.trim(),
    };

    onSave(updated);
    soundEngine.playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-amber-500/30 bg-zinc-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Icon name="calendar-check" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Configure Interview Countdown
              </h2>
              <p className="text-xs text-zinc-400">
                Module 1 — Target interview schedule & technical preparation
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
                Company Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Citadel, Google"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Job Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend / Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Interview Date <span className="text-amber-400">*</span>
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Interview Time
              </label>
              <input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Interview Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-amber-500 focus:outline-none"
              >
                <option value="Technical">Technical</option>
                <option value="Coding">Coding</option>
                <option value="HR">HR</option>
                <option value="Managerial">Managerial</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Interview Preparation Notes
            </label>
            <textarea
              rows={3}
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="List specific focus areas: React fiber reconciliation, system design trade-offs, STAR stories..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Motivational Message
            </label>
            <input
              type="text"
              value={motivationalMessage}
              onChange={(e) => setMotivationalMessage(e.target.value)}
              placeholder="e.g. Every question is an opportunity to demonstrate competence and clarity."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              iconLeft="RotateCcw"
              onClick={() => {
                if (window.confirm('Reset Interview Countdown module back to default presets?')) {
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
                  backgroundColor: '#ff9900',
                  color: '#000',
                  fontWeight: 700,
                }}
              >
                Save Interview Plan
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

