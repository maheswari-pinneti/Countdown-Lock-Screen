import React, { useState } from 'react';
import { CareerExperience, AppSettings, Milestone, InterviewRound, DailyGoal } from '../../types';
import { TrackHeader } from '../layout/TrackHeader';
import { MilestoneManager } from '../common/MilestoneManager';
import { soundEngine } from '../../services/soundEngine';
import { SweTrackDetail } from './SweTrackDetail';
import { InterviewWorkstation } from './InterviewWorkstation';
import { JobHuntWorkstation } from './JobHuntWorkstation';
import { CareerSwitchWorkstation } from './CareerSwitchWorkstation';
import { FirstJobWorkstation } from './FirstJobWorkstation';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Flame,
  Layers,
  Award,
  Edit3
} from 'lucide-react';

interface Props {
  experience: CareerExperience;
  settings: AppSettings;
  onUpdateExperience: (updated: CareerExperience) => void;
  onLaunchLockScreen: () => void;
}

export const ExperienceDetailView: React.FC<Props> = ({
  experience,
  onUpdateExperience,
  onLaunchLockScreen,
}) => {
  // Daily goal adder state
  const [newGoalText, setNewGoalText] = useState('');

  // Notes state
  const [notes, setNotes] = useState(experience.notes);

  const handleUpdateMilestones = (updatedMilestones: Milestone[]) => {
    onUpdateExperience({
      ...experience,
      milestones: updatedMilestones,
    });
  };

  const handleToggleGoal = (id: string) => {
    soundEngine.playKeyClick();
    const updated = experience.dailyGoals.map((g) => {
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
      dailyGoals: experience.dailyGoals.filter((g) => g.id !== id),
    });
  };

  const handleCyclePipelineStatus = (roundId: string) => {
    soundEngine.playKeyClick();
    const statuses: InterviewRound['status'][] = ['upcoming', 'passed', 'review', 'pending'];
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
    <div className="space-y-8 animate-fadeIn">
      {/* Central Reusable Track Header with Precision Countdown Engine & Config Modal */}
      <TrackHeader
        experience={experience}
        onUpdateExperience={onUpdateExperience}
        onLaunchLockScreen={onLaunchLockScreen}
      />

      {/* Track-Specific Interactive Protocol Workstation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Interactive Protocol Workstation</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">Real-time simulation engine</span>
        </div>

        {experience.id === 'developer' && (
          <SweTrackDetail experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
        {experience.id === 'interview' && (
          <InterviewWorkstation experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
        {experience.id === 'job-hunt' && (
          <JobHuntWorkstation experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
        {experience.id === 'career-switch' && (
          <CareerSwitchWorkstation experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
        {experience.id === 'first-job' && (
          <FirstJobWorkstation experience={experience} onUpdateExperience={onUpdateExperience} />
        )}
      </section>

      {/* Central Reusable Milestone Engine Component */}
      <MilestoneManager
        milestones={experience.milestones}
        trackId={experience.id}
        themeColor={experience.theme.primary}
        onUpdateMilestones={handleUpdateMilestones}
      />

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

        {/* Daily Habits */}
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
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
              placeholder="Add daily habit..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>

      {/* Field Notes Section */}
      <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-zinc-400" />
            <span>Executive Strategy & Interview Field Notes</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">Auto-saved to LocalStorage</span>
        </div>

        <textarea
          rows={5}
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Log key learnings, interviewer rubrics, counter-offer talking points..."
          className="w-full p-4 rounded-2xl bg-black/60 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono leading-relaxed resize-none"
        />

        {experience.quotes && experience.quotes.length > 0 && (
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 italic">
            "{experience.quotes[0]}"
          </div>
        )}
      </div>
    </div>
  );
};
