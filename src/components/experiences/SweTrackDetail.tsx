import React, { useState } from 'react';
import { CareerExperience, DeveloperExperienceData, LeetCodeCategoryStat } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

export const SweTrackDetail: React.FC<Props> = ({ experience, onUpdateExperience }) => {
  const [activeTab, setActiveTab] = useState<'coding' | 'comp' | 'system'>('coding');

  const devData: DeveloperExperienceData = experience.specialized.type === 'developer'
    ? experience.specialized.data
    : {
        targetRole: experience.targetRole,
        targetCompany: experience.targetCompany,
        leetcodeCategories: [
          { name: 'Dynamic Programming', count: 78, mastered: 72 },
          { name: 'Distributed Systems / Graphs', count: 94, mastered: 90 },
          { name: 'Trees & Tries', count: 65, mastered: 65 },
          { name: 'Concurrency & Locks', count: 42, mastered: 38 },
        ],
        systemDesignTopics: [
          'Distributed Consensus (Raft/Paxos)',
          'Event-Driven CQRS Architecture',
          'Vector Similarity Search at Billions Scale',
          'Resilient Circuit Breakers & Backpressure',
        ],
        mockRating: 9.4,
        deepWorkHours: 340,
      };

  const comp = experience.compensation;

  const handleCompChange = (field: keyof typeof comp, value: number) => {
    const updatedComp = { ...comp, [field]: value };
    const annualizedEquity = updatedComp.equityValue / 4;
    const annualBonus = updatedComp.baseSalary * (updatedComp.bonusPercentage / 100);
    updatedComp.targetTotalComp = Math.round(updatedComp.baseSalary + annualBonus + annualizedEquity);

    onUpdateExperience({
      ...experience,
      compensation: updatedComp,
    });
  };

  const handleIncrementMetric = (index: number, delta: number) => {
    soundEngine.playKeyClick();
    const updatedMetrics = [...experience.customMetrics];
    updatedMetrics[index].current = Math.max(0, updatedMetrics[index].current + delta);
    onUpdateExperience({
      ...experience,
      customMetrics: updatedMetrics,
    });
  };

  const categories: LeetCodeCategoryStat[] = devData.leetcodeCategories || [];

  const handleUpdateCategory = (catIndex: number, deltaMastered: number) => {
    soundEngine.playKeyClick();
    const newCats = [...categories];
    newCats[catIndex].mastered = Math.max(
      0,
      Math.min(newCats[catIndex].count, newCats[catIndex].mastered + deltaMastered)
    );

    onUpdateExperience({
      ...experience,
      specialized: {
        type: 'developer',
        data: {
          ...devData,
          leetcodeCategories: newCats,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => { soundEngine.playKeyClick(); setActiveTab('coding'); }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'coding'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Icon name="Code2" className="w-4 h-4" />
          <span>Algorithms & NeetCode</span>
        </button>

        <button
          onClick={() => { soundEngine.playKeyClick(); setActiveTab('comp'); }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'comp'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Icon name="DollarSign" className="w-4 h-4" />
          <span>Total Compensation Modeler</span>
        </button>

        <button
          onClick={() => { soundEngine.playKeyClick(); setActiveTab('system'); }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'system'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Icon name="Layers" className="w-4 h-4" />
          <span>System Design & Architecture</span>
        </button>
      </div>

      {/* Tab 1: Coding / Algorithms */}
      {activeTab === 'coding' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, idx) => {
              const pct = Math.round((cat.mastered / cat.count) * 100);
              return (
                <div key={cat.name} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-zinc-200 text-sm">{cat.name}</span>
                    <span className="text-xs font-mono text-emerald-400">{cat.mastered} / {cat.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden mb-3">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleUpdateCategory(idx, -1)}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleUpdateCategory(idx, 1)}
                      className="px-2 py-0.5 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-mono font-bold"
                    >
                      +1 Solved
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Metric Velocity Adjuster */}
          <Card>
            <h4 className="text-sm font-bold text-zinc-200 mb-3 flex items-center gap-2">
              <Icon name="Brain" className="w-4 h-4 text-emerald-400" />
              <span>Core Metric Velocity Adjuster</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {experience.customMetrics.map((metric, idx) => (
                <div key={metric.label} className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 flex flex-col items-center">
                  <span className="text-xs text-zinc-400 text-center mb-1">{metric.label}</span>
                  <div className="text-xl font-bold font-mono text-white mb-2">
                    {metric.current} <span className="text-xs text-zinc-500 font-normal">{metric.unit}</span>
                  </div>
                  <div className="flex items-center gap-1.5 w-full justify-center">
                    <button
                      onClick={() => handleIncrementMetric(idx, -1)}
                      className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center justify-center"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleIncrementMetric(idx, 1)}
                      className="w-7 h-7 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Total Comp Modeler */}
      {activeTab === 'comp' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Icon name="Sliders" className="w-4 h-4 text-emerald-400" />
              <span>Offer Package Levers</span>
            </h3>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                <span>Annual Base Salary</span>
                <span className="font-mono text-emerald-400">${comp.baseSalary.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="140000"
                max="350000"
                step="5000"
                value={comp.baseSalary}
                onChange={(e) => handleCompChange('baseSalary', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                <span>Target Performance Bonus</span>
                <span className="font-mono text-emerald-400">
                  {comp.bonusPercentage}% (${Math.round((comp.baseSalary * comp.bonusPercentage) / 100).toLocaleString()}/yr)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2.5"
                value={comp.bonusPercentage}
                onChange={(e) => handleCompChange('bonusPercentage', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                <span>4-Year Equity Grant ({comp.equityType})</span>
                <span className="font-mono text-emerald-400">
                  ${comp.equityValue.toLocaleString()} (${Math.round(comp.equityValue / 4).toLocaleString()}/yr)
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="25000"
                value={comp.equityValue}
                onChange={(e) => handleCompChange('equityValue', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                <span>Sign-on Bonus (One-time)</span>
                <span className="font-mono text-emerald-400">${comp.signOnBonus.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="150000"
                step="5000"
                value={comp.signOnBonus}
                onChange={(e) => handleCompChange('signOnBonus', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </Card>

          {/* Comp Summary Card */}
          <Card className="flex flex-col justify-between border-emerald-500/30">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                Total Annual Compensation (Year 1)
              </span>
              <div className="text-4xl font-extrabold text-white font-mono mt-1 mb-4">
                ${(comp.targetTotalComp + comp.signOnBonus).toLocaleString()}
                <span className="text-xs font-normal text-zinc-400 ml-2">
                  (incl. ${comp.signOnBonus.toLocaleString()} sign-on)
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">Base Pay (Monthly Gross):</span>
                  <span className="font-mono text-white">${Math.round(comp.baseSalary / 12).toLocaleString()} /mo</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">Annualized Equity Vest:</span>
                  <span className="font-mono text-emerald-400">${Math.round(comp.equityValue / 4).toLocaleString()} /yr</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">Target Annual Bonus:</span>
                  <span className="font-mono text-emerald-400">
                    ${Math.round((comp.baseSalary * comp.bonusPercentage) / 100).toLocaleString()} /yr
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">4-Year Cumulative Wealth Engine:</span>
                  <span className="font-mono text-white font-bold">
                    ${Math.round(
                      comp.baseSalary * 4 +
                        (comp.baseSalary * comp.bonusPercentage * 4) / 100 +
                        comp.equityValue +
                        comp.signOnBonus
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
              💡 <strong>Negotiation Rule:</strong> Always negotiate equity first—companies have wider equity discretion than base salary bands.
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: System Design */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(devData.systemDesignTopics || []).map((topic: string) => (
            <div key={topic} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
              <Icon name="CheckCircle2" className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-semibold text-sm text-zinc-100">{topic}</h5>
                <p className="text-xs text-zinc-400 mt-1">
                  Master trade-offs: CAP theorem, partition tolerance, eventual vs strong consistency, sharding keys.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
