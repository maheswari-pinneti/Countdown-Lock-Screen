import React, { useState } from 'react';
import { CareerExperience, FirstJobExperienceData, CveLabItem } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

export const CyberTacticalOps: React.FC<Props> = ({ experience, onUpdateExperience }) => {
  const cyberData: FirstJobExperienceData = experience.specialized.type === 'first-job'
    ? experience.specialized.data
    : {
        pathway: 'Offensive Security Specialist & Tactical Defense',
        clearanceScope: 'TS_SCI',
        defconStatus: 'DEFCON 1: MAXIMUM OFFER READINESS',
        competingOffersCount: 2,
        recruiterUrgency: 4,
        githubContributions: 1420,
        cveLabs: [
          { id: 'c1', cveId: 'CVE-2024-38077', target: 'Windows RPKI Remote Code Execution', status: 'Replicated', severity: 'Critical' },
          { id: 'c2', cveId: 'CVE-2024-21413', target: 'Microsoft Outlook Moniker Bypass', status: 'Replicated', severity: 'Critical' },
          { id: 'c3', cveId: 'CVE-2023-36884', target: 'Office & Windows HTML EDR Bypass', status: 'Patched', severity: 'High' },
        ],
      };

  const [competingOffers, setCompetingOffers] = useState(cyberData.competingOffersCount || 2);
  const [clearanceLevel, setClearanceLevel] = useState<'Secret' | 'TS_SCI'>(cyberData.clearanceScope === 'Secret' ? 'Secret' : 'TS_SCI');
  const [recruiterUrgency, setRecruiterUrgency] = useState(cyberData.recruiterUrgency || 4);
  const [initialOfferBase, setInitialOfferBase] = useState(experience.compensation.currentOffer || 350000);

  const [cveLabs, setCveLabs] = useState<CveLabItem[]>(cyberData.cveLabs || []);
  const [newCveId, setNewCveId] = useState('');
  const [newTarget, setNewTarget] = useState('');

  const competingBump = competingOffers * 5;
  const clearanceBump = clearanceLevel === 'TS_SCI' ? 8 : 4;
  const urgencyBump = Math.max(0, (recruiterUrgency - 2) * 2.5);
  const totalSuggestedBumpPct = Math.min(35, Math.round(8 + competingBump + clearanceBump + urgencyBump));

  const recommendedCounterOffer = Math.round(initialOfferBase * (1 + totalSuggestedBumpPct / 100));

  const handleToggleCve = (id: string) => {
    soundEngine.playKeyClick();
    const updated: CveLabItem[] = cveLabs.map((lab) => {
      if (lab.id !== id) return lab;
      const nextStatus: CveLabItem['status'] =
        lab.status === 'In_Progress' ? 'Replicated' : lab.status === 'Replicated' ? 'Patched' : 'In_Progress';
      if (nextStatus === 'Replicated') soundEngine.playSuccessChime();
      return { ...lab, status: nextStatus };
    });
    setCveLabs(updated);
    onUpdateExperience({
      ...experience,
      specialized: {
        type: 'first-job',
        data: {
          ...cyberData,
          cveLabs: updated,
        },
      },
    });
  };

  const handleAddCve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCveId.trim()) return;
    soundEngine.playKeyClick();
    const newLab: CveLabItem = {
      id: Date.now().toString(),
      cveId: newCveId.trim(),
      target: newTarget.trim() || 'Zero-day privilege escalation research',
      status: 'In_Progress',
      severity: 'Critical',
    };
    const updated = [...cveLabs, newLab];
    setCveLabs(updated);
    setNewCveId('');
    setNewTarget('');

    onUpdateExperience({
      ...experience,
      specialized: {
        type: 'first-job',
        data: {
          ...cyberData,
          cveLabs: updated,
        },
      },
    });
  };

  const handleDeleteCve = (id: string) => {
    soundEngine.playKeyClick();
    const updated = cveLabs.filter((c) => c.id !== id);
    setCveLabs(updated);
    onUpdateExperience({
      ...experience,
      specialized: {
        type: 'first-job',
        data: {
          ...cyberData,
          cveLabs: updated,
        },
      },
    });
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Tactical Banner */}
      <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex flex-wrap items-center justify-between text-xs text-red-300">
        <div className="flex items-center gap-3">
          <Icon name="AlertOctagon" className="w-5 h-5 text-red-400 animate-pulse" />
          <span>
            OPERATIONAL READINESS: <strong>{cyberData.defconStatus}</strong>
          </span>
        </div>
        <span className="font-bold tracking-wider text-red-400">
          BATNA LEVERAGE INDEX: +{totalSuggestedBumpPct}%
        </span>
      </div>

      {/* Counter-Offer Negotiation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Crosshair" className="w-4 h-4 text-red-400" />
            <span>Counter-Offer Leverage Calibrator</span>
          </h3>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>Current First Offer Received</span>
              <span className="font-mono text-red-400">${initialOfferBase.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200000"
              max="500000"
              step="10000"
              value={initialOfferBase}
              onChange={(e) => setInitialOfferBase(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>Competing Final-Round Offers</span>
              <span className="font-mono text-red-400">{competingOffers} Offers Active</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              value={competingOffers}
              onChange={(e) => setCompetingOffers(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>Security Clearance Scope</span>
              <span className="font-mono text-red-400">
                {clearanceLevel === 'TS_SCI' ? 'Top Secret / SCI Full Scope' : 'Secret Clearance'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setClearanceLevel('Secret')}
                className={`py-2 rounded-xl text-xs font-semibold border ${
                  clearanceLevel === 'Secret'
                    ? 'bg-red-950/60 border-red-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                Secret
              </button>
              <button
                type="button"
                onClick={() => setClearanceLevel('TS_SCI')}
                className={`py-2 rounded-xl text-xs font-semibold border ${
                  clearanceLevel === 'TS_SCI'
                    ? 'bg-red-950/60 border-red-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                TS / SCI (+8% Prem.)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>Recruiter Urgency (1-5)</span>
              <span className="font-mono text-red-400">Level {recruiterUrgency}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={recruiterUrgency}
              onChange={(e) => setRecruiterUrgency(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>
        </Card>

        {/* Tactical Recommendation Output */}
        <Card className="flex flex-col justify-between border-red-500/30">
          <div>
            <span className="text-xs uppercase font-semibold text-red-400 tracking-wider">
              Algorithmic Counter-Offer Target
            </span>
            <div className="text-4xl font-extrabold text-white font-mono mt-1 mb-2">
              ${recommendedCounterOffer.toLocaleString()}
              <span className="text-xs font-normal text-emerald-400 ml-2">
                (+${(recommendedCounterOffer - initialOfferBase).toLocaleString()})
              </span>
            </div>

            <div className="space-y-2 text-xs mt-4">
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/50 space-y-1.5">
                <span className="font-bold text-red-300">Negotiation Playbook Script:</span>
                <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                  "I am extremely excited about the mission and technical scope at {experience.targetCompany}. Given my
                  active TS/SCI clearance and parallel discussions with peer firms offering ~$
                  {(recommendedCounterOffer / 1000).toFixed(0)}k total compensation, if we can close the gap to $
                  {recommendedCounterOffer.toLocaleString()}, I am prepared to sign immediately."
                </p>
              </div>

              <div className="flex justify-between py-1.5 border-b border-zinc-800 text-xs">
                <span className="text-zinc-400">Leverage Premium Breakdown:</span>
                <span className="font-mono text-red-400">+{totalSuggestedBumpPct}% over initial</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800 text-xs">
                <span className="text-zinc-400">BATNA Strength:</span>
                <span className="font-mono text-emerald-400 font-bold">EXTREMELY STRONG</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-300">
            🎯 <strong>Principal Rule:</strong> Never negotiate from fear. Walk-away leverage is the only true power in
            high-stakes compensation talks.
          </div>
        </Card>
      </div>

      {/* CVE Lab Log */}
      <Card>
        <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon name="Terminal" className="w-4 h-4 text-red-400" />
            <span>Active Vulnerability Research & CVE Range</span>
          </span>
          <span className="text-xs text-zinc-400 font-normal">Click status to cycle</span>
        </h4>

        <div className="space-y-2 mb-4">
          {cveLabs.map((lab) => (
            <div
              key={lab.id}
              className="p-3 rounded-xl bg-black/50 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => handleToggleCve(lab.id)} className="text-zinc-400 hover:text-white">
                  {lab.status === 'Replicated' ? (
                    <Icon name="CheckCircle2" className="w-4 h-4 text-red-400" />
                  ) : lab.status === 'Patched' ? (
                    <Icon name="CheckCircle2" className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon name="AlertOctagon" className="w-4 h-4 text-amber-400" />
                  )}
                </button>
                <div>
                  <span className="font-bold text-red-400 mr-2">{lab.cveId}</span>
                  <span className="text-zinc-300">{lab.target}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                    lab.status === 'Replicated'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : lab.status === 'Patched'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {lab.status}
                </span>
                <button onClick={() => handleDeleteCve(lab.id)} className="p-1 text-zinc-500 hover:text-red-400">
                  <Icon name="Trash2" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddCve} className="flex gap-2">
          <input
            type="text"
            value={newCveId}
            onChange={(e) => setNewCveId(e.target.value)}
            placeholder="CVE-2024-XXXX"
            className="w-36 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-400 font-mono"
          />
          <input
            type="text"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            placeholder="Target vulnerability description / bypass mechanism..."
            className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-400 font-mono"
          />
          <Button size="sm" type="submit" iconLeft="Plus">
            Add CVE
          </Button>
        </form>
      </Card>
    </div>
  );
};
