import { useState, useEffect } from 'react';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalSeconds: number;
  totalMilliseconds: number;
  isExpired: boolean;
  formatted: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    milliseconds: string;
  };
  progressPercentage: number;
}

export function useCountdown(targetIsoDate: string, startDateIso?: string): CountdownTime {
  const calculate = (): CountdownTime => {
    const target = new Date(targetIsoDate).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        totalSeconds: 0,
        totalMilliseconds: 0,
        isExpired: true,
        formatted: {
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          milliseconds: '000',
        },
        progressPercentage: 100,
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor(diff % 1000);

    // Progress percentage based on an arbitrary 90-day window or provided start date
    const start = startDateIso ? new Date(startDateIso).getTime() : target - (90 * 86400 * 1000);
    const totalDuration = target - start;
    const elapsed = now - start;
    const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      totalSeconds,
      totalMilliseconds: diff,
      isExpired: false,
      formatted: {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        milliseconds: String(milliseconds).padStart(3, '0'),
      },
      progressPercentage,
    };
  };

  const [time, setTime] = useState<CountdownTime>(calculate);

  useEffect(() => {
    // 50ms interval gives smooth millisecond updates without taxing the CPU
    const interval = setInterval(() => {
      setTime(calculate());
    }, 50);

    return () => clearInterval(interval);
  }, [targetIsoDate, startDateIso]);

  return time;
}
