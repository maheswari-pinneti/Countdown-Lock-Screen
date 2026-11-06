import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Milestone, ExperienceTrackId } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const MilestonesPage: React.FC = () => {
  const { experiences, updateExperience } = useAppStore();
  const [selectedTrack, setSelectedTrack] = useState<ExperienceTrackId | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [targetTrack, setTargetTrack] = useState<ExperienceTrackId>('developer');

  // Collect all milestones from all experiences
  const allMilestones: (Milestone & { trackName: string; trackBadge: string; trackColor: string })[] = [];

  experiences.forEach((exp) => {
    exp.milestones.forEach((m) => {
      allMilestones.push({
        ...m,
        trackName: exp.name,
        trackBadge: exp.badge,
        trackColor: exp.theme.primary,
      });
    });
  });

  const filtered = allMilestones.filter((m) => {
    if (selectedTrack !== 'all' && m.trackId !== selectedTrack) return false;
    if (filterStatus === 'completed' && !m.completed) return false;
    if (filterStatus === 'pending' && m.completed) return false;
    return true;
  });

  const completedCount = allMilestones.filter((m) => m.completed).length;
  const totalCount = allMilestones.length;

  const handleToggle = (trackId: ExperienceTrackId, milestoneId: string) => {
    soundEngine.playKeyClick();
    const track = experiences.find((e) => e.id === trackId);
    if (!track) return;

    const updatedMilestones = track.milestones.map((m) => {
      if (m.id !== milestoneId) return m;
      const next = !m.completed;
      if (next) soundEngine.playSuccessChime();
      return { ...m, completed: next };
    });

    updateExperience({
      ...track,
      milestones: updatedMilestones,
    });
  };

  const handleDelete = (trackId: ExperienceTrackId, milestoneId: string) => {
    soundEngine.playKeyClick();
    const track = experiences.find((e) => e.id === trackId);
    if (!track) return;

    updateExperience({
      ...track,
      milestones: track.milestones.filter((m) => m.id !== milestoneId),
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundEngine.playKeyClick();

    const track = experiences.find((e) => e.id === targetTrack);
    if (!track) return;

    const newM: Milestone = {
      id: `m-${Date.now()}`,
      trackId: targetTrack,
      title: newTitle.trim(),
      deadline: newDate || new Date().toISOString().slice(0, 10),
      completed: false,
      category: 'prep',
    };

    updateExperience({
      ...track,
      milestones: [...track.milestones, newM],
    });

    setNewTitle('');
    setNewDate('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Icon name="CheckCircle2" className="w-7 h-7 text-amber-400" />
            <span>Master Milestones Hub</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Aggregate timeline and roadmap execution across all five active career tracks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <span className="text-zinc-400">Total Completion: </span>
            <span className="text-emerald-400 font-bold">{completedCount} / {totalCount} ({Math.round((completedCount / totalCount) * 100)}%)</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        {/* Track Pills */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTrack === 'all'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Tracks
          </button>
          {experiences.map((exp) => (
            <button
              key={exp.id}
              onClick={() => setSelectedTrack(exp.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTrack === exp.id
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon name={exp.icon} className="w-3 h-3" style={{ color: exp.theme.primary }} />
              <span>{exp.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          {(['all', 'pending', 'completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === s
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Milestones List & Quick Add */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Milestones Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {filtered.length === 0 ? (
            <Card className="text-center py-12">
              <Icon name="CheckCircle2" className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-zinc-300">No milestones match this filter</h4>
              <p className="text-xs text-zinc-500 mt-1">Try selecting "All Tracks" or adjusting status</p>
            </Card>
          ) : (
            filtered.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700/80 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(m.trackId, m.id)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <Icon
                      name={m.completed ? 'CheckCircle2' : 'Circle'}
                      className={`w-5 h-5 ${m.completed ? 'text-emerald-400' : 'text-zinc-600'}`}
                    />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold border"
                        style={{
                          backgroundColor: `${m.trackColor}15`,
                          borderColor: `${m.trackColor}35`,
                          color: m.trackColor,
                        }}
                      >
                        {m.trackBadge}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Due: {m.deadline}</span>
                    </div>
                    <span className={`text-sm font-medium ${m.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                      {m.title}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(m.trackId, m.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400"
                  title="Delete milestone"
                >
                  <Icon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Add Form (4 cols) */}
        <div className="lg:col-span-4">
          <Card>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Plus" className="w-4 h-4 text-emerald-400" />
              <span>Create New Milestone</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Target Track</label>
                <select
                  value={targetTrack}
                  onChange={(e) => setTargetTrack(e.target.value as ExperienceTrackId)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-white"
                >
                  {experiences.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.name} ({exp.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Milestone Description</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master DP, Onsite panel, Sign offer..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-300 font-mono"
                />
              </div>

              <Button size="md" type="submit" iconLeft="Plus" className="w-full">
                Add Milestone
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

