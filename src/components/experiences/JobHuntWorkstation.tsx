import React, { useState } from 'react';
import { CareerExperience, JobApplication, JobApplicationStage } from '../../types';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

const DEFAULT_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    company: 'Linear',
    role: 'Full Stack Product Engineer',
    dateApplied: '2026-11-04',
    stage: 'Recruiter Screen',
    notes: 'Initial chat went great. Technical challenge scheduled for next week.',
    targetSalary: '$195,000',
  },
  {
    id: 'app-2',
    company: 'Vercel',
    role: 'Frontend Infrastructure Engineer',
    dateApplied: '2026-11-03',
    stage: 'Technical Round',
    notes: 'Deep dive on Next.js Turbopack & Edge middleware.',
    targetSalary: '$210,000',
  },
  {
    id: 'app-3',
    company: 'Stripe',
    role: 'Software Engineer, Billing Core',
    dateApplied: '2026-11-01',
    stage: 'Applied',
    notes: 'Submitted via employee referral from college alumni.',
    targetSalary: '$225,000',
  },
];

const TEMPLATES = [
  {
    title: 'LinkedIn Recruiter InMail',
    subject: 'Senior Full Stack Engineer — Referral / Inbound Interest',
    text: `Hi [Name],\n\nI noticed your team at [Company] is scaling the [Product/Engineering] organization. I have 4+ years of hands-on experience building high-throughput React & TypeScript distributed systems, recently optimizing p99 latency by 91% at scale.\n\nI’d love to connect and see if my background aligns with open roles on the team.\n\nBest,\n[Your Name]`,
  },
  {
    title: '5-Day Polite Follow-Up',
    subject: 'Following up on [Role] application — [Your Name]',
    text: `Hi [Name],\n\nI hope your week is off to a great start! I’m following up on my application for the [Role] position submitted on [Date].\n\nI remain very enthusiastic about [Company]’s work in [Domain]. Please let me know if there are any additional work samples or references I can provide.\n\nThank you,\n[Your Name]`,
  },
  {
    title: 'Warm Connection / Peer Intro',
    subject: 'Quick question about engineering culture at [Company]',
    text: `Hey [Name],\n\nHope you're doing well! I saw you’ve been building at [Company] for [Time]. I’m currently preparing for a role on the engineering team and was hoping to ask a couple of quick questions about the day-to-day team culture and tech stack.\n\nWould you be open to a 10-minute coffee chat or async chat this week?\n\nCheers,\n[Your Name]`,
  },
];

export const JobHuntWorkstation: React.FC<Props> = ({ experience, onUpdateExperience }) => {
  const [dailyGoal] = useState(3);
  const [dailySent, setDailySent] = useState(2);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'templates' | 'metrics'>('pipeline');

  // Application Pipeline items persisted in experience
  const applications: JobApplication[] = experience.applications && experience.applications.length > 0
    ? experience.applications
    : DEFAULT_APPLICATIONS;

  // Form for adding new application
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStage, setNewStage] = useState<JobApplicationStage>('Applied');
  const [newSalary, setNewSalary] = useState('');

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    soundEngine.playSuccessChime();
    const newEntry: JobApplication = {
      id: `app-${Date.now()}`,
      company: newCompany.trim(),
      role: newRole.trim(),
      dateApplied: new Date().toISOString().split('T')[0],
      stage: newStage,
      notes: 'Applied via Offer Mode outreach sprint.',
      targetSalary: newSalary.trim() || undefined,
    };

    const updatedApps = [newEntry, ...applications];
    onUpdateExperience({
      ...experience,
      applications: updatedApps,
    });

    setDailySent((prev) => prev + 1);
    setNewCompany('');
    setNewRole('');
    setNewSalary('');
  };

  const handleUpdateStage = (id: string, stage: JobApplicationStage) => {
    soundEngine.playKeyClick();
    const updatedApps = applications.map((app) =>
      app.id === id ? { ...app, stage } : app
    );
    onUpdateExperience({
      ...experience,
      applications: updatedApps,
    });
  };

  const handleDeleteApplication = (id: string) => {
    soundEngine.playKeyClick();
    const updatedApps = applications.filter((app) => app.id !== id);
    onUpdateExperience({
      ...experience,
      applications: updatedApps,
    });
  };

  const handleIncrementDaily = () => {
    soundEngine.playKeyClick();
    setDailySent((prev) => prev + 1);
  };

  const handleCopyTemplate = (text: string) => {
    soundEngine.playKeyClick();
    navigator.clipboard.writeText(text);
  };

  const stageBadgeColor = (stage: JobApplicationStage) => {
    switch (stage) {
      case 'Offer Received':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/40';
      case 'Final Loop':
        return 'bg-cyan-950 text-cyan-400 border-cyan-500/40';
      case 'Technical Round':
        return 'bg-amber-950 text-amber-400 border-amber-500/40';
      case 'Recruiter Screen':
        return 'bg-blue-950 text-blue-400 border-blue-500/40';
      case 'Archived':
        return 'bg-zinc-800 text-zinc-500 border-zinc-700';
      default:
        return 'bg-zinc-900 text-zinc-300 border-zinc-800';
    }
  };

  // Funnel calculations
  const totalApps = applications.length;
  const screens = applications.filter((a) => a.stage === 'Recruiter Screen' || a.stage === 'Technical Round' || a.stage === 'Final Loop' || a.stage === 'Offer Received').length;
  const offers = applications.filter((a) => a.stage === 'Offer Received').length;
  const responseRate = totalApps > 0 ? ((screens / totalApps) * 100).toFixed(1) : '0';

  return (
    <Card className="space-y-6 bg-[#080D1A] border-cyan-500/25">
      {/* Header with Daily Target Ring */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Icon name="Briefcase" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight">
              30-Day Job Hunt Workstation
            </h3>
            <p className="text-xs text-zinc-400">
              Daily target execution, real application pipeline tracking, and recruiter message templates.
            </p>
          </div>
        </div>

        {/* Daily Target Counter */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#030611] border border-zinc-800">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
              Today's Applications
            </div>
            <div className="text-sm font-mono font-black text-white">
              <span className={dailySent >= dailyGoal ? 'text-emerald-400' : 'text-cyan-400'}>
                {dailySent}
              </span>
              <span className="text-zinc-500"> / {dailyGoal} Target</span>
            </div>
          </div>
          <button
            onClick={handleIncrementDaily}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-transform active:scale-95"
            title="Log application sent today"
          >
            +1 Sent
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'pipeline'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Active Pipeline ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'templates'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Outreach Templates
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'metrics'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Funnel Conversion
        </button>
      </div>

      {/* Tab 1: Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Quick-Add Form */}
          <form onSubmit={handleAddApplication} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <input
              type="text"
              placeholder="Company name (e.g. OpenAI)"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              placeholder="Role (e.g. Senior Frontend)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value as JobApplicationStage)}
              className="px-3 py-2 rounded-xl bg-[#030611] border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="Recruiter Screen">Recruiter Screen</option>
              <option value="Technical Round">Technical Round</option>
              <option value="Final Loop">Final Loop</option>
              <option value="Offer Received">Offer Received</option>
            </select>
            <Button size="sm" iconLeft="Plus" type="submit">
              Log Application
            </Button>
          </form>

          {/* Applications Table */}
          <div className="space-y-2">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-xl bg-[#030611] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-500/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{app.company}</span>
                    <span className="text-zinc-500 text-xs">•</span>
                    <span className="text-zinc-300 text-xs">{app.role}</span>
                    {app.targetSalary && (
                      <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {app.targetSalary}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Applied: {app.dateApplied} — <span className="italic text-zinc-400">{app.notes}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={app.stage}
                    onChange={(e) => handleUpdateStage(app.id, e.target.value as JobApplicationStage)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold bg-black/60 cursor-pointer focus:outline-none ${stageBadgeColor(
                      app.stage
                    )}`}
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Recruiter Screen">Recruiter Screen</option>
                    <option value="Technical Round">Technical Round</option>
                    <option value="Final Loop">Final Loop</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Archived">Archived</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDeleteApplication(app.id)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete application"
                  >
                    <Icon name="Trash2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Outreach Templates */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="text-xs font-bold text-cyan-400 mb-1">{tmpl.title}</div>
                <div className="text-[10px] text-zinc-500 font-mono mb-2">Subj: {tmpl.subject}</div>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-black/40 p-2.5 rounded-xl border border-zinc-900 font-sans">
                  {tmpl.text}
                </p>
              </div>

              <Button
                size="sm"
                variant="secondary"
                iconLeft="Copy"
                onClick={() => handleCopyTemplate(tmpl.text)}
              >
                Copy Template
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Funnel Metrics */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 text-center">
            <div className="text-[11px] text-zinc-400 uppercase font-mono">Applications Tracked</div>
            <div className="text-2xl font-black text-white mt-1 tabular-nums">{totalApps}</div>
            <div className="text-[10px] text-cyan-400 mt-1">Live sprint volume</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 text-center">
            <div className="text-[11px] text-zinc-400 uppercase font-mono">Interviews & Screens</div>
            <div className="text-2xl font-black text-white mt-1 tabular-nums">{screens}</div>
            <div className="text-[10px] text-emerald-400 mt-1">{responseRate}% Conversion Rate</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 text-center">
            <div className="text-[11px] text-zinc-400 uppercase font-mono">Offers Competing</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">{offers}</div>
            <div className="text-[10px] text-zinc-400 mt-1">Target: {experience.compensation?.currency || 'USD'} ${((experience.compensation?.targetTotalComp || 185000) / 1000).toFixed(0)}k</div>
          </div>
        </div>
      )}
    </Card>
  );
};

