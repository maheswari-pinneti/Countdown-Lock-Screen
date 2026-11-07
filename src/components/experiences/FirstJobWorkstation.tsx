import React, { useState } from 'react';
import { CareerExperience } from '../../types';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  category: 'docs' | 'day1' | 'growth';
  completed: boolean;
  notes: string;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'doc-1',
    label: 'Sign & archive official offer letter',
    category: 'docs',
    completed: true,
    notes: 'Saved copy in Google Drive and personal encrypted drive.',
  },
  {
    id: 'doc-2',
    label: 'Submit identity verification & I-9 / tax forms',
    category: 'docs',
    completed: true,
    notes: 'Submitted passport and W-4 withholding details to HR portal.',
  },
  {
    id: 'doc-3',
    label: 'Configure direct deposit & banking info',
    category: 'docs',
    completed: true,
    notes: 'Routing and account numbers verified.',
  },
  {
    id: 'doc-4',
    label: 'Complete background check clearance',
    category: 'docs',
    completed: true,
    notes: 'Approved via Checkr/Sterling.',
  },
  {
    id: 'doc-5',
    label: 'Receive and configure company laptop / hardware',
    category: 'docs',
    completed: false,
    notes: 'MacBook Pro shipped; expected 3 days before start date.',
  },
  // Day 1
  {
    id: 'd1-1',
    label: 'Introduce yourself in engineering Slack / Teams channel',
    category: 'day1',
    completed: false,
    notes: 'Short, friendly paragraph about your background and interests.',
  },
  {
    id: 'd1-2',
    label: 'Setup Git, SSH keys, GPG signing & local Docker dev environment',
    category: 'day1',
    completed: false,
    notes: 'Follow engineering onboarding README step-by-step.',
  },
  {
    id: 'd1-3',
    label: 'Schedule 30-min intro chat with assigned mentor buddy',
    category: 'day1',
    completed: false,
    notes: 'Ask about team rituals, favorite PR review styles, and quick wins.',
  },
  {
    id: 'd1-4',
    label: '1-on-1 alignment session with Engineering Manager',
    category: 'day1',
    completed: false,
    notes: 'Understand 30-day expectations and team communication preferences.',
  },
  // Growth
  {
    id: 'g-1',
    label: 'Days 1-30: Ship your first PR (bug fix or small docs update)',
    category: 'growth',
    completed: false,
    notes: 'Validates full CI/CD deployment pipeline knowledge.',
  },
  {
    id: 'g-2',
    label: 'Days 31-60: Own independent sprint tickets without hand-holding',
    category: 'growth',
    completed: false,
    notes: 'Demonstrates dependable core competency.',
  },
  {
    id: 'g-3',
    label: 'Days 61-90: Lead a small feature and present at team demo',
    category: 'growth',
    completed: false,
    notes: 'Solidifies promotion readiness trajectory.',
  },
];

export const FirstJobWorkstation: React.FC<Props> = ({ experience }) => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [activeCategory, setActiveCategory] = useState<'docs' | 'day1' | 'growth'>('docs');

  const handleToggle = (id: string) => {
    soundEngine.playKeyClick();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const filteredItems = items.filter((i) => i.category === activeCategory);
  const completedInCat = filteredItems.filter((i) => i.completed).length;
  const pct = Math.round((completedInCat / (filteredItems.length || 1)) * 100);

  return (
    <Card className="space-y-6 bg-[#080D1A] border-red-500/25">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
            <Icon name="GraduationCap" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight">
              First Job & Onboarding Workstation
            </h3>
            <p className="text-xs text-zinc-400">
              Clear document submissions, Day 1 essentials, and your 30-60-90 day growth playbook.
            </p>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#030611] border border-zinc-800 text-xs">
          <span className="text-zinc-400">Category Progress:</span>
          <span className="font-mono font-bold text-red-400">{pct}% Done</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2 text-xs">
        <button
          onClick={() => setActiveCategory('docs')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeCategory === 'docs'
              ? 'bg-red-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          📄 Pre-Joining Documents
        </button>
        <button
          onClick={() => setActiveCategory('day1')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeCategory === 'day1'
              ? 'bg-red-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          🚀 Day 1 Essentials
        </button>
        <button
          onClick={() => setActiveCategory('growth')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeCategory === 'growth'
              ? 'bg-red-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          📈 30-60-90 Day Success Plan
        </button>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              item.completed
                ? 'bg-[#030B09] border-emerald-500/30'
                : 'bg-[#030611] border-zinc-800 hover:border-red-500/40'
            }`}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => {}} // Handled by div click
              className="mt-1 w-4 h-4 accent-red-500 cursor-pointer rounded"
            />
            <div className="flex-1">
              <div
                className={`text-xs font-bold ${
                  item.completed ? 'text-zinc-400 line-through' : 'text-white'
                }`}
              >
                {item.label}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">{item.notes}</div>
            </div>
            {item.completed && (
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                Ready
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Career Advice Footer */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-3">
        <Icon name="Lightbulb" className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Pro-Tip for Juniors:</strong> In your first 30 days, asking well-researched questions after 15 minutes of trying on your own is respected far more than staying quietly blocked for hours.
        </span>
      </div>
    </Card>
  );
};

