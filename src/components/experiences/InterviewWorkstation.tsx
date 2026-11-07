import React, { useState } from 'react';
import { CareerExperience } from '../../types';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

interface StarStory {
  id: string;
  question: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

const COMMON_STAR_QUESTIONS = [
  'Tell me about a time you faced a difficult technical disagreement.',
  'Describe a project where the deadline was tight and requirements changed.',
  'Tell me about a major production bug or failure you caused and resolved.',
  'Describe a time you mentored or unblocked a teammate.',
  'Tell me about a technical project you are proudest of delivering.',
];

const REVERSE_QUESTIONS = [
  'What is the single biggest architectural challenge the engineering team is tackling this quarter?',
  'How do engineering, product, and design resolve trade-offs between velocity and technical debt?',
  'What does a typical on-call rotation look like, and how are post-mortems conducted?',
  'How is success evaluated for this role at the 6-month and 1-year marks?',
  'What growth or mentorship opportunities exist for engineers looking to level up here?',
];

export const InterviewWorkstation: React.FC<Props> = ({ experience }) => {
  const [activeTab, setActiveTab] = useState<'star' | 'questions' | 'confidence'>('star');
  const [selectedQuestion, setSelectedQuestion] = useState(COMMON_STAR_QUESTIONS[0]);

  // Local STAR builder state
  const [situation, setSituation] = useState(
    'Our legacy API endpoint latency was spiking to 4.2s during peak traffic, threatening SLA contracts.'
  );
  const [task, setTask] = useState(
    'I was tasked with diagnosing the bottleneck and reducing p99 response times below 350ms within 2 weeks.'
  );
  const [action, setAction] = useState(
    'I profiled memory allocations, discovered N+1 database queries, added Redis caching for idempotent reads, and created automated query explain analyzers.'
  );
  const [result, setResult] = useState(
    'Reduced p99 latency by 91% (down to 180ms), zero SLA breaches, and wrote an engineering runbook adopted by 3 teams.'
  );
  const [savedStories, setSavedStories] = useState<StarStory[]>([
    {
      id: 'star-1',
      question: 'Tell me about a time you resolved a major performance crisis.',
      situation: 'API latency spiking to 4.2s under high concurrency.',
      task: 'Cut p99 under 350ms without adding expensive server instances.',
      action: 'Identified N+1 queries, introduced Redis cache with cache invalidation keys.',
      result: 'p99 dropped by 91% to 180ms, saving $38k in monthly compute bills.',
    },
  ]);
  const [copied, setCopied] = useState(false);

  const handleSaveStory = () => {
    soundEngine.playSuccessChime();
    const newStory: StarStory = {
      id: `star-${Date.now()}`,
      question: selectedQuestion,
      situation,
      task,
      action,
      result,
    };
    setSavedStories([newStory, ...savedStories]);
  };

  const handleCopyStory = () => {
    soundEngine.playKeyClick();
    const fullText = `Question: ${selectedQuestion}\n\n[SITUATION]: ${situation}\n\n[TASK]: ${task}\n\n[ACTION]: ${action}\n\n[RESULT]: ${result}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="space-y-6 bg-[#080D1A] border-amber-500/25">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Icon name="Users" className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                Interview Readiness Workstation
              </h3>
              <p className="text-xs text-zinc-400">
                Craft compelling behavioral STAR responses and master high-leverage reverse interview questions.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('star')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'star'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            STAR Builder
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'questions'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Reverse Questions
          </button>
          <button
            onClick={() => setActiveTab('confidence')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'confidence'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Stories Saved ({savedStories.length})
          </button>
        </div>
      </div>

      {/* Tab 1: STAR Builder */}
      {activeTab === 'star' && (
        <div className="space-y-5">
          {/* Question Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Select Behavioral Interview Question
            </label>
            <select
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#030611] border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {COMMON_STAR_QUESTIONS.map((q, idx) => (
                <option key={idx} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* 4 STAR Framework Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center">
                  S
                </span>
                <span className="text-xs font-bold text-white">Situation</span>
              </div>
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                rows={3}
                placeholder="Set the context, team size, company stage, and core challenge..."
                className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center">
                  T
                </span>
                <span className="text-xs font-bold text-white">Task</span>
              </div>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                rows={3}
                placeholder="What was your specific responsibility or goal to achieve?"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center">
                  A
                </span>
                <span className="text-xs font-bold text-white">Action</span>
              </div>
              <textarea
                value={action}
                onChange={(e) => setAction(e.target.value)}
                rows={3}
                placeholder="What concrete steps did you personally take? What tools/frameworks did you use?"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center">
                  R
                </span>
                <span className="text-xs font-bold text-white">Result & Metrics</span>
              </div>
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={3}
                placeholder="What was the measurable outcome? (% latency drop, $ saved, users impacted)"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button size="sm" variant="secondary" iconLeft="Copy" onClick={handleCopyStory}>
              {copied ? 'Copied to Clipboard!' : 'Copy STAR Answer'}
            </Button>
            <Button size="sm" iconLeft="Bookmark" onClick={handleSaveStory}>
              Save Story to Vault
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Reverse Questions */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300">
            Asking thoughtful, senior-caliber questions at the end of your interview signals genuine ownership, leadership maturity, and intellectual rigor.
          </p>
          <div className="space-y-3">
            {REVERSE_QUESTIONS.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#030611] border border-zinc-800 flex items-start gap-3 hover:border-amber-500/40 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 text-xs text-zinc-200 leading-relaxed font-medium">
                  {q}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(q);
                    soundEngine.playKeyClick();
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Copy question"
                >
                  <Icon name="Copy" className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Saved Stories */}
      {activeTab === 'confidence' && (
        <div className="space-y-4">
          {savedStories.map((story) => (
            <div
              key={story.id}
              className="p-4 rounded-2xl bg-[#030712] border border-zinc-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">{story.question}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `[S]: ${story.situation}\n[T]: ${story.task}\n[A]: ${story.action}\n[R]: ${story.result}`
                    );
                    soundEngine.playKeyClick();
                  }}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <Icon name="Copy" className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
                <div className="p-2 rounded bg-black/40 border border-zinc-900">
                  <strong className="text-amber-400">S:</strong> {story.situation}
                </div>
                <div className="p-2 rounded bg-black/40 border border-zinc-900">
                  <strong className="text-amber-400">T:</strong> {story.task}
                </div>
                <div className="p-2 rounded bg-black/40 border border-zinc-900">
                  <strong className="text-amber-400">A:</strong> {story.action}
                </div>
                <div className="p-2 rounded bg-black/40 border border-zinc-900">
                  <strong className="text-emerald-400">R:</strong> {story.result}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

