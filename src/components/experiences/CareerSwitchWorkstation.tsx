import React, { useState } from 'react';
import { CareerExperience } from '../../types';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

interface TransferableMapping {
  fromRole: string;
  transferableStrengths: string[];
  framingPitch: string;
  recommendedBridgeProject: string;
}

const COMMON_CAREER_BRIDGES: TransferableMapping[] = [
  {
    fromRole: 'Legacy IT / Operations / SysAdmin',
    transferableStrengths: [
      'Deep hardware & networking intuition',
      'Crisis triage during live outages',
      'Understanding operational constraints & SLA impact',
    ],
    framingPitch:
      'I combine years of battle-tested infrastructure incident management with modern Cloud & Terraform automation, ensuring high uptime with zero developer friction.',
    recommendedBridgeProject:
      'Multi-region AWS Kubernetes deployment with Terraform IAC and automated Prometheus monitoring.',
  },
  {
    fromRole: 'Customer Support / Technical Success',
    transferableStrengths: [
      'Unmatched customer empathy and UX intuition',
      'Complex debugging and log analysis',
      'Clear documentation of reproduction steps',
    ],
    framingPitch:
      'Unlike developers who write isolated code, I build software informed by thousands of hours understanding real user frustration and operational edge cases.',
    recommendedBridgeProject:
      'Full-stack customer ticketing & feedback portal with real-time WebSocket notifications.',
  },
  {
    fromRole: 'Education / Teaching / Academics',
    transferableStrengths: [
      'Exceptional ability to explain complex abstractions simply',
      'Structured curriculum and goal setting',
      'Patience with iterative debugging',
    ],
    framingPitch:
      'My background in education makes me an exceptionally clear communicator who writes clean, self-documenting code and elevates team onboarding velocity.',
    recommendedBridgeProject:
      'Interactive visual learning tool with TypeScript and React animations.',
  },
  {
    fromRole: 'Finance / Business Analyst / Sales',
    transferableStrengths: [
      'Strong financial & ROI business acumen',
      'Analytical data modeling & SQL proficiency',
      'Cross-functional stakeholder negotiation',
    ],
    framingPitch:
      'I bridge technical implementation directly with business revenue impact, building systems that optimize both latency and unit economics.',
    recommendedBridgeProject:
      'Real-time financial analytics dashboard with complex SQL aggregations and caching.',
  },
];

export const CareerSwitchWorkstation: React.FC<Props> = ({ experience }) => {
  const [selectedBridgeIndex, setSelectedBridgeIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'bridge' | 'networking' | 'mindset'>('bridge');

  // Networking chats
  const [networkChats, setNetworkChats] = useState([
    {
      name: 'Sarah Chen (Ex-Accountant -> Senior Backend Dev at Shopify)',
      notes: 'Advised highlighting business domain knowledge in portfolio projects.',
      date: 'Nov 02',
    },
    {
      name: 'Marcus Bell (Ex-Teacher -> Lead Cloud Architect at Datadog)',
      notes: 'Reviewed resume; recommended framing prior communication skills as team leadership.',
      date: 'Oct 28',
    },
  ]);

  const bridge = COMMON_CAREER_BRIDGES[selectedBridgeIndex];

  return (
    <Card className="space-y-6 bg-[#080D1A] border-teal-500/25">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Icon name="Shuffle" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight">
              Career Switch & Skills Bridge Workstation
            </h3>
            <p className="text-xs text-zinc-400">
              Transform your previous career into an unfair competitive advantage rather than starting from zero.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('bridge')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'bridge'
                ? 'bg-teal-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Skills Bridge
          </button>
          <button
            onClick={() => setActiveTab('networking')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'networking'
                ? 'bg-teal-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Peer Chats ({networkChats.length})
          </button>
          <button
            onClick={() => setActiveTab('mindset')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'mindset'
                ? 'bg-teal-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Switch Mindset
          </button>
        </div>
      </div>

      {/* Tab 1: Skills Bridge */}
      {activeTab === 'bridge' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Select Your Previous / Current Career Background:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_CAREER_BRIDGES.map((b, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundEngine.playKeyClick();
                    setSelectedBridgeIndex(idx);
                  }}
                  className={`p-3 rounded-xl text-left border text-xs font-bold transition-all ${
                    selectedBridgeIndex === idx
                      ? 'bg-teal-950/70 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                      : 'bg-[#030611] border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {b.fromRole}
                </button>
              ))}
            </div>
          </div>

          {/* Transferable Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <Icon name="CheckCircle2" className="w-4 h-4" />
                <span>Your Transferable Superpowers</span>
              </span>
              <ul className="space-y-2 text-xs text-zinc-300 mt-2">
                {bridge.transferableStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Icon name="Code" className="w-4 h-4" />
                <span>Recommended Bridge Capstone Project</span>
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed mt-2 p-2.5 rounded-xl bg-black/40 border border-zinc-900">
                {bridge.recommendedBridgeProject}
              </p>
            </div>
          </div>

          {/* Framing Pitch Box */}
          <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Icon name="MessageSquare" className="w-4 h-4 text-cyan-400" />
                <span>How to Frame This in Interviews (Elevator Pitch)</span>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(bridge.framingPitch);
                  soundEngine.playKeyClick();
                }}
                className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 font-bold"
              >
                <Icon name="Copy" className="w-3 h-3" />
                <span>Copy Pitch</span>
              </button>
            </div>
            <p className="text-xs text-zinc-300 italic leading-relaxed p-3 rounded-xl bg-black/50 border border-zinc-900">
              "{bridge.framingPitch}"
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Networking Chats */}
      {activeTab === 'networking' && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300">
            Speaking with professionals who already made the exact career jump you are planning gives you real-world salary benchmarks, interview warnings, and high-probability referral paths.
          </p>

          <div className="space-y-3">
            {networkChats.map((chat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#030611] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-white">{chat.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{chat.notes}</div>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{chat.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Switch Mindset */}
      {activeTab === 'mindset' && (
        <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 space-y-3 text-xs text-zinc-300 leading-relaxed">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Icon name="Compass" className="w-4 h-4 text-teal-400" />
            <span>The 3 Pillars of a Successful Career Pivot</span>
          </h4>
          <p>
            <strong>1. You Don't Start from Scratch:</strong> Junior candidates often lack communication maturity, stakeholder empathy, and reliability. Your prior career proves you know how to operate in a professional setting.
          </p>
          <p>
            <strong>2. Proof Over Pedigree:</strong> In modern tech, a live deployed full-stack application with real users and clean GitHub code beats an empty CS degree every day of the week.
          </p>
          <p>
            <strong>3. The Power of "Bridge" Niches:</strong> You are exponentially more hireable if you pivot into a software company building tools for your prior industry (e.g. an accountant building fintech apps, or a teacher building edtech tools).
          </p>
        </div>
      )}
    </Card>
  );
};

