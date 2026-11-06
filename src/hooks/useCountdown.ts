import { useState, useEffect } from 'react';
import { CountdownResult } from '../types';
import { calculateCountdown } from '../utils/countdown';

export function useCountdown(targetIsoDate: string, startDateIso?: string): CountdownResult {
  const [time, setTime] = useState<CountdownResult>(() =>
    calculateCountdown(targetIsoDate, startDateIso)
  );

  useEffect(() => {
    // 50ms interval for fluid millisecond updates without draining the CPU
    const interval = setInterval(() => {
      setTime(calculateCountdown(targetIsoDate, startDateIso));
    }, 50);

    return () => clearInterval(interval);
  }, [targetIsoDate, startDateIso]);

  return time;
}
