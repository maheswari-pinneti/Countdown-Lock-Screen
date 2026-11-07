import { useState, useMemo, useCallback } from 'react';
import {
  Milestone,
  MilestonePriority,
  MilestoneCategory,
  ExperienceTrackId,
} from '../types';
import { soundEngine } from '../services/soundEngine';

export interface AddMilestoneInput {
  title: string;
  description?: string;
  dueDate: string;
  priority?: MilestonePriority;
  category?: MilestoneCategory;
}

export interface EditMilestoneInput {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: MilestonePriority;
  category?: MilestoneCategory;
}

export type MilestoneSortField = 'dueDate' | 'priority' | 'title' | 'status';
export type MilestoneSortDirection = 'asc' | 'desc';
export type MilestoneStatusFilter = 'all' | 'pending' | 'completed';

export interface MilestoneEngineFeedback {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UseMilestoneEngineOptions {
  milestones: Milestone[];
  trackId: ExperienceTrackId;
  onUpdateMilestones: (updated: Milestone[]) => void;
}

const PRIORITY_WEIGHTS: Record<MilestonePriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Universal Milestone Engine Hook.
 * Encapsulates adding, editing, deleting, completing, undoing, sorting,
 * filtering, and exact completion metric calculations for all career tracks.
 */
export function useMilestoneEngine({
  milestones = [],
  trackId,
  onUpdateMilestones,
}: UseMilestoneEngineOptions) {
  const [filterStatus, setFilterStatus] = useState<MilestoneStatusFilter>('all');
  const [filterPriority, setFilterPriority] = useState<MilestonePriority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<MilestoneCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<MilestoneSortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<MilestoneSortDirection>('asc');
  const [feedback, setFeedback] = useState<MilestoneEngineFeedback | null>(null);

  // Clear feedback after 4 seconds
  const triggerFeedback = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4000);
  }, []);

  // Operation: Add Milestone
  const addMilestone = useCallback(
    (input: AddMilestoneInput): { success: boolean; message: string } => {
      const cleanTitle = (input.title || '').trim();
      if (!cleanTitle || cleanTitle.length < 2) {
        const errorMsg = 'Milestone title must be at least 2 characters long.';
        triggerFeedback('error', errorMsg);
        return { success: false, message: errorMsg };
      }

      const cleanDueDate = (input.dueDate || '').trim();
      if (!cleanDueDate || isNaN(new Date(cleanDueDate).getTime())) {
        const errorMsg = 'Please provide a valid milestone due date.';
        triggerFeedback('error', errorMsg);
        return { success: false, message: errorMsg };
      }

      const newMilestone: Milestone = {
        id: `ms-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        trackId,
        title: cleanTitle,
        description: (input.description || '').trim(),
        deadline: cleanDueDate,
        dueDate: cleanDueDate,
        completed: false,
        priority: input.priority || 'medium',
        category: input.category || 'prep',
      };

      const nextList = [...milestones, newMilestone];
      onUpdateMilestones(nextList);
      soundEngine.playSuccessChime();
      const successMsg = `Milestone "${cleanTitle}" added successfully.`;
      triggerFeedback('success', successMsg);
      return { success: true, message: successMsg };
    },
    [milestones, onUpdateMilestones, trackId, triggerFeedback]
  );

  // Operation: Edit Milestone
  const editMilestone = useCallback(
    (id: string, updates: EditMilestoneInput): { success: boolean; message: string } => {
      const target = milestones.find((m) => m.id === id);
      if (!target) {
        const errorMsg = 'Target milestone could not be found.';
        triggerFeedback('error', errorMsg);
        return { success: false, message: errorMsg };
      }

      if (updates.title !== undefined) {
        const cleanTitle = updates.title.trim();
        if (cleanTitle.length < 2) {
          const errorMsg = 'Milestone title cannot be empty.';
          triggerFeedback('error', errorMsg);
          return { success: false, message: errorMsg };
        }
      }

      if (updates.dueDate !== undefined) {
        if (isNaN(new Date(updates.dueDate).getTime())) {
          const errorMsg = 'Invalid due date format.';
          triggerFeedback('error', errorMsg);
          return { success: false, message: errorMsg };
        }
      }

      const updatedList = milestones.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          ...updates,
          title: updates.title !== undefined ? updates.title.trim() : m.title,
          description: updates.description !== undefined ? updates.description.trim() : m.description,
          dueDate: updates.dueDate || m.dueDate || m.deadline,
          deadline: updates.dueDate || m.deadline,
        };
      });

      onUpdateMilestones(updatedList);
      soundEngine.playKeyClick();
      const successMsg = 'Milestone updated successfully.';
      triggerFeedback('success', successMsg);
      return { success: true, message: successMsg };
    },
    [milestones, onUpdateMilestones, triggerFeedback]
  );

  // Operation: Delete Milestone
  const deleteMilestone = useCallback(
    (id: string): { success: boolean; message: string } => {
      const target = milestones.find((m) => m.id === id);
      if (!target) {
        return { success: false, message: 'Milestone not found' };
      }

      const updatedList = milestones.filter((m) => m.id !== id);
      onUpdateMilestones(updatedList);
      soundEngine.playKeyClick();
      const successMsg = `Milestone "${target.title}" deleted.`;
      triggerFeedback('info', successMsg);
      return { success: true, message: successMsg };
    },
    [milestones, onUpdateMilestones, triggerFeedback]
  );

  // Operation: Mark Complete
  const markComplete = useCallback(
    (id: string) => {
      const updatedList = milestones.map((m) => {
        if (m.id !== id) return m;
        return { ...m, completed: true };
      });
      onUpdateMilestones(updatedList);
      soundEngine.playSuccessChime();
      triggerFeedback('success', 'Milestone completed! Keep pushing forward.');
    },
    [milestones, onUpdateMilestones, triggerFeedback]
  );

  // Operation: Undo Complete
  const undoComplete = useCallback(
    (id: string) => {
      const updatedList = milestones.map((m) => {
        if (m.id !== id) return m;
        return { ...m, completed: false };
      });
      onUpdateMilestones(updatedList);
      soundEngine.playTick();
      triggerFeedback('info', 'Milestone marked as pending.');
    },
    [milestones, onUpdateMilestones, triggerFeedback]
  );

  // Operation: Toggle Complete
  const toggleComplete = useCallback(
    (id: string) => {
      const target = milestones.find((m) => m.id === id);
      if (!target) return;
      if (target.completed) {
        undoComplete(id);
      } else {
        markComplete(id);
      }
    },
    [milestones, markComplete, undoComplete]
  );

  // Statistics
  const totalCount = milestones.length;
  const completedCount = milestones.filter((m) => m.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionPercentage =
    totalCount > 0 ? Number(((completedCount / totalCount) * 100).toFixed(1)) : 0;

  // Filtered & Sorted Milestones
  const filteredMilestones = useMemo(() => {
    let result = [...milestones];

    // Status filter
    if (filterStatus === 'completed') {
      result = result.filter((m) => m.completed);
    } else if (filterStatus === 'pending') {
      result = result.filter((m) => !m.completed);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      result = result.filter((m) => (m.priority || 'medium') === filterPriority);
    }

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter((m) => (m.category || 'prep') === filterCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q)) ||
          m.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'dueDate': {
          const dateA = new Date(a.dueDate || a.deadline || '').getTime() || 0;
          const dateB = new Date(b.dueDate || b.deadline || '').getTime() || 0;
          comparison = dateA - dateB;
          break;
        }
        case 'priority': {
          const pA = PRIORITY_WEIGHTS[a.priority || 'medium'] || 2;
          const pB = PRIORITY_WEIGHTS[b.priority || 'medium'] || 2;
          comparison = pB - pA; // highest priority first by default
          break;
        }
        case 'title': {
          comparison = a.title.localeCompare(b.title);
          break;
        }
        case 'status': {
          comparison = (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
          break;
        }
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [milestones, filterStatus, filterPriority, filterCategory, searchQuery, sortBy, sortDirection]);

  return {
    milestones,
    filteredMilestones,
    totalCount,
    completedCount,
    pendingCount,
    completionPercentage,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    feedback,
    addMilestone,
    editMilestone,
    deleteMilestone,
    markComplete,
    undoComplete,
    toggleComplete,
  };
}

