import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { ModuleHeroHeader } from '../../components/modules/ModuleHeroHeader';
import { ModuleCompletionBanner } from '../../components/modules/ModuleCompletionBanner';
import { FirstJobModuleForm } from '../../components/modules/FirstJobModuleForm';
import { MilestoneManager } from '../../components/common/MilestoneManager';
import { FirstJobWorkstation } from '../../components/experiences/FirstJobWorkstation';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { soundEngine } from '../../services/soundEngine';
import { Milestone, DailyGoal } from '../../types';

export const FirstJobPage: React.FC = () => {
  const { experiences, updateExperience, resetExperience, openLockScreen } = useAppStore();
  const track = experiences.find((e) => e.id === 'first-job') || experiences[3];

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
      trackId: 'first-job',
      text: newGoalText.trim(),
      completed: false,
      category: 'Campus Prep',
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

  const handleNotesChange = (val: string) => {
    setNotes(val);
    updateExperience({ ...track, notes: val });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Module Completion Celebratory State Banner */}
      <ModuleCompletionBanner
        moduleName="First Job Countdown"
        isCompleted={completionPercentage >= 100}
        isExpired={isExpired}
        completionPercentage={completionPercentage}
        completedMilestonesCount={completedCount}
        totalMilestonesCount={totalCount}
        onReset={() => resetExperience('first-job')}
        onLaunchLockScreen={() => openLockScreen('first-job')}
        themeColor="#ef4444"
      />

      {/* 2. Dedicated Hero Header with Live Precision Countdown */}
      <ModuleHeroHeader
        experience={track}
        onOpenEditForm={() => setIsEditModalOpen(true)}
        onResetModule={() => resetExperience('first-job')}
        onLaunchLockScreen={() => openLockScreen('first-job')}
        statsSnippet={
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              College: <strong className="text-white">{track.collegeName || 'National Institute of Tech'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              Graduation: <strong className="text-red-400">{track.graduationYear || 2027}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              Prep Level: <strong className="text-amber-400">{track.currentPrepLevel || 'Intermediate'}</strong>
            </span>
          </div>
        }
      />

      {/* 3. First Job & Campus Placement Onboarding Workstation */}
      <section className="space-y-4">
        <FirstJobWorkstation experience={track} onUpdateExperience={updateExperience} />
      </section>

      {/* 4. Universal Central Milestone Engine (Preset & Custom Milestones) */}
      <MilestoneManager
        milestones={track.milestones}
        trackId="first-job"
        themeColor="#ef4444"
        onUpdateMilestones={handleUpdateMilestones}
      />

      {/* 5. Daily Placement Habits & HR Question Prep */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Habits */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Flame" className="w-4 h-4 text-amber-500" />
              <span>Daily High-Leverage Placement Habits</span>
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
                      className={`w-4 h-4 ${g.completed ? 'text-red-400' : 'text-zinc-600'}`}
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
              placeholder="Add placement habit..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold text-xs flex items-center gap-1 border border-red-500/30"
            >
              <Icon name="Plus" className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </Card>

        {/* Tactical Interview Preparation Notes */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Edit3" className="w-4 h-4 text-zinc-400" />
              <span>Placement Drive Field Notes & Project Answers</span>
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Auto-saved to LocalStorage</span>
          </div>

          <textarea
            rows={5}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Log campus coding questions, HR answers, faculty feedback..."
            className="w-full p-3.5 rounded-2xl bg-black/60 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono leading-relaxed resize-none"
          />
        </Card>
      </div>

      {/* 6. Dedicated Module Form Modal */}
      <FirstJobModuleForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        experience={track}
        onSave={updateExperience}
        onReset={() => resetExperience('first-job')}
      />
    </div>
  );
};
