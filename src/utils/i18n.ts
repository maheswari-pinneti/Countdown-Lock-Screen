/**
 * Internationalization, Currency & Timezone Utility for OFFER MODE
 * Handles locale-aware date/time formatting, currencies, and week-start preferences.
 */

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY';
export type WeekStartDay = 'monday' | 'sunday';

export interface LocaleConfig {
  locale: string;
  currency: SupportedCurrency;
  weekStart: WeekStartDay;
  timeFormat: '12h' | '24h';
}

export const DEFAULT_LOCALE_CONFIG: LocaleConfig = {
  locale: 'en-US',
  currency: 'USD',
  weekStart: 'monday',
  timeFormat: '24h',
};

/**
 * Format currency amounts with standard currency symbols and compact formatting
 */
export function formatCurrencyValue(amount: number, currency: SupportedCurrency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
}

/**
 * Formats full dates with day of the week, month, and year
 */
export function formatFullLocalDate(dateString: string, locale: string = 'en-US'): string {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Gets the current system timezone name
 */
export function getUserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}
