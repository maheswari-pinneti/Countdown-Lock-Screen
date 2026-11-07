import { CountdownEngineResult, DeadlineStatus } from '../types';

/**
 * Common IANA Timezones supported across all modern browsers
 */
export const POPULAR_TIMEZONES = [
  { value: 'Local', label: 'Local Device Timezone' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'US Eastern (New York - EST/EDT)' },
  { value: 'America/Chicago', label: 'US Central (Chicago - CST/CDT)' },
  { value: 'America/Denver', label: 'US Mountain (Denver - MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'US Pacific (San Francisco/LA - PST/PDT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European (Paris/Berlin - CET/CEST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST - UTC+4)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST - UTC+5:30)' },
  { value: 'Asia/Singapore', label: 'Singapore / Hong Kong (SGT/HKT - UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST - UTC+9)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
] as const;

/**
 * Get current system IANA timezone
 */
export function getDefaultTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Resolves a date string, time string, and optional IANA timezone into an exact UTC timestamp.
 * Handles daylight saving transitions and offsets via native Intl API.
 */
export function resolveTargetTimestamp(
  dateStr: string, // YYYY-MM-DD or ISO string
  timeStr: string = '18:00', // HH:mm
  timeZone?: string
): number {
  if (!dateStr) return NaN;

  // If already full ISO string with timezone or time (e.g. 2026-12-15T18:00:00.000Z)
  if (dateStr.includes('T') && dateStr.length >= 16) {
    const directTime = new Date(dateStr).getTime();
    if (!isNaN(directTime) && (!timeZone || timeZone === 'Local')) {
      return directTime;
    }
  }

  // Extract date part (YYYY-MM-DD)
  const dateOnly = dateStr.slice(0, 10);
  const [yearStr, monthStr, dayStr] = dateOnly.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return NaN;
  }

  // Extract hours and minutes
  let [hoursStr, minutesStr] = (timeStr || '18:00').split(':');
  const hours = parseInt(hoursStr, 10) || 0;
  const minutes = parseInt(minutesStr, 10) || 0;

  const effectiveTz = !timeZone || timeZone === 'Local' ? getDefaultTimeZone() : timeZone;

  try {
    // 1. Initial UTC estimate
    const utcEstimate = Date.UTC(year, month - 1, day, hours, minutes, 0);

    // 2. Measure what wall-clock time that estimate yields in the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: effectiveTz,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date(utcEstimate));
    const findPart = (type: string) => {
      const p = parts.find((x) => x.type === type);
      return p ? parseInt(p.value, 10) : 0;
    };

    const tzYear = findPart('year');
    const tzMonth = findPart('month');
    const tzDay = findPart('day');
    let tzHour = findPart('hour');
    if (tzHour === 24) tzHour = 0;
    const tzMinute = findPart('minute');

    // 3. Compute difference between expected wall-clock and actual wall-clock in target timezone
    const tzCurrentWallClock = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, 0);
    const expectedWallClock = Date.UTC(year, month - 1, day, hours, minutes, 0);
    const offsetCorrection = expectedWallClock - tzCurrentWallClock;

    // 4. Exact adjusted UTC timestamp
    return utcEstimate + offsetCorrection;
  } catch {
    // Fallback if IANA timezone is unrecognized
    return new Date(`${dateOnly}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`).getTime();
  }
}

/**
 * Calculates remaining days, hours, minutes, seconds, milliseconds,
 * deadline status, and progress metrics from real dates and milestones.
 */
export function calculateCountdownEngine(
  targetDateInput: string,
  startDateInput?: string,
  timeZoneInput?: string,
  deadlineTimeInput: string = '18:00',
  completedMilestonesCount: number = 0,
  totalMilestonesCount: number = 0
): CountdownEngineResult {
  const timeZone = !timeZoneInput || timeZoneInput === 'Local' ? getDefaultTimeZone() : timeZoneInput;
  const targetTimestamp = resolveTargetTimestamp(targetDateInput, deadlineTimeInput, timeZone);
  const now = Date.now();

  if (isNaN(targetTimestamp)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      totalSeconds: 0,
      totalMilliseconds: 0,
      isExpired: true,
      isToday: false,
      isUrgent: false,
      deadlineStatus: 'invalid',
      statusLabel: 'Invalid Deadline Date',
      formatted: {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        milliseconds: '000',
        compact: '00:00:00',
      },
      timeRemainingText: 'Invalid Date',
      timelineProgressPercentage: 100,
      milestoneProgressPercentage: 0,
      compositeProgressPercentage: 0,
      targetTimestamp: 0,
      targetDateFormatted: 'Invalid Date',
      timeZone,
    };
  }

  const diff = targetTimestamp - now;
  const isExpired = diff <= 0;

  // Determine if deadline is calendar "today" in target timezone
  let isToday = false;
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const todayStrInTz = formatter.format(new Date(now));
    const targetStrInTz = formatter.format(new Date(targetTimestamp));
    isToday = todayStrInTz === targetStrInTz;
  } catch {
    isToday = Math.abs(diff) < 24 * 3600 * 1000;
  }

  const isUrgent = diff > 0 && diff <= 48 * 3600 * 1000;

  let deadlineStatus: DeadlineStatus = 'future';
  let statusLabel = 'Active Countdown';

  if (isExpired) {
    deadlineStatus = 'expired';
    statusLabel = 'Deadline Reached';
  } else if (isToday) {
    deadlineStatus = 'today';
    statusLabel = 'Deadline is Today!';
  } else if (isUrgent) {
    deadlineStatus = 'urgent';
    statusLabel = 'Urgent (< 48 hrs)';
  }

  // Remaining time units
  const totalSeconds = isExpired ? 0 : Math.floor(diff / 1000);
  const days = isExpired ? 0 : Math.floor(totalSeconds / 86400);
  const hours = isExpired ? 0 : Math.floor((totalSeconds % 86400) / 3600);
  const minutes = isExpired ? 0 : Math.floor((totalSeconds % 3600) / 60);
  const seconds = isExpired ? 0 : totalSeconds % 60;
  const milliseconds = isExpired ? 0 : Math.floor(diff % 1000);

  // Timeline progress percentage (0 - 100)
  const startTimestamp = startDateInput
    ? resolveTargetTimestamp(startDateInput, '00:00', timeZone)
    : targetTimestamp - 90 * 86400 * 1000; // default 90-day window

  const totalDuration = Math.max(1000, targetTimestamp - startTimestamp);
  const elapsed = Math.max(0, now - startTimestamp);
  const timelineProgressPercentage = isExpired
    ? 100
    : Number(Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)).toFixed(1));

  // Milestone completion percentage (0 - 100)
  const milestoneProgressPercentage =
    totalMilestonesCount > 0
      ? Number(Math.min(100, (completedMilestonesCount / totalMilestonesCount) * 100).toFixed(1))
      : 0;

  // Composite progress (balanced 50% timeline + 50% milestone execution)
  const compositeProgressPercentage =
    totalMilestonesCount > 0
      ? Number((milestoneProgressPercentage * 0.6 + timelineProgressPercentage * 0.4).toFixed(1))
      : timelineProgressPercentage;

  // Formatted date string
  let targetDateFormatted = '';
  try {
    targetDateFormatted = new Intl.DateTimeFormat('en-US', {
      timeZone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(targetTimestamp));
  } catch {
    targetDateFormatted = new Date(targetTimestamp).toLocaleDateString();
  }

  const formatted = {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    milliseconds: String(milliseconds).padStart(3, '0'),
    compact: `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`,
  };

  const timeRemainingText = isExpired
    ? 'Deadline Reached'
    : days > 0
    ? `${days} days, ${hours} hours remaining`
    : hours > 0
    ? `${hours} hours, ${minutes} minutes remaining`
    : `${minutes} minutes, ${seconds} seconds remaining`;

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    totalSeconds,
    totalMilliseconds: Math.max(0, diff),
    isExpired,
    isToday,
    isUrgent,
    deadlineStatus,
    statusLabel,
    formatted,
    timeRemainingText,
    timelineProgressPercentage,
    milestoneProgressPercentage,
    compositeProgressPercentage,
    targetTimestamp,
    targetDateFormatted,
    timeZone,
  };
}

