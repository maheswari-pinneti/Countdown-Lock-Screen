import { CareerExperience, Milestone } from '../types';

/**
 * Format a JavaScript Date or ISO string into an iCalendar date string (YYYYMMDDTHHmmssZ)
 */
function formatDateToIcs(dateInput: string | Date): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Format date for all-day events (YYYYMMDD)
 */
function formatDateToIcsDay(dateInput: string | Date): string {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Escape text for iCalendar RFC 5545 format
 */
function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export interface CalendarEventPayload {
  title: string;
  description: string;
  startDate: string | Date;
  endDate?: string | Date;
  location?: string;
}

/**
 * Generate a standalone .ics string for a single milestone or interview deadline
 */
export function generateIcsForMilestone(milestone: Milestone, trackName: string): string {
  const dtStamp = formatDateToIcs(new Date());
  const dtStart = formatDateToIcsDay(milestone.deadline);
  const uid = `milestone-${milestone.id}@offermode.dev`;
  const summary = escapeIcsText(`[Offer Mode] ${milestone.title}`);
  const description = escapeIcsText(
    `Career Track: ${trackName}\\nPriority: ${milestone.priority}\\nCategory: ${milestone.category}\\nNotes: ${
      milestone.notes || 'None'
    }`
  );

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Offer Mode//Career Workstation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Generate a bundled .ics calendar file containing the target offer date and all upcoming milestones for a career track
 */
export function generateIcsForCareerTrack(experience: CareerExperience): string {
  const dtStamp = formatDateToIcs(new Date());
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Offer Mode//Career Workstation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Offer Mode - ${escapeIcsText(experience.name)}`,
  ];

  // 1. Target Offer Deadline Event
  const targetDay = formatDateToIcsDay(experience.targetOfferDate);
  lines.push(
    'BEGIN:VEVENT',
    `UID:target-offer-${experience.id}@offermode.dev`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${targetDay}`,
    `SUMMARY:${escapeIcsText(`🎯 [TARGET OFFER] ${experience.targetRole} @ ${experience.targetCompany}`)}`,
    `DESCRIPTION:${escapeIcsText(
      `Goal: ${experience.targetRole} at ${experience.targetCompany}\\nTarget Total Comp: $${experience.compensation?.targetTotalComp?.toLocaleString()}\\nOffer Mode Focus Workstation`
    )}`,
    'STATUS:CONFIRMED',
    'END:VEVENT'
  );

  // 2. Add each incomplete milestone as a calendar event
  experience.milestones.forEach((m) => {
    const mDay = formatDateToIcsDay(m.deadline);
    lines.push(
      'BEGIN:VEVENT',
      `UID:milestone-${m.id}@offermode.dev`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART;VALUE=DATE:${mDay}`,
      `SUMMARY:${escapeIcsText(`[Milestone] ${m.title}`)}`,
      `DESCRIPTION:${escapeIcsText(
        `Track: ${experience.name}\\nStatus: ${m.completed ? 'Completed' : 'Pending'}\\nPriority: ${m.priority}`
      )}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Browser helper to trigger instant .ics download
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to generate 1-click Google Calendar web creation URL
 */
export function getGoogleCalendarUrl(title: string, date: string, details?: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[Offer Mode] ${title}`,
    dates: `${dateStr}/${dateStr}`,
    details: details || 'Scheduled via Offer Mode Career Platform',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
