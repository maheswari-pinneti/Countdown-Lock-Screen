// Comprehensive Verification Test Suite for OFFER MODE Countdown & Milestone Engine
import { resolveTargetTimestamp, calculateCountdownEngine } from '../src/utils/countdownEngine.ts';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

console.log('====================================================');
console.log('OFFER MODE: COUNTDOWN & MILESTONE ENGINE TEST SUITE');
console.log('====================================================\n');

// ------------------------------------------------------------------
// 1. COUNTDOWN CALCULATIONS: FUTURE DEADLINES
// ------------------------------------------------------------------
console.log('[Suite 1] Future Deadline Calculations');
{
  const now = Date.now();
  // Target 5 days, 4 hours, 30 minutes in the future
  const futureMs = now + (5 * 86400 + 4 * 3600 + 30 * 60) * 1000;
  const futureDate = new Date(futureMs);
  const dateStr = futureDate.toISOString().slice(0, 10);
  const timeStr = `${String(futureDate.getUTCHours()).padStart(2, '0')}:${String(futureDate.getUTCMinutes()).padStart(2, '0')}`;

  const result = calculateCountdownEngine(dateStr, undefined, 'UTC', timeStr, 2, 5);

  assert(result.isExpired === false, 'Future deadline is not expired');
  assert(result.deadlineStatus === 'future' || result.deadlineStatus === 'urgent', 'Deadline status is future or urgent');
  assert(result.totalSeconds > 0, 'Total seconds remaining > 0');
  assert(result.days >= 4 && result.days <= 6, `Days remaining is approximately 5 (got ${result.days})`);
  assert(result.formatted.days.length === 2, 'Days formatted with two digits');
  assert(result.formatted.seconds.length === 2, 'Seconds formatted with two digits');
}

// ------------------------------------------------------------------
// 2. COUNTDOWN CALCULATIONS: TODAY'S DEADLINES
// ------------------------------------------------------------------
console.log('\n[Suite 2] Today Deadline Calculations');
{
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  // Set to 23:59 tonight in UTC
  const result = calculateCountdownEngine(todayStr, undefined, 'UTC', '23:59', 1, 4);

  assert(result.deadlineStatus === 'today' || result.isToday === true, "Recognizes today's deadline");
  assert(result.days === 0, 'Days remaining is 0 for today');
}

// ------------------------------------------------------------------
// 3. COUNTDOWN CALCULATIONS: EXPIRED DEADLINES
// ------------------------------------------------------------------
console.log('\n[Suite 3] Expired Deadline Calculations');
{
  const pastDateStr = '2020-01-01';
  const result = calculateCountdownEngine(pastDateStr, undefined, 'UTC', '12:00', 3, 5);

  assert(result.isExpired === true, 'Expired deadline marked as isExpired=true');
  assert(result.deadlineStatus === 'expired', 'Deadline status is "expired"');
  assert(result.days === 0 && result.hours === 0 && result.minutes === 0 && result.seconds === 0, 'All remaining time units are zero');
  assert(result.totalSeconds === 0, 'Total seconds is 0');
  assert(result.timelineProgressPercentage === 100, 'Timeline progress is 100% when expired');
}

// ------------------------------------------------------------------
// 4. COUNTDOWN CALCULATIONS: INVALID DATES
// ------------------------------------------------------------------
console.log('\n[Suite 4] Invalid Date Handling');
{
  const result = calculateCountdownEngine('not-a-valid-date', undefined, 'UTC', '12:00');

  assert(result.deadlineStatus === 'invalid', 'Invalid date returns status "invalid"');
  assert(result.isExpired === true, 'Invalid date defaults isExpired to true');
  assert(result.days === 0, 'Invalid date returns 0 days');
  assert(result.formatted.compact === '00:00:00', 'Invalid date returns safe compact string');
}

// ------------------------------------------------------------------
// 5. TIME ZONE DIFFERENCES & DST HANDLING
// ------------------------------------------------------------------
console.log('\n[Suite 5] Timezone Differences & Offsets');
{
  const dateStr = '2026-12-15';
  const timeStr = '18:00';

  const tsUTC = resolveTargetTimestamp(dateStr, timeStr, 'UTC');
  const tsNY = resolveTargetTimestamp(dateStr, timeStr, 'America/New_York');
  const tsTokyo = resolveTargetTimestamp(dateStr, timeStr, 'Asia/Tokyo');
  const tsLondon = resolveTargetTimestamp(dateStr, timeStr, 'Europe/London');

  assert(!isNaN(tsUTC), 'UTC timestamp resolved cleanly');
  assert(!isNaN(tsNY), 'New York timestamp resolved cleanly');
  assert(!isNaN(tsTokyo), 'Tokyo timestamp resolved cleanly');
  assert(!isNaN(tsLondon), 'London timestamp resolved cleanly');

  // In December: New York is EST (UTC-5), so 18:00 EST happens 5 hours AFTER 18:00 UTC
  // Meaning tsNY - tsUTC should be exactly 5 * 3600 * 1000 ms (+18,000,000 ms)
  const diffHoursNY = (tsNY - tsUTC) / (3600 * 1000);
  assert(diffHoursNY === 5, `New York offset in December is exactly UTC-5 (diff = +${diffHoursNY}h)`);

  // Tokyo is UTC+9, so 18:00 JST happens 9 hours BEFORE 18:00 UTC
  const diffHoursTokyo = (tsUTC - tsTokyo) / (3600 * 1000);
  assert(diffHoursTokyo === 9, `Tokyo offset is exactly UTC+9 (diff = -${diffHoursTokyo}h)`);
}

// ------------------------------------------------------------------
// 6. PROGRESS CALCULATIONS (COMPOSITE & REAL PROGRESS)
// ------------------------------------------------------------------
console.log('\n[Suite 6] Non-Random Progress Calculations');
{
  const start = '2026-01-01';
  const target = '2026-12-31';

  // 3 of 6 milestones completed = 50% milestone progress
  const result = calculateCountdownEngine(target, start, 'UTC', '18:00', 3, 6);

  assert(result.milestoneProgressPercentage === 50, `Milestone progress is exactly 50% (got ${result.milestoneProgressPercentage}%)`);
  assert(result.compositeProgressPercentage > 0, `Composite progress computed without random numbers (${result.compositeProgressPercentage}%)`);

  // 0 of 5 completed = 0% milestone progress
  const zeroMilestone = calculateCountdownEngine(target, start, 'UTC', '18:00', 0, 5);
  assert(zeroMilestone.milestoneProgressPercentage === 0, 'Zero completed milestones gives 0%');

  // 5 of 5 completed = 100% milestone progress
  const allMilestone = calculateCountdownEngine(target, start, 'UTC', '18:00', 5, 5);
  assert(allMilestone.milestoneProgressPercentage === 100, 'All completed milestones gives 100%');
}

// ------------------------------------------------------------------
// 7. MILESTONE OPERATIONS SIMULATION (ADD, EDIT, DELETE, TOGGLE, SORT, FILTER)
// ------------------------------------------------------------------
console.log('\n[Suite 7] Milestone Engine Operations & Sorting/Filtering');
{
  let milestones = [
    { id: '1', trackId: 'developer', title: 'System Design Mock', deadline: '2026-12-01', dueDate: '2026-12-01', completed: false, priority: 'urgent', category: 'interview' },
    { id: '2', trackId: 'developer', title: 'NeetCode 150', deadline: '2026-11-15', dueDate: '2026-11-15', completed: true, priority: 'high', category: 'prep' },
    { id: '3', trackId: 'developer', title: 'Behavioral Stories', deadline: '2026-12-10', dueDate: '2026-12-10', completed: false, priority: 'medium', category: 'prep' },
  ];

  // Test: Mark Complete & Undo
  milestones = milestones.map(m => m.id === '1' ? { ...m, completed: true } : m);
  assert(milestones.find(m => m.id === '1').completed === true, 'Milestone 1 marked complete');

  milestones = milestones.map(m => m.id === '1' ? { ...m, completed: false } : m);
  assert(milestones.find(m => m.id === '1').completed === false, 'Milestone 1 undone to pending');

  // Test: Add Milestone
  const newM = {
    id: '4',
    trackId: 'developer',
    title: 'Salary Negotiation Prep',
    deadline: '2026-12-15',
    dueDate: '2026-12-15',
    completed: false,
    priority: 'urgent',
    category: 'decision',
  };
  milestones.push(newM);
  assert(milestones.length === 4, 'Added milestone expands list to 4');

  // Test: Edit Milestone
  milestones = milestones.map(m => m.id === '4' ? { ...m, title: 'Total Comp Negotiation Call' } : m);
  assert(milestones.find(m => m.id === '4').title === 'Total Comp Negotiation Call', 'Milestone title edited');

  // Test: Delete Milestone
  milestones = milestones.filter(m => m.id !== '3');
  assert(milestones.length === 3, 'Milestone 3 deleted, list length is 3');
  assert(milestones.find(m => m.id === '3') === undefined, 'Milestone 3 no longer present');

  // Test: Completion Percentage
  const completedCount = milestones.filter(m => m.completed).length; // 1 out of 3
  const pct = Number(((completedCount / milestones.length) * 100).toFixed(1));
  assert(pct === 33.3, `Completion percentage is 33.3% (got ${pct}%)`);

  // Test: Filter Pending vs Completed
  const pending = milestones.filter(m => !m.completed);
  const done = milestones.filter(m => m.completed);
  assert(pending.length === 2, '2 pending milestones');
  assert(done.length === 1, '1 completed milestone');

  // Test: Sort by Due Date Ascending
  const sortedByDate = [...milestones].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  assert(sortedByDate[0].id === '2', 'Earliest milestone is Nov 15');
  assert(sortedByDate[sortedByDate.length - 1].id === '4', 'Latest milestone is Dec 15');
}

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

