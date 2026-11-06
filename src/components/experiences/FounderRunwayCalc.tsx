import React, { useState } from 'react';
import { CareerExperience, JobHuntExperienceData, FeatureSprintItem } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

export const FounderRunwayCalc: React.FC<Props> = ({ experience, onUpdateExperience }) => {
  const jobHuntData: JobHuntExperienceData = experience.specialized.type === 'job-hunt'
    ? experience.specialized.data
    : {
        ventureName: experience.targetCompany,
        targetRaise: 3500000,
        postMoneyCap: 22000000,
        monthlyBurn: 28000,
        cashInBank: 320000,
        applicationsSent: 48,
        responseRatePct: 37.5,
        featureSprints: [
          { id: 'f1', name: 'Zero-downtime Agentic Tool Executor Runtime', status: 'shipped', impact: 'Critical' },
          { id: 'f2', name: 'Self-hosted LLM Inference Gateway with Speculative Decoding', status: 'shipped', impact: 'High' },
          { id: 'f3', name: 'Multi-Tenant Enterprise RBAC & SOC-2 Audit Logging', status: 'in_progress', impact: 'Critical' },
          { id: 'f4', name: 'Automated Sales Demo Provisioning & Sandbox Instance', status: 'planned', impact: 'Medium' },
        ],
      };

  const [cashInBank, setCashInBank] = useState<number>(jobHuntData.cashInBank || 320000);
  const [monthlyBurn, setMonthlyBurn] = useState<number>(jobHuntData.monthlyBurn || 28000);
  const [targetRaise, setTargetRaise] = useState<number>(jobHuntData.targetRaise || 3500000);
  const [postMoneyCap, setPostMoneyCap] = useState<number>(jobHuntData.postMoneyCap || 22000000);

  const [features, setFeatures] = useState<FeatureSprintItem[]>(jobHuntData.featureSprints || []);
  const [newFeatureName, setNewFeatureName] = useState('');

  // Calculations
  const runwayMonths = monthlyBurn > 0 ? (cashInBank / monthlyBurn).toFixed(1) : '99+';
  const dilutionPct = postMoneyCap > 0 ? ((targetRaise / postMoneyCap) * 100).toFixed(1) : '0';
  const founderRetainedPct = (100 - parseFloat(dilutionPct)).toFixed(1);
  const postRaiseRunwayMonths =
    monthlyBurn > 0 ? ((cashInBank + targetRaise) / (monthlyBurn * 1.5)).toFixed(1) : '0';

  const handleUpdateFinancials = (newCash: number, newBurn: number, newRaise: number, newCap: number) => {
    setCashInBank(newCash);
    setMonthlyBurn(newBurn);
    setTargetRaise(newRaise);
    setPostMoneyCap(newCap);

    const updatedMetrics = [...experience.customMetrics];
    const runwayMetric = updatedMetrics.find((m) => m.label.includes('Runway'));
    if (runwayMetric && newBurn > 0) {
      runwayMetric.current = parseFloat((newCash / newBurn).toFixed(1));
    }

    onUpdateExperience({
      ...experience,
      customMetrics: updatedMetrics,
      specialized: {
        type: 'job-hunt',
        data: {
          ...jobHuntData,
          cashInBank: newCash,
          monthlyBurn: newBurn,
          targetRaise: newRaise,
          postMoneyCap: newCap,
        },
      },
    });
  };

  const handleToggleFeature = (id: string) => {
    soundEngine.playKeyClick();
    const updatedFeatures: FeatureSprintItem[] = features.map((f) => {
      if (f.id !== id) return f;
      const nextStatus: FeatureSprintItem['status'] =
        f.status === 'planned' ? 'in_progress' : f.status === 'in_progress' ? 'shipped' : 'planned';
      if (nextStatus === 'shipped') soundEngine.playSuccessChime();
      return { ...f, status: nextStatus };
    });
    setFeatures(updatedFeatures);

    onUpdateExperience({
      ...experience,
      specialized: {
        type: 'job-hunt',
        data: {
          ...jobHuntData,
          featureSprints: updatedFeatures,
        },
      },
    });
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;
    soundEngine.playKeyClick();
    const newF: FeatureSprintItem = {
      id: Date.now().toString(),
      name: newFeatureName.trim(),
      status: 'planned',
      impact: 'High',
    };
    const updated = [...features, newF];
    setFeatures(updated);
    setNewFeatureName('');

    onUpdateExperience({
      ...experience,
      specialized: {
        type: 'job-hunt',
        data: {
          ...jobHuntData,
          featureSprints: updated,
        },
      },
    });
  };

  const handleDeleteFeature = (id: string) => {
    soundEngine.playKeyClick();
    const updated = features.filter((f) => f.id !== id);
    setFeatures(updated);
    onUpdateExperience({
      ...experience,
      specialized: {
        type: 'job-hunt',
        data: {
          ...jobHuntData,
          featureSprints: updated,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Warning */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
          parseFloat(runwayMonths) < 6
            ? 'bg-red-950/30 border-red-500/40 text-red-300'
            : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon name="AlertTriangle" className="w-4 h-4 shrink-0" />
          <span>
            Current Runway: <strong>{runwayMonths} Months</strong> (${(cashInBank / 1000).toFixed(0)}k cash at $
            {(monthlyBurn / 1000).toFixed(0)}k/mo burn).
          </span>
        </div>
        <span className="font-semibold uppercase tracking-wider font-mono">
          {parseFloat(runwayMonths) < 6 ? 'URGENT: ACCELERATE CLOSE' : 'CAPITAL STATUS HEALTHY'}
        </span>
      </div>

      {/* Financial Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="DollarSign" className="w-4 h-4 text-cyan-400" />
            <span>SAFE Note & Runway Parameters</span>
          </h3>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>Current Cash in Bank</span>
              <span className="font-mono text-cyan-400">${cashInBank.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="1500000"
              step="25000"
              value={cashInBank}
              onChange={(e) =>
                handleUpdateFinancials(Number(e.target.value), monthlyBurn, targetRaise, postMoneyCap)
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>Monthly Net Burn Rate</span>
              <span className="font-mono text-cyan-400">${monthlyBurn.toLocaleString()} /mo</span>
            </div>
            <input
              type="range"
              min="10000"
              max="100000"
              step="2000"
              value={monthlyBurn}
              onChange={(e) =>
                handleUpdateFinancials(cashInBank, Number(e.target.value), targetRaise, postMoneyCap)
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>Target Seed Raise</span>
              <span className="font-mono text-cyan-400">${targetRaise.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500000"
              max="6000000"
              step="250000"
              value={targetRaise}
              onChange={(e) =>
                handleUpdateFinancials(cashInBank, monthlyBurn, Number(e.target.value), postMoneyCap)
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>Post-Money Valuation Cap (YC SAFE)</span>
              <span className="font-mono text-cyan-400">${postMoneyCap.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="8000000"
              max="40000000"
              step="1000000"
              value={postMoneyCap}
              onChange={(e) =>
                handleUpdateFinancials(cashInBank, monthlyBurn, targetRaise, Number(e.target.value))
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </Card>

        {/* Calculated Results */}
        <Card className="flex flex-col justify-between border-cyan-500/30">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-semibold text-cyan-400">Equity Dilution Matrix</span>
              <Icon name="PieChart" className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400">Investor Ownership</span>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{dilutionPct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400">Founders Retained</span>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{founderRetainedPct}%</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Effective Pre-Money Valuation:</span>
                <span className="font-mono text-white">${(postMoneyCap - targetRaise).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Post-Raise Runway:</span>
                <span className="font-mono text-cyan-400 font-bold">{postRaiseRunwayMonths} Months</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Capital Efficiency Index:</span>
                <span className="font-mono text-white">{(targetRaise / monthlyBurn).toFixed(0)}x Monthly Burn</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300">
            ⚡ <strong>YC Formula:</strong> Keep seed round dilution under 18-20% to preserve substantial ownership for Series A & employee option pools.
          </div>
        </Card>
      </div>

      {/* Feature Ship Sprint */}
      <Card>
        <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon name="Rocket" className="w-4 h-4 text-cyan-400" />
            <span>Pre-Demo Day Feature Ship Sprint</span>
          </span>
          <span className="text-xs text-zinc-400 font-normal">Click status to cycle</span>
        </h4>

        <div className="space-y-2 mb-4">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => handleToggleFeature(feat.id)} className="text-zinc-400 hover:text-white">
                  {feat.status === 'shipped' ? (
                    <Icon name="CheckCircle2" className="w-4 h-4 text-emerald-400" />
                  ) : feat.status === 'in_progress' ? (
                    <Icon name="Circle" className="w-4 h-4 text-cyan-400 animate-pulse fill-cyan-400/20" />
                  ) : (
                    <Icon name="Circle" className="w-4 h-4 text-zinc-600" />
                  )}
                </button>
                <span
                  className={`font-medium ${
                    feat.status === 'shipped' ? 'line-through text-zinc-500' : 'text-zinc-200'
                  }`}
                >
                  {feat.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                    feat.status === 'shipped'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : feat.status === 'in_progress'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {feat.status}
                </span>
                <button onClick={() => handleDeleteFeature(feat.id)} className="p-1 text-zinc-500 hover:text-red-400">
                  <Icon name="Trash2" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddFeature} className="flex gap-2">
          <input
            type="text"
            value={newFeatureName}
            onChange={(e) => setNewFeatureName(e.target.value)}
            placeholder="Add upcoming killer feature or customer milestone..."
            className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
          />
          <Button size="sm" type="submit" iconLeft="Plus">
            Add Feature
          </Button>
        </form>
      </Card>
    </div>
  );
};
