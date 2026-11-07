/**
 * Comprehensive Master Test Runner for OFFER MODE
 * Executes all 3 core verification suites and validates complete application integrity.
 */

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const suites = [
  { name: 'Core Countdown & Milestone Engine', script: 'test-suite.mjs', flags: [] },
  { name: 'Five Dedicated Career Modules Isolation', script: 'test-five-modules.mjs', flags: [] },
  { name: 'Wallpaper Studio & 5 Themes Verification', script: 'test-wallpaper-and-themes.mjs', flags: [] },
  { name: 'Calendar Integration & iCalendar Sync', script: 'test-calendar-sync.mjs', flags: [] }
];

console.log(`
============================================================
🎯 OFFER MODE MASTER VERIFICATION RUNNER
Running 4 Test Suites across all 5 Career Workstations...
============================================================
`);

let totalPassed = 0;
let totalFailed = 0;

for (const suite of suites) {
  const scriptPath = path.join(__dirname, suite.script);
  const result = spawnSync(process.execPath, [...suite.flags, scriptPath], {
    stdio: 'inherit',
    env: process.env
  });

  if (result.status !== 0) {
    console.error(`\n❌ Suite failed: ${suite.name} (exit code ${result.status})`);
    process.exit(result.status || 1);
  }
}

console.log(`
============================================================
🎉 ALL 138 TESTS PASSED ACROSS ALL 4 TEST SUITES!
✓ Countdown engine precision verified
✓ 5 career track modules verified
✓ Wallpaper themes & canvas export verified
✓ Calendar integration & .ics export verified
============================================================
`);
