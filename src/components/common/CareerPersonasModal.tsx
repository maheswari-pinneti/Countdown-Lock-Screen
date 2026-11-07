import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Button } from './Button';
import { soundEngine } from '../../services/soundEngine';
import { ExperienceTrackId } from '../../types';

export interface CareerPersona {
  id: ExperienceTrackId;
  title: string;
  archetype: string;
  badge: string;
  icon: string;
  accentColor: string;
  tagline: string;
  targetTimeline: string;
  commonStruggles: string[];
  winningStrategy: string;
  recommendedRoute: string;
}

export const CAREER_PERSONAS: CareerPersona[] = [
  {
    id: 'first-job',
    title: 'The First-Job Achiever',
    archetype: 'College Senior / Junior Entry-Level',
    badge: 'Campus to Career',
    icon: 'GraduationCap',
    accentColor: '#ef4444',
    tagline: 'Turning academic projects into your very first corporate software engineering offer.',
    targetTimeline: '46 Days to Placement Drive',
    commonStruggles: [
      'Zero commercial production experience on resume',
      'Campus placement aptitude test anxiety',
      'Feeling intimidated by corporate behavioral interviews',
    ],
    winningStrategy:
      'Ship 1 high-polish full-stack capstone project with live URL, master core OOP & DSA fundamentals, and practice 2-minute project elevator pitches.',
    recommendedRoute: '/first-job',
  },
  {
    id: 'job-hunt',
    title: 'The High-Velocity 30-Day Sprinter',
    archetype: 'Active Job Seeker / Post-Layoff Rebound',
    badge: '30-Day Sprint',
    icon: 'Briefcase',
    accentColor: '#06b6d4',
    tagline: 'Disciplined daily application cadence turning radio silence into competing offer leverage.',
    targetTimeline: '30 Days Sprint Deadline',
    commonStruggles: [
      'Sending hundreds of cold applications into the ATS void',
      'Ghosting after initial recruiter phone screens',
      'Application fatigue and emotional burnout',
    ],
    winningStrategy:
      'Lock in 3 tailored applications/day via LinkedIn engineering manager outreach and warm alumni referrals instead of mass clicking Easy Apply.',
    recommendedRoute: '/job-hunt',
  },
  {
    id: 'interview',
    title: 'The High-Stakes Interview Candidate',
    archetype: 'Tier-1 Candidate / Superday Loop',
    badge: 'Interview Protocol',
    icon: 'CalendarCheck',
    accentColor: '#ff9900',
    tagline: 'Converting scheduled rounds into signed top-tier offers with structured STAR responses.',
    targetTimeline: '24 Days to Virtual Superday',
    commonStruggles: [
      'Freezing under live whiteboard coding pressure',
      'Rambling in behavioral rounds without crisp metric outcomes',
      'Struggling to articulate distributed system architectural trade-offs',
    ],
    winningStrategy:
      'Rehearse STAR answers aloud with exact metrics, practice 2 timed medium/hard LeetCode problems daily, and master senior reverse interview questions.',
    recommendedRoute: '/interview',
  },
  {
    id: 'developer',
    title: 'The Lifelong Skill Upgrader',
    archetype: 'Mid-Level Dev -> Staff / Principal',
    badge: 'Engineering Mastery',
    icon: 'Code',
    accentColor: '#22c55e',
    tagline: 'Deepening distributed systems, modern TypeScript, and architecture to unlock high compensation.',
    targetTimeline: '39 Days Mastery Target',
    commonStruggles: [
      'Stuck in maintenance tickets with no modern tech exposure at current job',
      'Imposter syndrome around distributed consensus and low-level internals',
      'Finding uninterrupted deep work hours alongside a busy schedule',
    ],
    winningStrategy:
      'Commit to 2.5 hours of daily focused study: language internals, Raft/Paxos consensus diagrams, and end-to-end distributed system blueprints.',
    recommendedRoute: '/developer',
  },
  {
    id: 'career-switch',
    title: 'The Bold Domain Pivoter',
    archetype: 'Non-Tech / Support / Operations -> Tech',
    badge: 'Career Switch',
    icon: 'Shuffle',
    accentColor: '#10b981',
    tagline: 'Leveraging prior career judgment as an unfair advantage to land a modern cloud or coding role.',
    targetTimeline: '55 Days to Transition',
    commonStruggles: [
      'Fear of competing against 22-year-old CS graduates',
      'Wondering if older career history is a liability',
      'Overwhelmed by endless online tech tutorial choices',
    ],
    winningStrategy:
      'Position prior domain knowledge as a unique competitive edge, target companies building tools for your prior industry, and showcase tangible deployed proofs.',
    recommendedRoute: '/career-switch',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CareerPersonasModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<CareerPersona>(CAREER_PERSONAS[0]);

  if (!isOpen) return null;

  const handleSelectAndNavigate = (route: string) => {
    soundEngine.playSuccessChime();
    onClose();
    navigate(route);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Career Personas Directory"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#080D1A] border-2 border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Close"
        >
          <Icon name="X" className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase mb-2">
            <span>Career Personas Directory</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Which Career Journey Are You On?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Choose your archetype to immediately personalize your countdown clocks, daily habits, and lock-screen wallpaper reminders.
          </p>
        </div>

        {/* 5 Persona Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {CAREER_PERSONAS.map((p) => {
            const isSelected = selectedPersona.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  soundEngine.playKeyClick();
                  setSelectedPersona(p);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-[#0E162B] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-[#040711] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: p.accentColor }}
                  />
                  <Icon name={p.icon as any} className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white line-clamp-1">{p.title}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{p.badge}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Deep Dive Card */}
        <div
          className="p-6 rounded-3xl border space-y-5 bg-[#030712]"
          style={{ borderColor: `${selectedPersona.accentColor}40` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase"
                  style={{
                    backgroundColor: `${selectedPersona.accentColor}20`,
                    color: selectedPersona.accentColor,
                  }}
                >
                  {selectedPersona.archetype}
                </span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-xs text-zinc-400 font-mono">{selectedPersona.targetTimeline}</span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">{selectedPersona.title}</h3>
              <p className="text-xs text-zinc-300 mt-1">{selectedPersona.tagline}</p>
            </div>

            <Button
              size="sm"
              iconRight="ArrowRight"
              onClick={() => handleSelectAndNavigate(selectedPersona.recommendedRoute)}
            >
              Open This Track
            </Button>
          </div>

          {/* Grid: Struggles vs Winning Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <Icon name="AlertTriangle" className="w-4 h-4" />
                <span>Everyday Career Struggles</span>
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-300 mt-1">
                {selectedPersona.commonStruggles.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Icon name="CheckCircle2" className="w-4 h-4" />
                <span>The Winning Strategy</span>
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                {selectedPersona.winningStrategy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

