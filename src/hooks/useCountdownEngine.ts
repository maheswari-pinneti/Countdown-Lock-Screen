import { useState, useEffect, useMemo } from 'react';
import { CountdownEngineResult } from '../types';
import { calculateCountdownEngine } from '../utils/countdownEngine';

interface CountdownEngineOptions {
  targetDate: string;
  startDate?: string;
  deadlineTime?: string;
  timeZone?: string;
  completedMilestones?: number;
  totalMilestones?: number;
  tickIntervalMs?: number;
}

/**
 * Universal real-time Countdown Engine Hook.
 * Powering all 5 career experiences and custom countdown configurations.
 * Handles exact timestamps, timezone offsets, daylight savings, progress ratios, and deadline states.
 */
export function useCountdownEngine({
  targetDate,
  startDate,
  deadlineTime = '18:00',
  timeZone,
  completedMilestones = 0,
  totalMilestones = 0,
  tickIntervalMs = 500,
}: CountdownEngineOptions): CountdownEngineResult {
  // Store tick count to force re-render on intervals
  const [, setTick] = useState<number>(0);

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % 1000000);
    }, Math.max(100, tickIntervalMs));

    return () => clearInterval(timer);
  }, [targetDate, tickIntervalMs]);

  // Compute countdown metrics with current real-time timestamp
  const result = useMemo(() => {
    return calculateCountdownEngine(
      targetDate,
      startDate,
      timeZone,
      deadlineTime,
      completedMilestones,
      totalMilestones
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    targetDate,
    startDate,
    timeZone,
    deadlineTime,
    completedMilestones,
    totalMilestones,
    Date.now(), // evaluated on re-renders triggered by timer
  ]);

  return result;
}

