import React, { useState } from 'react';
import { CareerExperience } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import {
  Code2,
  Layers,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Brain,
  Sliders
} from 'lucide-react';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

export const SweTrackDetail: React.FC<Props> = ({ experience, onUpdateExperience }) => {
  const [activeTab, setActiveTab] = useState<'coding' | 'comp' | 'system'>('coding');
  
  // Leetcode problem quick adder
  const [newProblemName, setNewProblemName] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newTopic, setNewTopic] = useState('Dynamic Programming');

  // Comp package local states
  const comp = experience.compensation;

  const handleCompChange = (field: keyof typeof comp, value: number) => {
    const updatedComp = { ...comp, [field]: value };
    // Recalculate targetTotalComp: base + (base * bonus%/100) + (equity / 4)
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

  const categories = experience.specializedData.leetcodeCategories || [];

  const handleUpdateCategory = (catIndex: number, deltaMastered: number) => {
    soundEngine.playKeyClick();
    const newCats = [...categories];
    newCats[catIndex].mastered = Math.max(0, Math.min(newCats[catIndex].count, newCats[catIndex].mastered + deltaMastered));
    onUpdateExperience({
      ...experience,
      specializedData: {
        ...experience.specializedData,
        leetcodeCategories: newCats,
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
          <Code2 className="w-4 h-4" />
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
          <DollarSign className="w-4 h-4" />
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
          <Layers className="w-4 h-4" />
          <span>System Design & Architecture</span>
        </button>
      </div>

      {/* Tab 1: Coding / Algorithms */}
      {activeTab === 'coding' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat: any, idx: number) => {
              const pct = Math.round((cat.mastered / cat.count) * 100);
              return (
                <div key={cat.name} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
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

          {/* Quick Problem Log */}
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
            <h4 className="text-sm font-bold text-zinc-200 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
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
          </div>
        </div>
      )}

      {/* Tab 2: Total Comp Modeler */}
      {activeTab === 'comp' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Offer Package Levers</span>
            </h3>

            {/* Base Salary */}
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

            {/* Bonus % */}
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                <span>Target Performance Bonus</span>
                <span className="font-mono text-emerald-400">{comp.bonusPercentage}% (${Math.round(comp.baseSalary * comp.bonusPercentage / 100).toLocaleString()}/yr)</span>
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

            {/* 4-Year Equity */}
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                <span>4-Year Equity Grant ({comp.equityType})</span>
                <span className="font-mono text-emerald-400">${comp.equityValue.toLocaleString()} (${Math.round(comp.equityValue / 4).toLocaleString()}/yr)</span>
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

            {/* Sign On Bonus */}
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
          </div>

          {/* Comp Summary Card */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Total Annual Compensation (Year 1)</span>
              <div className="text-4xl font-extrabold text-white font-mono mt-1 mb-4">
                ${(comp.targetTotalComp + comp.signOnBonus).toLocaleString()}
                <span className="text-xs font-normal text-zinc-400 ml-2">(incl. ${comp.signOnBonus.toLocaleString()} sign-on)</span>
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
                  <span className="font-mono text-emerald-400">${Math.round(comp.baseSalary * comp.bonusPercentage / 100).toLocaleString()} /yr</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">4-Year Cumulative Wealth Engine:</span>
                  <span className="font-mono text-white font-bold">${Math.round(comp.baseSalary * 4 + (comp.baseSalary * comp.bonusPercentage / 100 * 4) + comp.equityValue + comp.signOnBonus).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
              💡 <strong>Negotiation Rule:</strong> Always negotiate equity first—companies have wider equity discretion than base bands.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: System Design */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(experience.specializedData.systemDesignTopics || []).map((topic: string) => (
              <div key={topic} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h5 className="font-semibold text-sm text-zinc-100">{topic}</h5>
                  <p className="text-xs text-zinc-400 mt-1">
                    Master trade-offs: CAP theorem, partition tolerance, eventual vs strong consistency, sharding keys.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
