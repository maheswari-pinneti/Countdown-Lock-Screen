/**
 * Reusable Date formatting and manipulation utilities
 */

export function formatDate(
  dateInput: string | Date | number,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toLocaleDateString(undefined, options || {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
}

export function formatTime(
  dateInput: string | Date | number,
  format: '12h' | '24h' = '24h'
): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '--:--';
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: format === '12h',
    });
  } catch {
    return '--:--';
  }
}

export function getDaysDifference(
  targetDateInput: string | Date,
  fromDateInput: string | Date = new Date()
): number {
  const target = new Date(targetDateInput).getTime();
  const from = new Date(fromDateInput).getTime();
  const diffMs = target - from;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function toIsoDatetimeLocal(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

