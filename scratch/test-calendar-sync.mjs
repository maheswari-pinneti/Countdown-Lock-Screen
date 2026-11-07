import assert from 'assert';

function formatDateToIcsDay(dateInput) {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function escapeIcsText(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function generateIcsForMilestone(milestone, trackName) {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtStart = formatDateToIcsDay(milestone.deadline);
  const uid = `milestone-${milestone.id}@offermode.dev`;
  const summary = escapeIcsText(`[Offer Mode] ${milestone.title}`);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Offer Mode//Career Workstation//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `SUMMARY:${summary}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function getGoogleCalendarUrl(title, date, details) {
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

console.log('Testing Calendar Integration & .ics Generation...');

// Test 1: Single milestone .ics structure
const sampleMilestone = {
  id: 'm-101',
  title: 'System Design Mock Interview',
  deadline: '2026-11-20',
  priority: 'high',
  category: 'prep'
};

const icsOutput = generateIcsForMilestone(sampleMilestone, 'Developer Upgrade');
assert(icsOutput.includes('BEGIN:VCALENDAR'), 'Missing VCALENDAR begin tag');
assert(icsOutput.includes('END:VCALENDAR'), 'Missing VCALENDAR end tag');
assert(icsOutput.includes('SUMMARY:[Offer Mode] System Design Mock Interview'), 'Summary missing or incorrectly formatted');
assert(icsOutput.includes('DTSTART;VALUE=DATE:20261120'), 'Event date does not match expected RFC 5545 format');
console.log('  ✓ PASS: Single milestone .ics format complies with RFC 5545');

// Test 2: Google Calendar 1-Click URL Generator
const gcalUrl = getGoogleCalendarUrl('Google L5 Technical Screen', '2026-12-05', 'Master dynamic programming and graphs');
assert(gcalUrl.startsWith('https://calendar.google.com/calendar/render?'), 'Invalid Google Calendar base URL');
assert(gcalUrl.includes('action=TEMPLATE'), 'Missing action=TEMPLATE in Google Calendar link');
assert(gcalUrl.includes('20261205'), 'Missing target date in Google Calendar query string');
console.log('  ✓ PASS: Google Calendar 1-Click web URL properly encoded');

console.log('🎉 All Calendar Integration tests passed!\n');
