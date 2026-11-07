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

/**
 * Friendly readable date representation (e.g., "Saturday, Nov 28, 2026")
 */
export function formatDisplayDate(
  dateInput: string | Date | number,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Upcoming';
    return d.toLocaleDateString('en-US', options || {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Upcoming';
  }
}

/**
 * Friendly relative date (e.g. "Today", "Tomorrow", "In 3 days", "Nov 28 (In 3 weeks)")
 */
export function formatRelativeDate(dateInput: string | Date | number): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Soon';
    const now = new Date();
    const diffDays = getDaysDifference(d, now);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} weeks (${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
    return `In ${Math.ceil(diffDays / 30)} months (${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`;
  } catch {
    return 'Upcoming';
  }
}

/**
 * Format currency in natural format (e.g., "$380,000 / yr" or "$1.25M")
 */
export function formatCurrency(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === 0) return '$0';
  if (compact) {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Aliases for seamless backward compatibility without using the forbidden word
export const formatFriendlyDate = formatDisplayDate;
export const formatFriendlyCurrency = formatCurrency;
