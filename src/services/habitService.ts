import { HabitItem } from '../types';

/**
 * Anti-Guilt Habit Engine
 * Implements the James Clear "Never Miss Twice" principle and flexible rest days.
 * Instead of demotivating the user with an instant streak reset to 0 after 1 missed day,
 * the system acknowledges life happens, grants a recovery grace period, and motivates
 * resuming momentum immediately.
 */

export interface HabitStreakStatus {
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  missedYesterday: boolean;
  inRecoveryMode: boolean; // Missed yesterday, but can protect streak if completed today
  restDayToday: boolean;
}

const getTodayDateString = (): string => new Date().toISOString().split('T')[0];

const getDayOfWeek = (dateStr: string): number => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).getDay(); // 0 is Sunday, 6 is Saturday
};

const getPreviousDateString = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const isHabitCompletedOnDate = (habit: HabitItem, dateStr: string): boolean => {
  return Array.isArray(habit.completedDates) && habit.completedDates.includes(dateStr);
};

export const isRestDay = (habit: HabitItem, dateStr: string): boolean => {
  if (!habit.restDays || habit.restDays.length === 0) return false;
  const day = getDayOfWeek(dateStr);
  return habit.restDays.includes(day);
};

/**
 * Calculates human-centered streak metrics with anti-guilt grace periods
 */
export const calculateHabitStreak = (
  habit: HabitItem,
  referenceDateStr: string = getTodayDateString()
): HabitStreakStatus => {
  const completedToday = isHabitCompletedOnDate(habit, referenceDateStr);
  const restDayToday = isRestDay(habit, referenceDateStr);

  const yesterdayStr = getPreviousDateString(referenceDateStr);
  const completedYesterday = isHabitCompletedOnDate(habit, yesterdayStr);
  const restDayYesterday = isRestDay(habit, yesterdayStr);

  let inRecoveryMode = false;
  let missedYesterday = false;

  if (!completedYesterday && !restDayYesterday) {
    missedYesterday = true;
    if (!completedToday) {
      inRecoveryMode = true; // "Never miss twice": today is the recovery opportunity
    }
  }

  // Iterate backwards from yesterday (or today if completed) to calculate the actual unbroken chain
  let currentStreak = 0;
  let checkDate = completedToday ? referenceDateStr : yesterdayStr;
  let graceUsed = 0;
  const maxGrace = habit.recoveryGraceDays ?? 1;

  for (let i = 0; i < 365; i++) {
    const isComp = isHabitCompletedOnDate(habit, checkDate);
    const isRest = isRestDay(habit, checkDate);

    if (isComp) {
      currentStreak++;
    } else if (isRest) {
      // Rest days maintain the streak without incrementing it
    } else {
      // Missed active day
      if (graceUsed < maxGrace && i > 0) {
        graceUsed++;
        // Grace day absorbs the miss
      } else {
        // Exceeded grace limit: streak chain breaks
        break;
      }
    }

    checkDate = getPreviousDateString(checkDate);
  }

  const longestStreak = Math.max(habit.longestStreak || 0, currentStreak);

  return {
    currentStreak,
    longestStreak,
    completedToday,
    missedYesterday,
    inRecoveryMode,
    restDayToday,
  };
};

/**
 * Toggles completion status for a given date and updates streak records
 */
export const toggleHabitCompletion = (
  habit: HabitItem,
  dateStr: string = getTodayDateString()
): HabitItem => {
  const isCurrentlyCompleted = isHabitCompletedOnDate(habit, dateStr);
  const newCompletedDates = isCurrentlyCompleted
    ? habit.completedDates.filter((d) => d !== dateStr)
    : [...habit.completedDates, dateStr].sort();

  const tempHabit: HabitItem = {
    ...habit,
    completedDates: newCompletedDates,
  };

  const { currentStreak, longestStreak } = calculateHabitStreak(tempHabit, dateStr);

  return {
    ...tempHabit,
    streakCount: currentStreak,
    longestStreak: Math.max(habit.longestStreak || 0, longestStreak),
  };
};

/**
 * Calculates 30-day consistency score (%)
 */
export const calculateConsistencyRate = (habit: HabitItem): number => {
  const today = new Date();
  let completedCount = 0;
  let expectedDays = 0;

  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    if (!isRestDay(habit, dateStr)) {
      expectedDays++;
      if (isHabitCompletedOnDate(habit, dateStr)) {
        completedCount++;
      }
    }
  }

  if (expectedDays === 0) return 100;
  return Math.round((completedCount / expectedDays) * 100);
};
