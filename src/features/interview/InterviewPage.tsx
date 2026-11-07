import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { ModuleHeroHeader } from '../../components/modules/ModuleHeroHeader';
import { ModuleCompletionBanner } from '../../components/modules/ModuleCompletionBanner';
import { InterviewModuleForm } from '../../components/modules/InterviewModuleForm';
import { MilestoneManager } from '../../components/common/MilestoneManager';
import { InterviewWorkstation } from '../../components/experiences/InterviewWorkstation';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { soundEngine } from '../../services/soundEngine';
import { Milestone, InterviewRound, DailyGoal } from '../../types';

export const InterviewPage: React.FC = () => {
  const { experiences, updateExperience, resetExperience, openLockScreen } = useAppStore();
  const track = experiences.find((e) => e.id === 'interview') || experiences[0];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [notes, setNotes] = useState(track.notes);

  const completedCount = track.milestones.filter((m) => m.completed).length;
  const totalCount = track.milestones.length;
  const completionPercentage =
    totalCount > 0 ? Number(((completedCount / totalCount) * 100).toFixed(1)) : 0;
  const isExpired = new Date(track.targetOfferDate).getTime() <= Date.now();

  const handleUpdateMilestones = (updatedMilestones: Milestone[]) => {
    updateExperience({
      ...track,
      milestones: updatedMilestones,
    });
  };

  const handleToggleGoal = (id: string) => {
    soundEngine.playKeyClick();
    const updated = track.dailyGoals.map((g) => {
      if (g.id !== id) return g;
      const nextCompleted = !g.completed;
      if (nextCompleted) soundEngine.playTick();
      return { ...g, completed: nextCompleted };
    });
    updateExperience({ ...track, dailyGoals: updated });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    soundEngine.playKeyClick();
    const newG: DailyGoal = {
      id: Date.now().toString(),
      trackId: 'interview',
      text: newGoalText.trim(),
      completed: false,
      category: 'Focus',
    };
    updateExperience({
      ...track,
      dailyGoals: [...track.dailyGoals, newG],
    });
    setNewGoalText('');
  };

  const handleDeleteGoal = (id: string) => {
    soundEngine.playKeyClick();
    updateExperience({
      ...track,
      dailyGoals: track.dailyGoals.filter((g) => g.id !== id),
    });
  };

  const handleCyclePipelineStatus = (roundId: string) => {
    soundEngine.playKeyClick();
    const statuses: InterviewRound['status'][] = ['upcoming', 'passed', 'review', 'pending'];
    const updated = track.interviewPipeline.map((r) => {
      if (r.id !== roundId) return r;
      const nextIdx = (statuses.indexOf(r.status) + 1) % statuses.length;
      return { ...r, status: statuses[nextIdx] };
    });
    updateExperience({ ...track, interviewPipeline: updated });
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    updateExperience({ ...track, notes: val });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Module Completion Celebratory State Banner */}
      <ModuleCompletionBanner
        moduleName="Interview Countdown"
        isCompleted={completionPercentage >= 100}
        isExpired={isExpired}
        completionPercentage={completionPercentage}
        completedMilestonesCount={completedCount}
        totalMilestonesCount={totalCount}
        onReset={() => resetExperience('interview')}
        onLaunchLockScreen={() => openLockScreen('interview')}
        themeColor="#ff9900"
      />

      {/* 2. Dedicated Hero Header with Live Precision Countdown */}
      <ModuleHeroHeader
        experience={track}
        onOpenEditForm={() => setIsEditModalOpen(true)}
        onResetModule={() => resetExperience('interview')}
        onLaunchLockScreen={() => openLockScreen('interview')}
        statsSnippet={
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              Type: <strong className="text-amber-400">{track.interviewType || 'Technical'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              Time: <strong className="text-white">{track.deadlineTime || '14:00'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              Milestones: <strong className="text-emerald-400">{completedCount}/{totalCount} Completed</strong>
            </span>
          </div>
        }
      />

      {/* 3. Behavioral STAR & Reverse Interview Workstation */}
      <section className="space-y-4">
        <InterviewWorkstation experience={track} onUpdateExperience={updateExperience} />
      </section>

      {/* 4. Universal Central Milestone Engine (Preset & Custom Milestones) */}
      <MilestoneManager
        milestones={track.milestones}
        trackId="interview"
        themeColor="#ff9900"
        onUpdateMilestones={handleUpdateMilestones}
      />

      {/* 5. Pipeline Stages & Daily Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interview Pipeline */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Award" className="w-4 h-4 text-emerald-400" />
              <span>Interview Pipeline Stages</span>
            </h3>
            <span className="text-xs text-zinc-500">Click badge to cycle status</span>
          </div>

          <div className="space-y-2.5">
            {track.interviewPipeline.map((round) => (
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

        {/* Daily Habits */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Flame" className="w-4 h-4 text-amber-500" />
              <span>Daily High-Leverage Habits</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {track.dailyGoals.filter((g) => g.completed).length}/{track.dailyGoals.length} Today
            </span>
          </div>

          <div className="space-y-2">
            {track.dailyGoals.map((g) => (
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
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs flex items-center gap-1 border border-amber-500/30"
            >
              <Icon name="Plus" className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </Card>
      </div>

      {/* 6. Preparation Notes */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Edit3" className="w-4 h-4 text-zinc-400" />
            <span>Interview Preparation Field Notes & STAR Stories</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">Auto-saved to LocalStorage</span>
        </div>

        <textarea
          rows={5}
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Log key learnings, reverse questions for interviewers, STAR stories..."
          className="w-full p-3.5 rounded-2xl bg-black/60 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono leading-relaxed resize-none"
        />
      </Card>

      {/* 7. Dedicated Module Form Modal */}
      <InterviewModuleForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        experience={track}
        onSave={updateExperience}
        onReset={() => resetExperience('interview')}
      />
    </div>
  );
};
