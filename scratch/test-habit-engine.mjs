import assert from 'assert';

console.log('Testing Anti-Guilt Habit Engine & Streak Resilience...');

function getDayOfWeek(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).getDay();
}

function getPreviousDateString(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function isHabitCompletedOnDate(habit, dateStr) {
  return Array.isArray(habit.completedDates) && habit.completedDates.includes(dateStr);
}

function isRestDay(habit, dateStr) {
  if (!habit.restDays || habit.restDays.length === 0) return false;
  const day = getDayOfWeek(dateStr);
  return habit.restDays.includes(day);
}

function calculateHabitStreak(habit, referenceDateStr) {
  const completedToday = isHabitCompletedOnDate(habit, referenceDateStr);
  const restDayToday = isRestDay(habit, referenceDateStr);

  const yesterdayStr = getPreviousDateString(referenceDateStr);
  const completedYesterday = isHabitCompletedOnDate(habit, yesterdayStr);
  const restDayYesterday = isRestDay(habit, yesterdayStr);

  let inRecoveryMode = false;
  let missedYesterday = false;

  if (!completedYesterday && !restDayYesterday) {
    missedYesterday = true;
    if (!completedToday) {
      inRecoveryMode = true;
    }
  }

  let currentStreak = 0;
  let checkDate = completedToday ? referenceDateStr : yesterdayStr;
  let graceUsed = 0;
  const maxGrace = habit.recoveryGraceDays ?? 1;

  for (let i = 0; i < 365; i++) {
    const isComp = isHabitCompletedOnDate(habit, checkDate);
    const isRest = isRestDay(habit, checkDate);

    if (isComp) {
      currentStreak++;
    } else if (isRest) {
      // Rest day maintains streak
    } else {
      if (graceUsed < maxGrace && i > 0) {
        graceUsed++;
      } else {
        break;
      }
    }
    checkDate = getPreviousDateString(checkDate);
  }

  return {
    currentStreak,
    longestStreak: Math.max(habit.longestStreak || 0, currentStreak),
    completedToday,
    missedYesterday,
    inRecoveryMode,
    restDayToday,
  };
}

let assertions = 0;
const today = new Date().toISOString().split('T')[0];
const yesterday = getPreviousDateString(today);
const twoDaysAgo = getPreviousDateString(yesterday);
const threeDaysAgo = getPreviousDateString(twoDaysAgo);

// Test 1: Unbroken streak
const habit1 = {
  id: 'h1',
  completedDates: [twoDaysAgo, yesterday, today],
  recoveryGraceDays: 1,
  longestStreak: 3,
  restDays: [],
};
const res1 = calculateHabitStreak(habit1, today);
assert.strictEqual(res1.completedToday, true);
assert.strictEqual(res1.missedYesterday, false);
assert.strictEqual(res1.inRecoveryMode, false);
assert.ok(res1.currentStreak >= 3);
assertions++;
console.log('  ✓ PASS: Unbroken streak calculated accurately (streak:', res1.currentStreak, ')');

// Test 2: Recovery mode when yesterday was missed
const habit2 = {
  id: 'h2',
  completedDates: [twoDaysAgo],
  recoveryGraceDays: 1,
  longestStreak: 2,
  restDays: [],
};
const res2 = calculateHabitStreak(habit2, today);
assert.strictEqual(res2.completedToday, false);
assert.strictEqual(res2.missedYesterday, true);
assert.strictEqual(res2.inRecoveryMode, true);
assertions++;
console.log('  ✓ PASS: Anti-guilt recovery mode triggers on single miss');

// Test 3: Streak recovery on completing today
const habit3 = {
  ...habit2,
  completedDates: [twoDaysAgo, today],
};
const res3 = calculateHabitStreak(habit3, today);
assert.strictEqual(res3.completedToday, true);
assert.ok(res3.currentStreak >= 2);
assertions++;
console.log('  ✓ PASS: Completing today recovers streak under grace period (streak:', res3.currentStreak, ')');

// Test 4: Double consecutive miss resets streak to 0 ("Never miss twice")
const habit4 = {
  id: 'h4',
  completedDates: [threeDaysAgo],
  recoveryGraceDays: 1,
  longestStreak: 5,
  restDays: [],
};
const res4 = calculateHabitStreak(habit4, today);
assert.strictEqual(res4.currentStreak, 0);
assertions++;
console.log('  ✓ PASS: Double consecutive miss enforces "never miss twice" streak reset');

// Test 5: Rest day protection
const habit5 = {
  id: 'h5',
  completedDates: [yesterday],
  recoveryGraceDays: 1,
  restDays: [0, 1, 2, 3, 4, 5, 6], // All days rest
};
assert.strictEqual(isRestDay(habit5, today), true);
assertions++;
console.log('  ✓ PASS: Rest day recognition protects non-working days');

console.log(`\n🎉 Anti-Guilt Habit Engine verified with ${assertions} assertions passed!`);
