import React, { useState } from 'react';
import {
  Milestone,
  MilestonePriority,
  MilestoneCategory,
  ExperienceTrackId,
} from '../../types';
import {
  useMilestoneEngine,
  MilestoneSortField,
  MilestoneStatusFilter,
} from '../../hooks/useMilestoneEngine';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from './Icon';
import { Button } from './Button';
import { Badge } from './Badge';
import { generateIcsForMilestone, downloadIcsFile, getGoogleCalendarUrl } from '../../utils/calendarSync';

interface Props {
  milestones: Milestone[];
  trackId: ExperienceTrackId;
  themeColor?: string;
  onUpdateMilestones: (updated: Milestone[]) => void;
}

const CATEGORY_LABELS: Record<MilestoneCategory, string> = {
  prep: 'Preparation & Study',
  interview: 'Interview Loop',
  portfolio: 'Portfolio / GitHub',
  application: 'Applications & Referral',
  negotiation: 'Compensation & Offer',
  decision: 'Final Execution',
};

export const MilestoneManager: React.FC<Props> = ({
  milestones,
  trackId,
  themeColor = '#06b6d4',
  onUpdateMilestones,
}) => {
  const engine = useMilestoneEngine({
    milestones,
    trackId,
    onUpdateMilestones,
  });

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formPriority, setFormPriority] = useState<MilestonePriority>('medium');
  const [formCategory, setFormCategory] = useState<MilestoneCategory>('prep');
  const [formError, setFormError] = useState<string | null>(null);

  // Open modal in Add mode
  const openAddModal = () => {
    soundEngine.playKeyClick();
    setEditingMilestoneId(null);
    setFormTitle('');
    setFormDescription('');
    setFormDueDate(new Date(Date.now() + 7 * 86400 * 1000).toISOString().slice(0, 10)); // default 1 week out
    setFormPriority('medium');
    setFormCategory('prep');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (m: Milestone) => {
    soundEngine.playKeyClick();
    setEditingMilestoneId(m.id);
    setFormTitle(m.title);
    setFormDescription(m.description || '');
    setFormDueDate(m.dueDate || m.deadline ? (m.dueDate || m.deadline).slice(0, 10) : '');
    setFormPriority(m.priority || 'medium');
    setFormCategory(m.category || 'prep');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (editingMilestoneId) {
      // Edit
      const result = engine.editMilestone(editingMilestoneId, {
        title: formTitle,
        description: formDescription,
        dueDate: formDueDate,
        priority: formPriority,
        category: formCategory,
      });

      if (!result.success) {
        setFormError(result.message);
        return;
      }
    } else {
      // Add
      const result = engine.addMilestone({
        title: formTitle,
        description: formDescription,
        dueDate: formDueDate,
        priority: formPriority,
        category: formCategory,
      });

      if (!result.success) {
        setFormError(result.message);
        return;
      }
    }

    setIsModalOpen(false);
  };

  // Relative due date label helper
  const getDueBadgeInfo = (dueDateStr?: string) => {
    if (!dueDateStr) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dueDateStr);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - now.getTime()) / (86400 * 1000));

    if (diffDays < 0) {
      return {
        label: `${Math.abs(diffDays)}d overdue`,
        variant: 'red' as const,
      };
    } else if (diffDays === 0) {
      return {
        label: 'Due Today',
        variant: 'amber' as const,
      };
    } else if (diffDays === 1) {
      return {
        label: 'Due Tomorrow',
        variant: 'amber' as const,
      };
    } else {
      return {
        label: `In ${diffDays} days`,
        variant: 'zinc' as const,
      };
    }
  };

  // Priority badge styling
  const renderPriorityBadge = (priority: MilestonePriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-red-500/40 bg-red-950/60 text-red-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
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
      case 'low':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-zinc-700 bg-zinc-800 text-zinc-400">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Progress Overview Card */}
      <div className="p-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Target" className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">Milestone Execution Engine</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Track key career objectives with due dates, priority tiers, and completion metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="primary" iconLeft="Plus" onClick={openAddModal}>
              Add Milestone
            </Button>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">
              Execution Progress: <strong className="text-white">{engine.completedCount}</strong> of{' '}
              <strong className="text-white">{engine.totalCount}</strong> completed
            </span>
            <span className="font-bold text-cyan-400">{engine.completionPercentage}%</span>
          </div>

          <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500 to-emerald-400"
              style={{ width: `${engine.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Engine Feedback Message */}
        {engine.feedback && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
              engine.feedback.type === 'error'
                ? 'bg-red-950/60 border border-red-500/50 text-red-200'
                : engine.feedback.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
                : 'bg-zinc-800/80 border border-zinc-700 text-zinc-200'
            }`}
          >
            <Icon
              name={
                engine.feedback.type === 'error'
                  ? 'AlertCircle'
                  : engine.feedback.type === 'success'
                  ? 'CheckCircle2'
                  : 'Info'
              }
              className="w-4 h-4 shrink-0"
            />
            <span>{engine.feedback.message}</span>
          </div>
        )}
      </div>

      {/* 2. Search, Filters & Sorting Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Icon name="Search" className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={engine.searchQuery}
            onChange={(e) => engine.setSearchQuery(e.target.value)}
            placeholder="Search milestones..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          {(['all', 'pending', 'completed'] as MilestoneStatusFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundEngine.playKeyClick();
                engine.setFilterStatus(tab);
              }}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                engine.filterStatus === tab
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}{' '}
              <span className="text-[10px] opacity-60 ml-0.5">
                (
                {tab === 'all'
                  ? engine.totalCount
                  : tab === 'pending'
                  ? engine.pendingCount
                  : engine.completedCount}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-500">Priority:</span>
          <select
            value={engine.filterPriority}
            onChange={(e) => {
              soundEngine.playKeyClick();
              engine.setFilterPriority(e.target.value as any);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Priorities</option>
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
            value={engine.sortBy}
            onChange={(e) => {
              soundEngine.playKeyClick();
              engine.setSortBy(e.target.value as MilestoneSortField);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title (A-Z)</option>
            <option value="status">Status</option>
          </select>

          <button
            onClick={() => {
              soundEngine.playKeyClick();
              engine.setSortDirection(engine.sortDirection === 'asc' ? 'desc' : 'asc');
            }}
            className="p-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title={`Direction: ${engine.sortDirection}`}
          >
            <Icon
              name={engine.sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'}
              className="w-3.5 h-3.5"
            />
          </button>
        </div>
      </div>

      {/* 3. Milestone List */}
      <div className="space-y-3">
        {engine.filteredMilestones.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <Icon name="CheckSquare" className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-zinc-300">No milestones found</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              {engine.searchQuery || engine.filterStatus !== 'all' || engine.filterPriority !== 'all'
                ? 'Try adjusting your search terms or filters.'
                : 'Get started by creating your first milestone to guide your sprint.'}
            </p>
            <div className="mt-4">
              <Button size="sm" variant="primary" iconLeft="Plus" onClick={openAddModal}>
                Create Milestone
              </Button>
            </div>
          </div>
        ) : (
          engine.filteredMilestones.map((m) => {
            const dueBadge = getDueBadgeInfo(m.dueDate || m.deadline);
            return (
              <div
                key={m.id}
                className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  m.completed
                    ? 'bg-zinc-950/40 border-zinc-800/60 opacity-75'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 shadow-sm'
                }`}
              >
                {/* Left: Checkbox + Title + Meta */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => engine.toggleComplete(m.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      m.completed
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : 'border-zinc-700 bg-zinc-950 hover:border-cyan-400'
                    }`}
                    title={m.completed ? 'Mark as Pending' : 'Mark as Complete'}
                  >
                    {m.completed && <Icon name="Check" className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm md:text-base font-bold tracking-tight transition-all truncate ${
                          m.completed ? 'line-through text-zinc-500' : 'text-zinc-100'
                        }`}
                      >
                        {m.title}
                      </span>

                      {/* Priority Badge */}
                      {renderPriorityBadge(m.priority || 'medium')}

                      {/* Category Badge */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-zinc-800 bg-zinc-950 text-zinc-400">
                        {CATEGORY_LABELS[m.category] || m.category}
                      </span>
                    </div>

                    {/* Description if present */}
                    {m.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed">{m.description}</p>
                    )}

                    {/* Due Date & Relative Badge */}
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <Icon name="Calendar" className="w-3.5 h-3.5" />
                      <span>Due: {m.dueDate || m.deadline}</span>
                      {dueBadge && !m.completed && (
                        <Badge label={dueBadge.label} variant={dueBadge.variant} className="text-[9px]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                  {/* Mark complete / undo button */}
                  {m.completed ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => engine.undoComplete(m.id)}
                      iconLeft="RotateCcw"
                      className="text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      Undo
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => engine.markComplete(m.id)}
                      iconLeft="Check"
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Complete
                    </Button>
                  )}

                  {/* Calendar Sync button */}
                  <button
                    onClick={() => {
                      soundEngine.playKeyClick();
                      const ics = generateIcsForMilestone(m, trackId);
                      downloadIcsFile(`milestone-${m.id}.ics`, ics);
                    }}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 transition-colors"
                    title="Export to iCalendar (.ics)"
                  >
                    <Icon name="Calendar" className="w-4 h-4" />
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => openEditModal(m)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Edit Milestone"
                  >
                    <Icon name="Edit3" className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete milestone "${m.title}"?`)) {
                        engine.deleteMilestone(m.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Delete Milestone"
                  >
                    <Icon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Add / Edit Milestone Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
              <div className="flex items-center gap-2.5">
                <Icon
                  name={editingMilestoneId ? 'Edit3' : 'PlusCircle'}
                  className="w-5 h-5 text-cyan-400"
                />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {editingMilestoneId ? 'Edit Milestone' : 'Add New Milestone'}
                </h3>
              </div>
              <button
                onClick={() => {
                  soundEngine.playKeyClick();
                  setIsModalOpen(false);
                }}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <Icon name="AlertTriangle" className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Milestone Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Master Monotonic Stack & Union Find Patterns"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Description / Success Criteria
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Briefly describe what needs to be delivered..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Due Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as MilestonePriority)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MilestoneCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="prep">Prep & Study</option>
                    <option value="interview">Interview Loop</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="application">Application</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="decision">Decision</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    soundEngine.playKeyClick();
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" iconLeft="Check">
                  {editingMilestoneId ? 'Save Changes' : 'Create Milestone'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
