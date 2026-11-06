import React, { useState } from 'react';
import { CareerExperience, Milestone, DailyGoal, InterviewStage } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

export const TrackRoadmap: React.FC<Props> = ({ experience, onUpdateExperience }) => {
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [newGoalText, setNewGoalText] = useState('');
  const [notes, setNotes] = useState(experience.notes);

  const handleToggleMilestone = (id: string) => {
    soundEngine.playKeyClick();
    const updated = experience.milestones.map((m) => {
      if (m.id !== id) return m;
      const next = !m.completed;
      if (next) soundEngine.playSuccessChime();
      return { ...m, completed: next };
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
      milestones: experience.milestones.filter((m) => m.id !== id),
    });
  };

  const handleToggleGoal = (id: string) => {
    soundEngine.playKeyClick();
    const updated = experience.dailyGoals.map((g) => {
      if (g.id !== id) return g;
      const next = !g.completed;
      if (next) soundEngine.playTick();
      return { ...g, completed: next };
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
      dailyGoals: experience.dailyGoals.filter((g) => g.id !== id),
    });
  };

  const handleCyclePipelineStatus = (roundId: string) => {
    soundEngine.playKeyClick();
    const statuses: InterviewStage['status'][] = ['upcoming', 'passed', 'review', 'pending'];
    const updated = experience.interviewPipeline.map((r) => {
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
    <div className="space-y-8 mt-8">
      {/* Top 2 Columns: Pipeline & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interview Pipeline */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Award" className="w-4 h-4 text-emerald-400" />
              <span>Interview Pipeline & Stages</span>
            </h3>
            <span className="text-xs text-zinc-500">Click badge to cycle status</span>
          </div>

          <div className="space-y-2.5">
            {experience.interviewPipeline.map((round) => (
              <div
                key={round.id}
                className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800/80 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-500">0{round.roundNumber}</span>
                    <span className="font-semibold text-xs text-white">{round.title}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 leading-snug">{round.focusArea}</div>
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
        </Card>

        {/* Milestones Checklist */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="CheckCircle2" className="w-4 h-4 text-emerald-400" />
              <span>Target Milestones Checklist</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {experience.milestones.filter((m) => m.completed).length}/{experience.milestones.length} Done
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {experience.milestones.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => handleToggleMilestone(m.id)} className="text-zinc-500 hover:text-white">
                    <Icon
                      name={m.completed ? 'CheckCircle2' : 'Circle'}
                      className={`w-4 h-4 ${m.completed ? 'text-emerald-400' : 'text-zinc-600'}`}
                    />
                  </button>
                  <span className={`font-medium ${m.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {m.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-500">{m.deadline}</span>
                  <button onClick={() => handleDeleteMilestone(m.id)} className="p-1 text-zinc-500 hover:text-red-400">
                    <Icon name="Trash2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddMilestone} className="flex gap-2 pt-3">
            <input
              type="text"
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              placeholder="Add key milestone..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="date"
              value={newMilestoneDate}
              onChange={(e) => setNewMilestoneDate(e.target.value)}
              className="px-2 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-zinc-300 font-mono"
            />
            <Button size="sm" type="submit" iconLeft="Plus">
              Add
            </Button>
          </form>
        </Card>
      </div>

      {/* Bottom 2 Columns: Daily Habits & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Habits */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Flame" className="w-4 h-4 text-amber-500" />
              <span>Daily High-Leverage Habits</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {experience.dailyGoals.filter((g) => g.completed).length}/{experience.dailyGoals.length} Today
            </span>
          </div>

          <div className="space-y-2">
            {experience.dailyGoals.map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => handleToggleGoal(g.id)} className="text-zinc-500 hover:text-white">
                    <Icon
                      name={g.completed ? 'CheckCircle2' : 'Circle'}
                      className={`w-4 h-4 ${g.completed ? 'text-amber-400' : 'text-zinc-600'}`}
                    />
                  </button>
                  <span className={`font-medium ${g.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {g.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                    {g.category}
                  </span>
                  <button onClick={() => handleDeleteGoal(g.id)} className="p-1 text-zinc-500 hover:text-red-400">
                    <Icon name="Trash2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddGoal} className="flex gap-2 pt-3">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="Add daily habit..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <Button size="sm" type="submit" variant="secondary" iconLeft="Plus">
              Add Goal
            </Button>
          </form>
        </Card>

        {/* Tactical Notes */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icon name="Edit3" className="w-4 h-4 text-zinc-400" />
                <span>Executive Strategy & Interview Notes</span>
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Auto-saved to LocalStorage</span>
            </div>

            <textarea
              rows={6}
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Log key learnings, interviewer rubrics, counter-offer talking points..."
              className="w-full p-3.5 rounded-2xl bg-black/60 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono leading-relaxed resize-none"
            />
          </div>

          <div className="p-3.5 mt-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 italic">
            "{experience.quotes[0]}"
          </div>
        </Card>
      </div>
    </div>
  );
};

