import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Milestone, ExperienceTrackId, MilestonePriority, MilestoneCategory } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { MilestoneManager } from '../../components/common/MilestoneManager';

const PRIORITY_WEIGHTS: Record<MilestonePriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const MilestonesPage: React.FC = () => {
  const { experiences, updateExperience } = useAppStore();
  const [selectedTrack, setSelectedTrack] = useState<ExperienceTrackId | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<MilestonePriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Add State
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<MilestonePriority>('medium');
  const [newCategory, setNewCategory] = useState<MilestoneCategory>('prep');
  const [targetTrack, setTargetTrack] = useState<ExperienceTrackId>('developer');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If a specific track is selected, render MilestoneManager directly
  const activeSingleTrack = useMemo(() => {
    if (selectedTrack === 'all') return null;
    return experiences.find((e) => e.id === selectedTrack) || null;
  }, [experiences, selectedTrack]);

  // Aggregate all milestones
  const allMilestones: (Milestone & { trackName: string; trackBadge: string; trackColor: string })[] = useMemo(() => {
    const list: (Milestone & { trackName: string; trackBadge: string; trackColor: string })[] = [];
    experiences.forEach((exp) => {
      exp.milestones.forEach((m) => {
        list.push({
          ...m,
          trackName: exp.name,
          trackBadge: exp.badge,
          trackColor: exp.theme.primary,
        });
      });
    });
    return list;
  }, [experiences]);

  const filtered = useMemo(() => {
    let result = allMilestones.filter((m) => {
      if (filterStatus === 'completed' && !m.completed) return false;
      if (filterStatus === 'pending' && m.completed) return false;
      if (filterPriority !== 'all' && (m.priority || 'medium') !== filterPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          m.title.toLowerCase().includes(q) ||
          m.trackName.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
        );
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        const dateA = new Date(a.dueDate || a.deadline || '').getTime() || 0;
        const dateB = new Date(b.dueDate || b.deadline || '').getTime() || 0;
        return dateA - dateB;
      } else if (sortBy === 'priority') {
        return (PRIORITY_WEIGHTS[b.priority || 'medium'] || 2) - (PRIORITY_WEIGHTS[a.priority || 'medium'] || 2);
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [allMilestones, filterStatus, filterPriority, searchQuery, sortBy]);

  const completedCount = allMilestones.filter((m) => m.completed).length;
  const totalCount = allMilestones.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
    if (!newTitle.trim()) {
      setErrorMsg('Milestone title is required.');
      return;
    }
    soundEngine.playKeyClick();

    const track = experiences.find((e) => e.id === targetTrack);
    if (!track) return;

    const targetDate = newDueDate || new Date(Date.now() + 7 * 86400 * 1000).toISOString().slice(0, 10);

    const newM: Milestone = {
      id: `ms-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      trackId: targetTrack,
      title: newTitle.trim(),
      description: '',
      deadline: targetDate,
      dueDate: targetDate,
      completed: false,
      priority: newPriority,
      category: newCategory,
    };

    updateExperience({
      ...track,
      milestones: [...track.milestones, newM],
    });

    soundEngine.playSuccessChime();
    setNewTitle('');
    setNewDueDate('');
    setErrorMsg(null);
  };

  const renderPriorityBadge = (priority: MilestonePriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-red-500/40 bg-red-950/60 text-red-400">
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-amber-500/40 bg-amber-950/60 text-amber-400">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-cyan-500/40 bg-cyan-950/60 text-cyan-400">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-zinc-700 bg-zinc-800 text-zinc-400">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Icon name="Target" className="w-7 h-7 text-cyan-400" />
            <span>Central Milestone & Execution Engine</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Universal milestone management across all 5 career experiences with priority and deadline validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <span className="text-zinc-400">Total Progress: </span>
            <span className="text-cyan-400 font-bold">
              {completedCount} / {totalCount} ({completionPercentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Track Switcher Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <button
          onClick={() => {
            soundEngine.playKeyClick();
            setSelectedTrack('all');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedTrack === 'all'
              ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          All Tracks Aggregate
        </button>
        {experiences.map((exp) => (
          <button
            key={exp.id}
            onClick={() => {
              soundEngine.playKeyClick();
              setSelectedTrack(exp.id);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedTrack === exp.id
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon name={exp.icon} className="w-3.5 h-3.5" style={{ color: exp.theme.primary }} />
            <span>{exp.name.split(' ')[0]}</span>
            <span className="text-[10px] text-zinc-500 font-mono">({exp.milestones.length})</span>
          </button>
        ))}
      </div>

      {/* If specific track selected, show its specialized MilestoneManager */}
      {activeSingleTrack ? (
        <MilestoneManager
          milestones={activeSingleTrack.milestones}
          trackId={activeSingleTrack.id}
          themeColor={activeSingleTrack.theme.primary}
          onUpdateMilestones={(updated) => {
            updateExperience({
              ...activeSingleTrack,
              milestones: updated,
            });
          }}
        />
      ) : (
        /* Aggregate View Across All Tracks */
        <div className="space-y-6">
          {/* Filter & Controls Bar */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative min-w-[220px] flex-1 max-w-xs">
              <Icon name="Search" className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all milestones..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              {(['all', 'pending', 'completed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    soundEngine.playKeyClick();
                    setFilterStatus(s);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                    filterStatus === s
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-500">Priority:</span>
              <select
                value={filterPriority}
                onChange={(e) => {
                  soundEngine.playKeyClick();
                  setFilterPriority(e.target.value as any);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  soundEngine.playKeyClick();
                  setSortBy(e.target.value as any);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Milestones List + Quick Add Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List */}
            <div className="lg:col-span-8 space-y-3">
              {filtered.length === 0 ? (
                <Card className="text-center py-12">
                  <Icon name="CheckCircle2" className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-zinc-300">No milestones match your criteria</h4>
                  <p className="text-xs text-zinc-500 mt-1">Try resetting search or adjusting priority/status filters</p>
                </Card>
              ) : (
                filtered.map((m) => (
                  <div
                    key={`${m.trackId}-${m.id}`}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      m.completed
                        ? 'bg-zinc-950/40 border-zinc-800/60 opacity-75'
                        : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggle(m.trackId, m.id)}
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                          m.completed
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-zinc-700 bg-zinc-950 hover:border-cyan-400'
                        }`}
                      >
                        {m.completed && <Icon name="Check" className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
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
                          {renderPriorityBadge(m.priority || 'medium')}
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Due: {m.dueDate || m.deadline}
                          </span>
                        </div>
                        <p
                          className={`text-sm font-semibold truncate ${
                            m.completed ? 'line-through text-zinc-500' : 'text-zinc-100'
                          }`}
                        >
                          {m.title}
                        </p>
                        {m.description && (
                          <p className="text-xs text-zinc-400 truncate">{m.description}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(m.trackId, m.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Delete milestone"
                    >
                      <Icon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Form */}
            <div className="lg:col-span-4">
              <Card>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Icon name="Plus" className="w-4 h-4 text-cyan-400" />
                  <span>Quick Add Milestone</span>
                </h3>

                {errorMsg && (
                  <div className="mb-3 p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                    {errorMsg}
                  </div>
                )}

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
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Milestone Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Master DP, Onsite panel, Sign offer..."
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-white placeholder-zinc-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1">Priority</label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as MilestonePriority)}
                        className="w-full px-2.5 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-white"
                      >
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as MilestoneCategory)}
                        className="w-full px-2.5 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-white"
                      >
                        <option value="prep">Prep</option>
                        <option value="interview">Interview</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="decision">Decision</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Target Due Date</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
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
      )}
    </div>
  );
};
