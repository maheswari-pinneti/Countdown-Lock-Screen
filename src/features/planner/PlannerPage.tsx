import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Briefcase,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PlannerTask, ExperienceTrackId } from '../../types';
import { loadPlannerTasks, savePlannerTasks } from '../../services/lifeStorageService';

export const PlannerPage: React.FC = () => {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newTime, setNewTime] = useState('30m');
  const [newTrack, setNewTrack] = useState<ExperienceTrackId | 'general'>('general');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setTasks(loadPlannerTasks());
  }, []);

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setTasks(updated);
    savePlannerTasks(updated);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      }
      return t;
    });
    setTasks(updated);
    savePlannerTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    savePlannerTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: PlannerTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      dueDate: todayStr,
      timeEstimate: newTime,
      completed: false,
      trackId: newTrack,
      subtasks: [],
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    savePlannerTasks(updated);
    setNewTitle('');
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority === 'all') return true;
    return t.priority === filterPriority;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/40 via-card-bg to-slate-900 border border-blue-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <CalendarCheck className="w-3.5 h-3.5" />
                Execution Engine
              </span>
              <span className="text-xs text-text-muted">High-Leverage Daily MITs</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Smart Daily Planner & Execution Schedule
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Prioritize what moves the needle today. Anchor top-3 Most Important Tasks (MITs),
              track deep work time estimates, and link execution directly to your career tracks.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Today&apos;s Progress</p>
              <p className="text-3xl font-black text-blue-400 mt-1">{progressPercent}%</p>
              <p className="text-[11px] text-text-muted mt-0.5">{completedCount} of {tasks.length} tasks</p>
            </div>
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleAddTask} className="card p-4 border border-white/10 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a high-leverage task for today... (e.g. Complete System Design Mock)"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
          >
            <option value="high">🔴 High Priority (MIT)</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>

          <select
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
          >
            <option value="15m">15m</option>
            <option value="30m">30m</option>
            <option value="45m">45m</option>
            <option value="60m">60m</option>
            <option value="90m">90m</option>
          </select>

          <select
            value={newTrack}
            onChange={(e) => setNewTrack(e.target.value as ExperienceTrackId | 'general')}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
          >
            <option value="general">General</option>
            <option value="interview">Interview Track</option>
            <option value="job-hunt">Job Hunt</option>
            <option value="developer">Developer Upgrade</option>
            <option value="overview">Executive Command</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/30 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['all', 'high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterPriority === p
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-card-bg text-text-muted hover:text-white border border-white/5'
              }`}
            >
              {p === 'all' ? 'All Tasks' : `${p} Priority`}
            </button>
          ))}
        </div>

        <span className="text-xs text-text-muted">
          Showing {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="card p-8 text-center text-text-muted space-y-2">
            <CalendarCheck className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No tasks in this category</p>
            <p className="text-xs">Add your top tasks above to initiate today&apos;s flow.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedTaskIds.includes(task.id);
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSubCount = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

            return (
              <div
                key={task.id}
                className={`card p-4 transition-all duration-200 border ${
                  task.completed
                    ? 'border-emerald-500/20 bg-slate-950/40 opacity-75'
                    : task.priority === 'high'
                    ? 'border-rose-500/30 bg-gradient-to-r from-rose-950/10 to-card-bg'
                    : 'border-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-text-muted hover:text-white transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            task.priority === 'high'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : task.priority === 'medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {task.priority === 'high' ? 'MIT (High)' : task.priority}
                        </span>

                        {task.timeEstimate && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-text-muted font-medium">
                            <Clock className="w-3 h-3" />
                            {task.timeEstimate}
                          </span>
                        )}

                        {task.trackId && task.trackId !== 'general' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-medium">
                            <Briefcase className="w-3 h-3" />
                            {task.trackId}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-sm font-semibold leading-relaxed ${
                          task.completed ? 'line-through text-text-muted' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>

                      {hasSubtasks && (
                        <div className="pt-1">
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-white transition-colors"
                          >
                            <span>
                              {completedSubCount}/{task.subtasks!.length} subtasks
                            </span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Subtasks */}
                {isExpanded && hasSubtasks && (
                  <div className="mt-3 pl-8 pr-2 pt-3 border-t border-white/5 space-y-2">
                    {task.subtasks!.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleToggleSubtask(task.id, sub.id)}
                        className="w-full flex items-center gap-2 text-left group p-1 rounded hover:bg-white/5 transition-colors"
                      >
                        {sub.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                        )}
                        <span
                          className={`text-xs ${
                            sub.completed ? 'line-through text-text-muted' : 'text-slate-300'
                          }`}
                        >
                          {sub.text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlannerPage;
