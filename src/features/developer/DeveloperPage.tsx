import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { ModuleHeroHeader } from '../../components/modules/ModuleHeroHeader';
import { ModuleCompletionBanner } from '../../components/modules/ModuleCompletionBanner';
import { DeveloperModuleForm } from '../../components/modules/DeveloperModuleForm';
import { MilestoneManager } from '../../components/common/MilestoneManager';
import { SweTrackDetail } from '../../components/experiences/SweTrackDetail';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { soundEngine } from '../../services/soundEngine';
import { Milestone, DailyGoal } from '../../types';

export const DeveloperPage: React.FC = () => {
  const { experiences, updateExperience, resetExperience, openLockScreen } = useAppStore();
  const track = experiences.find((e) => e.id === 'developer') || experiences[2];

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
      trackId: 'developer',
      text: newGoalText.trim(),
      completed: false,
      category: 'Deep Work',
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
        moduleName="Developer Skill Upgrade"
        isCompleted={completionPercentage >= 100}
        isExpired={isExpired}
        completionPercentage={completionPercentage}
        completedMilestonesCount={completedCount}
        totalMilestonesCount={totalCount}
        onReset={() => resetExperience('developer')}
        onLaunchLockScreen={() => openLockScreen('developer')}
        themeColor="#22c55e"
      />

      {/* 2. Dedicated Hero Header with Live Precision Countdown */}
      <ModuleHeroHeader
        experience={track}
        onOpenEditForm={() => setIsEditModalOpen(true)}
        onResetModule={() => resetExperience('developer')}
        onLaunchLockScreen={() => openLockScreen('developer')}
        statsSnippet={
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              Level: <strong className="text-emerald-400">{track.currentSkillLevel || 'Intermediate'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              Tech: <strong className="text-cyan-400">{track.selectedTechnology || 'TypeScript'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              Daily Study: <strong className="text-amber-400">{track.dailyStudyDuration || '2.5 hrs'}</strong>
            </span>
          </div>
        }
      />

      {/* 3. Specialized Algorithmic & Distributed Systems Workstation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Icon name="Cpu" className="w-4 h-4 text-emerald-400" />
            <span>Algorithmic & Distributed Systems Workstation</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">Real-time mastery index</span>
        </div>
        <SweTrackDetail experience={track} onUpdateExperience={updateExperience} />
      </section>

      {/* 4. Universal Central Milestone Engine (Preset & Custom Milestones) */}
      <MilestoneManager
        milestones={track.milestones}
        trackId="developer"
        themeColor="#22c55e"
        onUpdateMilestones={handleUpdateMilestones}
      />

      {/* 5. Daily Habits & Architectural Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Habits */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Flame" className="w-4 h-4 text-amber-500" />
              <span>Daily High-Leverage Coding Habits</span>
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
                      className={`w-4 h-4 ${g.completed ? 'text-emerald-400' : 'text-zinc-600'}`}
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
              placeholder="Add study habit..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center gap-1 border border-emerald-500/30"
            >
              <Icon name="Plus" className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </Card>

        {/* Architecture Notes */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Edit3" className="w-4 h-4 text-zinc-400" />
              <span>Architectural Decision Logs & DSA Pattern Notes</span>
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Auto-saved to LocalStorage</span>
          </div>

          <textarea
            rows={5}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Record trade-offs, algorithmic templates, latency numbers, architecture diagrams..."
            className="w-full p-3.5 rounded-2xl bg-black/60 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed resize-none"
          />
        </Card>
      </div>

      {/* 6. Dedicated Module Form Modal */}
      <DeveloperModuleForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        experience={track}
        onSave={updateExperience}
        onReset={() => resetExperience('developer')}
      />
    </div>
  );
};
