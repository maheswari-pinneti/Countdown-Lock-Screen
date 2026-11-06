import React, { useState } from 'react';
import { CareerExperience, AppSettings, Milestone, InterviewRound, DailyGoal } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';
import { soundEngine } from '../../services/soundEngine';
import { ExperienceIcon } from '../common/ExperienceIcon';
import { SweTrackDetail } from './SweTrackDetail';
import { QuantSpeedMath } from './QuantSpeedMath';
import { FounderRunwayCalc } from './FounderRunwayCalc';
import { NomadTimezoneBudget } from './NomadTimezoneBudget';
import { CyberTacticalOps } from './CyberTacticalOps';
import {
  Lock,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit3,
  Save,
  Sparkles,
  Flame,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Layers,
  Award
} from 'lucide-react';

interface Props {
  experience: CareerExperience;
  settings: AppSettings;
  onUpdateExperience: (updated: CareerExperience) => void;
  onLaunchLockScreen: () => void;
}

export const ExperienceDetailView: React.FC<Props> = ({
  experience,
  settings,
  onUpdateExperience,
  onLaunchLockScreen,
}) => {
  const countdown = useCountdown(experience.targetOfferDate);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editRole, setEditRole] = useState(experience.targetRole);
  const [editCompany, setEditCompany] = useState(experience.targetCompany);
  const [editDate, setEditDate] = useState(experience.targetOfferDate.slice(0, 16));

  // Milestone adder state
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  // Daily goal adder state
  const [newGoalText, setNewGoalText] = useState('');

  // Notes state
  const [notes, setNotes] = useState(experience.notes);

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccessChime();
    onUpdateExperience({
      ...experience,
      targetRole: editRole,
      targetCompany: editCompany,
      targetOfferDate: editDate,
    });
    setIsEditingHeader(false);
  };

  const handleToggleMilestone = (id: string) => {
    soundEngine.playKeyClick();
    const updated = experience.milestones.map(m => {
      if (m.id !== id) return m;
      const nextCompleted = !m.completed;
      if (nextCompleted) soundEngine.playSuccessChime();
      return { ...m, completed: nextCompleted };
    });
    onUpdateExperience({ ...experience, milestones: updated });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    soundEngine.playKeyClick();
    const newM: Milestone = {
      id: Date.now().toString(),
      trackId: experience.id,
      title: newMilestoneTitle.trim(),
      deadline: newMilestoneDate || new Date().toISOString().slice(0, 10),
      completed: false,
      category: 'prep',
    };
    onUpdateExperience({
      ...experience,
      milestones: [...experience.milestones, newM],
    });
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
  };

  const handleDeleteMilestone = (id: string) => {
    soundEngine.playKeyClick();
    onUpdateExperience({
      ...experience,
      milestones: experience.milestones.filter(m => m.id !== id),
    });
  };

  const handleToggleGoal = (id: string) => {
    soundEngine.playKeyClick();
    const updated = experience.dailyGoals.map(g => {
      if (g.id !== id) return g;
      const nextCompleted = !g.completed;
      if (nextCompleted) soundEngine.playTick();
      return { ...g, completed: nextCompleted };
    });
    onUpdateExperience({ ...experience, dailyGoals: updated });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    soundEngine.playKeyClick();
    const newG: DailyGoal = {
      id: Date.now().toString(),
      trackId: experience.id,
      text: newGoalText.trim(),
      completed: false,
      category: 'Focus',
    };
    onUpdateExperience({
      ...experience,
      dailyGoals: [...experience.dailyGoals, newG],
    });
    setNewGoalText('');
  };

  const handleDeleteGoal = (id: string) => {
    soundEngine.playKeyClick();
    onUpdateExperience({
      ...experience,
      dailyGoals: experience.dailyGoals.filter(g => g.id !== id),
    });
  };

  const handleCyclePipelineStatus = (roundId: string) => {
    soundEngine.playKeyClick();
    const statuses: InterviewRound['status'][] = ['upcoming', 'passed', 'review', 'pending'];
    const updated = experience.interviewPipeline.map(r => {
      if (r.id !== roundId) return r;
      const nextIdx = (statuses.indexOf(r.status) + 1) % statuses.length;
      return { ...r, status: statuses[nextIdx] };
    });
    onUpdateExperience({ ...experience, interviewPipeline: updated });
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    onUpdateExperience({ ...experience, notes: val });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Experience Header Banner */}
      <div
        className="p-6 md:p-8 rounded-3xl border relative overflow-hidden backdrop-blur-xl"
        style={{
          backgroundColor: '#0a0d14',
          borderColor: `${experience.theme.primary}30`,
          boxShadow: `0 0 50px ${experience.theme.primary}10`,
        }}
      >
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
          style={{ backgroundColor: experience.theme.primary }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5"
                style={{
                  backgroundColor: `${experience.theme.primary}15`,
                  borderColor: `${experience.theme.primary}40`,
                  color: experience.theme.primary,
                }}
              >
                <ExperienceIcon name={experience.icon} className="w-3.5 h-3.5" />
                <span>{experience.badge}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" />
                <span>{experience.streakDays} Day Streak</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                Readiness Score: {experience.readinessScore}%
              </span>
            </div>

            {isEditingHeader ? (
              <form onSubmit={handleSaveHeader} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Target Role Title</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Target Company / Program</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Target Offer Lock-In Date & Time</label>
                  <input
                    type="datetime-local"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-bold"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingHeader(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  <span>{experience.targetRole}</span>
                  <button
                    onClick={() => { soundEngine.playKeyClick(); setIsEditingHeader(true); }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800/80 transition-all"
                    title="Edit Target Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </h1>
                <p className="text-base text-zinc-300 font-medium mt-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-zinc-500" />
                  <span>{experience.targetCompany}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-emerald-400 font-semibold">
                    ${(experience.compensation.targetTotalComp / 1000).toFixed(0)}k Target Total Comp
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Quick Lock Screen Launcher & Countdown Summary */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800/80 flex items-center gap-4">
              <div className="text-left lg:text-right font-mono">
                <div className="text-xs text-zinc-400 font-medium">COUNTDOWN REMAINING</div>
                <div className="text-2xl md:text-3xl font-black text-white">
                  {countdown.formatted.days}d {countdown.formatted.hours}h {countdown.formatted.minutes}m {countdown.formatted.seconds}s
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playSuccessChime();
                onLaunchLockScreen();
              }}
              className="w-full lg:w-auto px-6 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              style={{
                backgroundColor: experience.theme.primary,
                color: '#000',
                boxShadow: `0 0 25px ${experience.theme.primary}50`,
              }}
            >
              <Lock className="w-4 h-4" />
              <span>Launch {experience.badge} Lock Screen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Track-Specific Interactive Core Tool */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <span>Interactive Protocol Workstation</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">Real-time simulation engine</span>
        </div>

        {experience.id === 'developer' && (
          <SweTrackDetail experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
        {experience.id === 'interview' && (
          <QuantSpeedMath experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
        {experience.id === 'job-hunt' && (
          <FounderRunwayCalc experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
        {experience.id === 'career-switch' && (
          <NomadTimezoneBudget experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
        {experience.id === 'first-job' && (
          <CyberTacticalOps experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
      </section>

      {/* Two-Column Grid: Pipeline & Roadmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Interview Pipeline Stages */}
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Interview Pipeline & Stages</span>
            </h3>
            <span className="text-xs text-zinc-400">Click badge to cycle status</span>
          </div>

          <div className="space-y-2.5">
            {experience.interviewPipeline.map((round, idx) => (
              <div
                key={round.id}
                className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800/80 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-500">0{idx + 1}</span>
                    <span className="font-semibold text-xs text-white">{round.title}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 leading-snug">
                    {round.focusArea}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-zinc-500 font-mono">{round.date}</span>
                  <button
                    onClick={() => handleCyclePipelineStatus(round.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                      round.status === 'passed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : round.status === 'upcoming'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : round.status === 'review'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {round.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Milestones Checklist */}
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Target Milestones Checklist</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {experience.milestones.filter(m => m.completed).length}/{experience.milestones.length} Done
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {experience.milestones.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleMilestone(m.id)}
                    className="text-zinc-500 hover:text-white"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600" />
                    )}
                  </button>
                  <span className={`font-medium ${m.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {m.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-500">{m.deadline}</span>
                  <button
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="p-1 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddMilestone} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              placeholder="Add key milestone (e.g. Master DP, Final Round)..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="date"
              value={newMilestoneDate}
              onChange={(e) => setNewMilestoneDate(e.target.value)}
              className="px-2 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-zinc-300 font-mono"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section: Daily Habits / Action Plan & Field Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Habits */}
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Daily High-Leverage Habits</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {experience.dailyGoals.filter(g => g.completed).length}/{experience.dailyGoals.length} Today
            </span>
          </div>

          <div className="space-y-2">
            {experience.dailyGoals.map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleGoal(g.id)}
                    className="text-zinc-500 hover:text-white"
                  >
                    {g.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600" />
                    )}
                  </button>
                  <span className={`font-medium ${g.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {g.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                    {g.category}
                  </span>
                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    className="p-1 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddGoal} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="Add daily habit (e.g. 2 LeetCode problems, 45min mock)..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs flex items-center gap-1 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </form>
        </div>

        {/* Tactical Strategy Notes */}
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center justify-between mb-2">
              <span className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-zinc-400" />
                <span>Executive Strategy & Interview Notes</span>
              </span>
              <span className="text-[10px] text-zinc-500">Auto-saved to LocalStorage</span>
            </h3>
            <textarea
              rows={6}
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Log key learnings, interviewer names, company specific rubrics, compensation notes..."
              className="w-full p-3.5 rounded-2xl bg-black/60 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono leading-relaxed resize-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 italic">
            "{experience.quotes[0]}"
          </div>
        </div>
      </div>
    </div>
  );
};

