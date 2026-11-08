import {
  HabitItem,
  DailyRoutineItem,
  HydrationLog,
  JournalEntry,
  LearningRoadmap,
  BudgetCategory,
  SavingsGoal,
  DreamBucketItem,
  SecondBrainNote,
  PlannerTask,
  FocusSession,
} from '../types';
import { getStoredItem, setStoredItem } from '../utils/storage';

const STORAGE_KEY_HABITS = 'offer_mode_habits_v2';
const STORAGE_KEY_ROUTINES = 'offer_mode_routines_v2';
const STORAGE_KEY_HYDRATION = 'offer_mode_hydration_v2';
const STORAGE_KEY_JOURNAL = 'offer_mode_journal_v2';
const STORAGE_KEY_ROADMAPS = 'offer_mode_roadmaps_v2';
const STORAGE_KEY_BUDGET = 'offer_mode_budget_v2';
const STORAGE_KEY_SAVINGS = 'offer_mode_savings_v2';
const STORAGE_KEY_DREAMS = 'offer_mode_dreams_v2';
const STORAGE_KEY_NOTES = 'offer_mode_notes_v2';
const STORAGE_KEY_PLANNER = 'offer_mode_planner_v2';
const STORAGE_KEY_FOCUS = 'offer_mode_focus_v2';

const getTodayString = (): string => new Date().toISOString().split('T')[0];

const getPastDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// ==========================================
// DEFAULT SEED DATA
// ==========================================

export const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'habit-sunlight',
    title: 'Morning Light & 15m Walk',
    category: 'health',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    streakCount: 14,
    longestStreak: 21,
    completedDates: [getPastDate(3), getPastDate(2), getPastDate(1), getTodayString()],
    recoveryGraceDays: 1,
    restDays: [],
    createdAt: getPastDate(30),
  },
  {
    id: 'habit-leetcode',
    title: '1 Algorithm or System Design Pattern',
    category: 'career',
    frequency: 'weekdays',
    targetDaysPerWeek: 5,
    streakCount: 9,
    longestStreak: 16,
    completedDates: [getPastDate(4), getPastDate(3), getPastDate(2), getPastDate(1), getTodayString()],
    recoveryGraceDays: 1,
    restDays: [0, 6], // Saturday, Sunday rest
    createdAt: getPastDate(40),
  },
  {
    id: 'habit-deep-code',
    title: '45m Uninterrupted Deep Work Block',
    category: 'routine',
    frequency: 'daily',
    targetDaysPerWeek: 6,
    streakCount: 6,
    longestStreak: 12,
    completedDates: [getPastDate(2), getPastDate(1), getTodayString()],
    recoveryGraceDays: 1,
    restDays: [0],
    createdAt: getPastDate(20),
  },
  {
    id: 'habit-hydration',
    title: 'Hydration Target (2.5L / 8 Glasses)',
    category: 'health',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    streakCount: 18,
    longestStreak: 18,
    completedDates: [getPastDate(2), getPastDate(1), getTodayString()],
    recoveryGraceDays: 1,
    restDays: [],
    createdAt: getPastDate(30),
  },
  {
    id: 'habit-reading',
    title: '20 Pages Architecture / Mindset Book',
    category: 'learning',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    streakCount: 5,
    longestStreak: 14,
    completedDates: [getPastDate(2), getPastDate(1)],
    recoveryGraceDays: 1,
    restDays: [],
    createdAt: getPastDate(15),
  },
];

export const DEFAULT_ROUTINES: DailyRoutineItem[] = [
  { id: 'rt-1', period: 'morning', title: '500ml water + morning hydration', timeEstimate: '2m', completed: true },
  { id: 'rt-2', period: 'morning', title: '10m physical mobility & sunlight', timeEstimate: '10m', completed: true },
  { id: 'rt-3', period: 'morning', title: 'Define 3 Most Important Tasks (MITs)', timeEstimate: '5m', completed: true },
  { id: 'rt-4', period: 'afternoon', title: 'Focus Sprint 1: High-leverage project coding', timeEstimate: '45m', completed: false },
  { id: 'rt-5', period: 'afternoon', title: 'Midday tech review / interview prep practice', timeEstimate: '30m', completed: false },
  { id: 'rt-6', period: 'evening', title: 'Daily shutdown: commit code, clean workspace', timeEstimate: '10m', completed: false },
  { id: 'rt-7', period: 'evening', title: 'Journal 3 gratitudes + review tomorrow’s plan', timeEstimate: '5m', completed: false },
];

export const DEFAULT_HYDRATION: HydrationLog = {
  date: getTodayString(),
  glassesDrank: 5,
  targetGlasses: 8,
};

export const DEFAULT_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-entry-1',
    date: getTodayString(),
    title: 'Focus, Clarity & Steady Momentum',
    content: 'Felt really grounded this morning. Built the unified icon system and enterprise auth engine. Instead of rushing through things with anxiety, taking time to structure each layer properly creates so much compounding value. Staying resilient and keeping eye on the long-term career target.',
    mood: 5,
    moodTags: ['Focused', 'Calm', 'Energized'],
    gratitude: [
      'Grateful for having deep mental focus today without distractions',
      'Grateful for clean code architecture and working unit tests',
      'Grateful for good coffee and a supportive environment'
    ],
    winOfTheDay: 'Reduced primary JavaScript bundle size by 80% while expanding capability.',
    tags: ['Mindset', 'Productivity', 'Growth'],
    isLocked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'j-entry-2',
    date: getPastDate(1),
    title: 'Reframing Uncertainty as Runway',
    content: 'Whenever self-doubt creeps in during the career sprint, I remind myself: consistency beats occasional bursts of heroics. The anti-guilt rule ("never miss twice") keeps me from spiraling if an afternoon gets interrupted.',
    mood: 4,
    moodTags: ['Calm', 'Reflective'],
    gratitude: [
      'Having a safe space to learn and build freely',
      'The ability to turn complex concepts into clean UI',
      'An evening walk under clear skies'
    ],
    winOfTheDay: 'Finished the PBKDF2 authentication security module with zero external leaks.',
    tags: ['Career', 'Mindset'],
    isLocked: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const DEFAULT_ROADMAPS: LearningRoadmap[] = [
  {
    id: 'roadmap-staff-arch',
    title: 'Staff Engineer & Distributed Systems Masterclass',
    category: 'Architecture',
    description: 'Master high-throughput distributed systems, consensus algorithms, caching strategies, and event-driven architecture.',
    totalStudyHours: 85,
    skills: [
      { name: 'Raft & Paxos Consensus', level: 'Intermediate', verified: true },
      { name: 'Distributed Caching (Redis/Memcached)', level: 'Advanced', verified: true },
      { name: 'Kafka & Event-Driven Patterns', level: 'Intermediate', verified: true },
      { name: 'Database Sharding & Replication', level: 'Intermediate', verified: false },
      { name: 'High-Concurrency Lock-free Primitives', level: 'Advanced', verified: true },
    ],
    courses: [
      {
        id: 'c-1',
        title: 'MIT 6.824: Distributed Systems Engineering',
        provider: 'MIT OpenCourseWare',
        topic: 'Distributed Systems',
        totalHours: 40,
        completedHours: 32,
        status: 'In Progress',
        notes: 'Currently implementing Raft leader election and log replication lab.',
      },
      {
        id: 'c-2',
        title: 'Designing Data-Intensive Applications In Depth',
        provider: 'O’Reilly / Self-Guided',
        topic: 'Storage & Retrieval',
        totalHours: 25,
        completedHours: 25,
        status: 'Completed',
        notes: 'Completed chapters 1-12 with comprehensive notes in Second Brain.',
      },
    ],
  },
  {
    id: 'roadmap-ai-systems',
    title: 'Production AI & LLM Systems Architect',
    category: 'AI / Machine Learning',
    description: 'Build enterprise-grade AI applications with autonomous agents, semantic routing, evaluation harnesses, and vector databases.',
    totalStudyHours: 60,
    skills: [
      { name: 'Agentic Workflows & Tool Calling', level: 'Advanced', verified: true },
      { name: 'RAG & Hybrid Sparse/Dense Search', level: 'Intermediate', verified: true },
      { name: 'LLM Latency Optimization & Streaming', level: 'Advanced', verified: true },
      { name: 'Fine-Tuning & Evaluation Metrics', level: 'Beginner', verified: false },
    ],
    courses: [
      {
        id: 'c-3',
        title: 'Building Agentic AI Systems in TypeScript & Python',
        provider: 'DeepLearning.AI',
        topic: 'Autonomous Agents',
        totalHours: 20,
        completedHours: 16,
        status: 'In Progress',
      },
    ],
  },
];

export const DEFAULT_BUDGET: BudgetCategory[] = [
  { id: 'b-rent', name: 'Housing & Rent', budgeted: 1800, spent: 1800, type: 'fixed' },
  { id: 'b-groceries', name: 'Nutritious Groceries & Food', budgeted: 600, spent: 440, type: 'fixed' },
  { id: 'b-utilities', name: 'Utilities & Fast Internet', budgeted: 220, spent: 195, type: 'fixed' },
  { id: 'b-learning', name: 'Books, Subscriptions & Cloud Hosting', budgeted: 150, spent: 95, type: 'flexible' },
  { id: 'b-dining', name: 'Coffee & Social Dining', budgeted: 250, spent: 180, type: 'flexible' },
  { id: 'b-runway', name: 'Emergency & Freedom Career Runway', budgeted: 1200, spent: 1200, type: 'savings' },
];

export const DEFAULT_SAVINGS: SavingsGoal[] = [
  {
    id: 'sg-runway',
    title: '6-Month Career Freedom Runway',
    targetAmount: 20000,
    currentAmount: 14800,
    targetDate: '2026-12-31',
  },
  {
    id: 'sg-gear',
    title: 'Dream Ergonomic Studio & Workstation',
    targetAmount: 3500,
    currentAmount: 2850,
    targetDate: '2026-09-30',
  },
  {
    id: 'sg-family',
    title: 'Family Celebration Fund',
    targetAmount: 5000,
    currentAmount: 3400,
    targetDate: '2027-01-15',
  },
];

export const DEFAULT_DREAMS: DreamBucketItem[] = [
  {
    id: 'dr-1',
    category: 'travel',
    title: 'Japan Autumn Foliage & Tokyo Tech Tour',
    estimatedCost: 4500,
    targetYear: '2027',
    status: 'planning',
    notes: 'Kyoto zen gardens, Mount Fuji trail, Akihabara tech markets.',
  },
  {
    id: 'dr-2',
    category: 'experience',
    title: 'Keynote or Lighting Talk at Major Tech Conference',
    estimatedCost: 1000,
    targetYear: '2026',
    status: 'planning',
    notes: 'Propose talk on local-first offline-ready React architecture.',
  },
  {
    id: 'dr-3',
    category: 'creative',
    title: 'Open Source Repository with 1,000+ Stars',
    estimatedCost: 0,
    targetYear: '2026',
    status: 'planning',
    notes: 'Polished developer tools and productivity command center.',
  },
  {
    id: 'dr-4',
    category: 'purchase',
    title: 'Acoustically Treated Standing Desk Sound Studio',
    estimatedCost: 2800,
    targetYear: '2027',
    status: 'dreaming',
    notes: 'Studio monitors, Shure microphone, custom walnut hardwood desktop.',
  },
];

export const DEFAULT_NOTES: SecondBrainNote[] = [
  {
    id: 'note-1',
    title: 'Distributed System Resiliency: Circuit Breaker & Retry Patterns',
    folder: 'resources',
    tags: ['Architecture', 'Reliability', 'SystemDesign'],
    content: `# Circuit Breaker & Exponential Backoff

When building distributed microservices, failures are inevitable. A robust system prevents cascading failures using the Circuit Breaker pattern.

### The 3 States:
1. **Closed**: Requests flow normally. Failures are measured against a threshold.
2. **Open**: Threshold breached. Subsequent calls fail fast immediately without hitting downstream service.
3. **Half-Open**: Periodic probe requests allowed through. If successful, state resets to Closed.

### Jitter is Crucial
Always pair exponential backoff with randomized jitter to prevent the "Thundering Herd" problem on recovered databases.`,
    isPinned: true,
    isFavorite: true,
    lastModified: getPastDate(2),
  },
  {
    id: 'note-2',
    title: 'Behavioral Interview: The High-Impact STAR Framework',
    folder: 'areas',
    tags: ['Career', 'Interview', 'Leadership'],
    content: `# STAR Method for Executive & Senior Roles

- **Situation**: Contextualize in 2-3 sentences. Focus on high stakes or technical challenge.
- **Task**: Explicitly state your exact role and ownership boundary.
- **Action**: 70% of the answer. Use "I designed", "I orchestrated", "I negotiated".
- **Result**: Quantify! Mention latency drops, dollar savings, team velocity, and business impact.`,
    isPinned: true,
    isFavorite: true,
    lastModified: getPastDate(4),
  },
  {
    id: 'note-3',
    title: 'Local-First Architecture Principles (Offline & Fast)',
    folder: 'projects',
    tags: ['Frontend', 'OfflineFirst', 'React'],
    content: `# Principles of Local-First Software

1. **No spinners for basic reads/writes**: User mutations update local state immediately.
2. **Offline by default**: Every essential feature functions 100% without an internet connection.
3. **Data longevity**: User owns their files via JSON export and local SQLite/localStorage.
4. **Instant sync when connected**: Background service workers and optimistic updates.`,
    isPinned: false,
    isFavorite: false,
    lastModified: getPastDate(1),
  },
];

export const DEFAULT_PLANNER_TASKS: PlannerTask[] = [
  {
    id: 'pt-1',
    title: 'Ship Phase 4 Life Command Center & Navigation',
    priority: 'high',
    dueDate: getTodayString(),
    timeEstimate: '60m',
    completed: true,
    trackId: 'overview',
    subtasks: [
      { id: 'sub-1', text: 'Create Routines, Journal & Focus pages', completed: true },
      { id: 'sub-2', text: 'Implement anti-guilt habit streak engine', completed: true },
      { id: 'sub-3', text: 'Add Web Audio ambient focus player', completed: true },
    ],
  },
  {
    id: 'pt-2',
    title: 'Mock Technical System Design: Scalable Rate Limiter',
    priority: 'high',
    dueDate: getTodayString(),
    timeEstimate: '45m',
    completed: false,
    trackId: 'interview',
    subtasks: [
      { id: 'sub-4', text: 'Compare Token Bucket vs Sliding Window Log', completed: false },
      { id: 'sub-5', text: 'Draft Redis Lua script implementation', completed: false },
    ],
  },
  {
    id: 'pt-3',
    title: 'Review 3 Tier-1 Company Applications & Customized Cover Letters',
    priority: 'medium',
    dueDate: getTodayString(),
    timeEstimate: '30m',
    completed: false,
    trackId: 'job-hunt',
  },
  {
    id: 'pt-4',
    title: 'Hydrate & 20m Evening Walk Without Phone',
    priority: 'low',
    dueDate: getTodayString(),
    timeEstimate: '20m',
    completed: false,
    trackId: 'general',
  },
];

export const DEFAULT_FOCUS_SESSIONS: FocusSession[] = [
  { id: 'fs-1', date: getTodayString(), durationMinutes: 25, focusType: 'pomodoro', taskTitle: 'Auth Engine Hardening', completed: true },
  { id: 'fs-2', date: getTodayString(), durationMinutes: 25, focusType: 'deep_work', taskTitle: 'Vector Icon Registry Integration', completed: true },
  { id: 'fs-3', date: getPastDate(1), durationMinutes: 50, focusType: 'deep_work', taskTitle: 'Code Splitting & Bundle Optimization', completed: true },
];

// ==========================================
// STORAGE ACCESSORS
// ==========================================

export const loadHabits = (): HabitItem[] => getStoredItem<HabitItem[]>(STORAGE_KEY_HABITS, DEFAULT_HABITS);
export const saveHabits = (habits: HabitItem[]): boolean => setStoredItem(STORAGE_KEY_HABITS, habits);

export const loadRoutines = (): DailyRoutineItem[] => getStoredItem<DailyRoutineItem[]>(STORAGE_KEY_ROUTINES, DEFAULT_ROUTINES);
export const saveRoutines = (routines: DailyRoutineItem[]): boolean => setStoredItem(STORAGE_KEY_ROUTINES, routines);

export const loadHydration = (): HydrationLog => {
  const log = getStoredItem<HydrationLog>(STORAGE_KEY_HYDRATION, DEFAULT_HYDRATION);
  // Auto-reset for new day
  if (log.date !== getTodayString()) {
    return { date: getTodayString(), glassesDrank: 0, targetGlasses: log.targetGlasses || 8 };
  }
  return log;
};
export const saveHydration = (log: HydrationLog): boolean => setStoredItem(STORAGE_KEY_HYDRATION, log);

export const loadJournalEntries = (): JournalEntry[] => getStoredItem<JournalEntry[]>(STORAGE_KEY_JOURNAL, DEFAULT_JOURNAL_ENTRIES);
export const saveJournalEntries = (entries: JournalEntry[]): boolean => setStoredItem(STORAGE_KEY_JOURNAL, entries);

export const loadRoadmaps = (): LearningRoadmap[] => getStoredItem<LearningRoadmap[]>(STORAGE_KEY_ROADMAPS, DEFAULT_ROADMAPS);
export const saveRoadmaps = (roadmaps: LearningRoadmap[]): boolean => setStoredItem(STORAGE_KEY_ROADMAPS, roadmaps);

export const loadBudgetCategories = (): BudgetCategory[] => getStoredItem<BudgetCategory[]>(STORAGE_KEY_BUDGET, DEFAULT_BUDGET);
export const saveBudgetCategories = (categories: BudgetCategory[]): boolean => setStoredItem(STORAGE_KEY_BUDGET, categories);

export const loadSavingsGoals = (): SavingsGoal[] => getStoredItem<SavingsGoal[]>(STORAGE_KEY_SAVINGS, DEFAULT_SAVINGS);
export const saveSavingsGoals = (goals: SavingsGoal[]): boolean => setStoredItem(STORAGE_KEY_SAVINGS, goals);

export const loadDreams = (): DreamBucketItem[] => getStoredItem<DreamBucketItem[]>(STORAGE_KEY_DREAMS, DEFAULT_DREAMS);
export const saveDreams = (dreams: DreamBucketItem[]): boolean => setStoredItem(STORAGE_KEY_DREAMS, dreams);

export const loadSecondBrainNotes = (): SecondBrainNote[] => getStoredItem<SecondBrainNote[]>(STORAGE_KEY_NOTES, DEFAULT_NOTES);
export const saveSecondBrainNotes = (notes: SecondBrainNote[]): boolean => setStoredItem(STORAGE_KEY_NOTES, notes);

export const loadPlannerTasks = (): PlannerTask[] => getStoredItem<PlannerTask[]>(STORAGE_KEY_PLANNER, DEFAULT_PLANNER_TASKS);
export const savePlannerTasks = (tasks: PlannerTask[]): boolean => setStoredItem(STORAGE_KEY_PLANNER, tasks);

export const loadFocusSessions = (): FocusSession[] => getStoredItem<FocusSession[]>(STORAGE_KEY_FOCUS, DEFAULT_FOCUS_SESSIONS);
export const saveFocusSessions = (sessions: FocusSession[]): boolean => setStoredItem(STORAGE_KEY_FOCUS, sessions);
