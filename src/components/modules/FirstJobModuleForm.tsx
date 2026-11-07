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

export const FirstJobModuleForm: React.FC<Props> = ({
  isOpen,
  onClose,
  experience,
  onSave,
  onReset,
}) => {
  const [collegeName, setCollegeName] = useState(
    experience.collegeName || 'National Institute of Technology'
  );
  const [graduationYear, setGraduationYear] = useState<number | string>(
    experience.graduationYear || 2027
  );
  const [targetJobRole, setTargetJobRole] = useState(experience.targetRole || '');
  const [targetCompanies, setTargetCompanies] = useState(
    experience.targetCompanies || experience.targetCompany || ''
  );
  const [placementDate, setPlacementDate] = useState(
    experience.targetOfferDate ? experience.targetOfferDate.slice(0, 10) : ''
  );
  const [currentPrepLevel, setCurrentPrepLevel] = useState<
    'Beginner' | 'Intermediate' | 'Ready'
  >(experience.currentPrepLevel || 'Intermediate');
  const [motivationalMessage, setMotivationalMessage] = useState(
    experience.motivationalMessage || 'Your first offer is worth the preparation. Lay the foundation for a decade of growth.'
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
    if (!placementDate) {
      setErrorMsg('Placement drive date is required.');
      return;
    }

    setErrorMsg(null);
    const fullTargetDate = `${placementDate}T20:00:00`;

    const updated: CareerExperience = {
      ...experience,
      collegeName: collegeName.trim(),
      graduationYear: Number(graduationYear) || 2027,
      targetRole: targetJobRole.trim(),
      targetCompany: targetCompanies.trim() || experience.targetCompany,
      targetCompanies: targetCompanies.trim(),
      targetOfferDate: fullTargetDate,
      currentPrepLevel,
      motivationalMessage: motivationalMessage.trim(),
    };

    onSave(updated);
    soundEngine.playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-red-500/30 bg-zinc-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 flex items-center justify-center">
              <Icon name="graduation-cap" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Configure First Job Countdown
              </h2>
              <p className="text-xs text-zinc-400">
                Module 4 — Campus recruitment drive & first engineering offer pipeline
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
                College / University Name
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Graduation Year
              </label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                placeholder="2027"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Job Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                placeholder="e.g. Associate Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-red-500 focus:outline-none"
                required
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
                placeholder="e.g. CrowdStrike, Microsoft, Amazon, Cisco"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Placement Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={placementDate}
                onChange={(e) => setPlacementDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm font-mono focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Current Preparation Level
              </label>
              <select
                value={currentPrepLevel}
                onChange={(e) => setCurrentPrepLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-red-500 focus:outline-none"
              >
                <option value="Beginner">Beginner (Getting Started)</option>
                <option value="Intermediate">Intermediate (Practicing Aptitude & DSA)</option>
                <option value="Ready">Ready (Mock Assessment Phase)</option>
              </select>
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
              placeholder="e.g. Your first offer is worth the preparation."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              iconLeft="RotateCcw"
              onClick={() => {
                if (window.confirm('Reset First Job Countdown module back to default presets?')) {
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
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                Save Placement Plan
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

