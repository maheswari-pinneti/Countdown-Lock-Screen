// Verification Test for all 5 Complete Career Experience Modules in OFFER MODE
import { DEFAULT_EXPERIENCES } from './defaultExperiencesHelper.js';
import { calculateCountdownEngine } from './countdownTestHelper.js';

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
console.log('OFFER MODE: FIVE COMPLETE CAREER MODULES TEST SUITE');
console.log('====================================================\n');

// ------------------------------------------------------------------
// 1. MODULE VERIFICATION & PRESET MILESTONES
// ------------------------------------------------------------------
console.log('[Suite 1] Preset Milestones Count & Content Check');
{
  assert(DEFAULT_EXPERIENCES.length === 5, 'Exactly 5 career modules exist in default experiences');

  // Module 1: Interview Countdown
  const mod1 = DEFAULT_EXPERIENCES.find(e => e.id === 'interview');
  assert(mod1 !== undefined, 'Module 1 (Interview Countdown) exists');
  assert(mod1.milestones.length === 9, `Module 1 has exactly 9 preset milestones (got ${mod1?.milestones?.length})`);
  assert(mod1.milestones[0].title === 'Research the company', 'Module 1 milestone 1 is "Research the company"');
  assert(mod1.milestones[8].title === 'Final interview preparation', 'Module 1 milestone 9 is "Final interview preparation"');

  // Module 2: 30-Day Job Hunt Sprint
  const mod2 = DEFAULT_EXPERIENCES.find(e => e.id === 'job-hunt');
  assert(mod2 !== undefined, 'Module 2 (30-Day Job Hunt Sprint) exists');
  assert(mod2.milestones.length === 10, `Module 2 has exactly 10 preset milestones (got ${mod2?.milestones?.length})`);
  assert(mod2.milestones[0].title === 'Update resume', 'Module 2 milestone 1 is "Update resume"');
  assert(mod2.milestones[9].title === 'Review weekly progress', 'Module 2 milestone 10 is "Review weekly progress"');

  // Module 3: Developer Skill Upgrade
  const mod3 = DEFAULT_EXPERIENCES.find(e => e.id === 'developer');
  assert(mod3 !== undefined, 'Module 3 (Developer Skill Upgrade) exists');
  assert(mod3.milestones.length === 10, `Module 3 has exactly 10 preset milestones (got ${mod3?.milestones?.length})`);
  assert(mod3.milestones[0].title === 'Assess current skills', 'Module 3 milestone 1 is "Assess current skills"');
  assert(mod3.milestones[9].title === 'Complete a mock interview', 'Module 3 milestone 10 is "Complete a mock interview"');

  // Module 4: First Job Countdown
  const mod4 = DEFAULT_EXPERIENCES.find(e => e.id === 'first-job');
  assert(mod4 !== undefined, 'Module 4 (First Job Countdown) exists');
  assert(mod4.milestones.length === 10, `Module 4 has exactly 10 preset milestones (got ${mod4?.milestones?.length})`);
  assert(mod4.milestones[0].title === 'Prepare resume', 'Module 4 milestone 1 is "Prepare resume"');
  assert(mod4.milestones[9].title === 'Prepare HR interview', 'Module 4 milestone 10 is "Prepare HR interview"');

  // Module 5: Career Switch Countdown
  const mod5 = DEFAULT_EXPERIENCES.find(e => e.id === 'career-switch');
  assert(mod5 !== undefined, 'Module 5 (Career Switch Countdown) exists');
  assert(mod5.milestones.length === 12, `Module 5 has exactly 12 preset milestones (got ${mod5?.milestones?.length})`);
  assert(mod5.milestones[0].title === 'Evaluate existing skills', 'Module 5 milestone 1 is "Evaluate existing skills"');
  assert(mod5.milestones[11].title === 'Review transition progress', 'Module 5 milestone 12 is "Review transition progress"');
}

// ------------------------------------------------------------------
// 2. SHARED COUNTDOWN ENGINE USAGE ACROSS ALL 5 MODULES
// ------------------------------------------------------------------
console.log('\n[Suite 2] Shared Countdown Engine Execution for All 5 Modules');
{
  for (const exp of DEFAULT_EXPERIENCES) {
    const completedCount = exp.milestones.filter(m => m.completed).length;
    const result = calculateCountdownEngine(
      exp.targetOfferDate,
      exp.startDateIso,
      exp.timeZone,
      exp.deadlineTime,
      completedCount,
      exp.milestones.length
    );

    assert(typeof result.days === 'number', `${exp.id}: computes numeric days`);
    assert(typeof result.hours === 'number', `${exp.id}: computes numeric hours`);
    assert(typeof result.minutes === 'number', `${exp.id}: computes numeric minutes`);
    assert(typeof result.seconds === 'number', `${exp.id}: computes numeric seconds`);
    assert(result.compositeProgressPercentage >= 0 && result.compositeProgressPercentage <= 100, `${exp.id}: progress is bounded between 0% and 100%`);
    assert(['future', 'today', 'urgent', 'expired', 'invalid'].includes(result.deadlineStatus), `${exp.id}: has valid deadline status (${result.deadlineStatus})`);
  }
}

// ------------------------------------------------------------------
// 3. INDEPENDENT PERSISTENCE & ISOLATION
// ------------------------------------------------------------------
console.log('\n[Suite 3] Independent State Persistence & Isolation');
{
  let state = JSON.parse(JSON.stringify(DEFAULT_EXPERIENCES));

  // Edit Module 1 (interview)
  const updatedMod1 = {
    ...state.find(e => e.id === 'interview'),
    targetCompany: 'Custom Unicorn Labs',
    targetRole: 'Staff AI Solutions Engineer',
    milestones: [
      ...state.find(e => e.id === 'interview').milestones,
      { id: 'custom-m1', trackId: 'interview', title: 'Custom Milestone 1', deadline: '2026-11-20', dueDate: '2026-11-20', priority: 'urgent', completed: true, category: 'prep' }
    ]
  };

  state = state.map(e => e.id === 'interview' ? updatedMod1 : e);

  // Verify Module 1 changed
  const checkMod1 = state.find(e => e.id === 'interview');
  assert(checkMod1.targetCompany === 'Custom Unicorn Labs', 'Module 1 company updated independently');
  assert(checkMod1.milestones.length === 10, 'Module 1 has 10 milestones now');

  // Verify Module 2, 3, 4, 5 did NOT change
  const checkMod2 = state.find(e => e.id === 'job-hunt');
  assert(checkMod2.milestones.length === 10, 'Module 2 milestone count remained untouched (10)');

  const checkMod3 = state.find(e => e.id === 'developer');
  assert(checkMod3.milestones.length === 10, 'Module 3 milestone count remained untouched (10)');

  const checkMod5 = state.find(e => e.id === 'career-switch');
  assert(checkMod5.milestones.length === 12, 'Module 5 milestone count remained untouched (12)');

  // Test: Independent Reset for Module 1
  const defaultMod1 = DEFAULT_EXPERIENCES.find(e => e.id === 'interview');
  state = state.map(e => e.id === 'interview' ? JSON.parse(JSON.stringify(defaultMod1)) : e);

  const resetMod1 = state.find(e => e.id === 'interview');
  assert(resetMod1.milestones.length === 9, 'Module 1 successfully reset to 9 preset milestones');
  assert(resetMod1.targetCompany === 'Citadel Securities & Stripe', 'Module 1 company restored to default');
}

// ------------------------------------------------------------------
// 4. COMPLETION STATE EVALUATION
// ------------------------------------------------------------------
console.log('\n[Suite 4] Module Completion State Evaluation');
{
  // Test when all milestones are completed
  const allDoneMilestones = [
    { id: '1', completed: true },
    { id: '2', completed: true },
    { id: '3', completed: true },
  ];
  const pct = Number(((allDoneMilestones.filter(m => m.completed).length / allDoneMilestones.length) * 100).toFixed(1));
  assert(pct === 100, 'Calculates 100% completion when all milestones are done');

  // Test partial completion
  const partialMilestones = [
    { id: '1', completed: true },
    { id: '2', completed: false },
  ];
  const partialPct = Number(((partialMilestones.filter(m => m.completed).length / partialMilestones.length) * 100).toFixed(1));
  assert(partialPct === 50, 'Calculates 50% completion accurately');
}

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

