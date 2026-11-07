export type ExperienceTrackId = 
  | 'developer'
  | 'interview'
  | 'job-hunt'
  | 'career-switch'
  | 'first-job';

export type ExperienceId = ExperienceTrackId;

export type MilestoneCategory = 'prep' | 'interview' | 'portfolio' | 'application' | 'negotiation' | 'decision';
export type MilestoneStatus = 'todo' | 'in_progress' | 'completed';
export type MilestonePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Milestone {
  id: string;
  trackId: ExperienceTrackId;
  title: string;
  description?: string;
  deadline: string; // ISO 8601 date string or YYYY-MM-DD
  dueDate?: string; // Standard due date representation
  completed: boolean;
  priority: MilestonePriority;
  category: MilestoneCategory;
  notes?: string;
}

export type DeadlineStatus = 'future' | 'today' | 'urgent' | 'expired' | 'invalid';

export interface CountdownGoalConfig {
  goalName: string;
  goalDescription: string;
  targetCompany: string;
  targetJobRole: string;
  startDate: string; // YYYY-MM-DD
  deadlineDate: string; // YYYY-MM-DD
  deadlineTime: string; // HH:mm
  timeZone: string; // IANA e.g. "UTC", "America/New_York"
  motivationalMessage: string;
  selectedExperience: ExperienceTrackId;
}

export interface CountdownEngineResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalSeconds: number;
  totalMilliseconds: number;
  isExpired: boolean;
  isToday: boolean;
  isUrgent: boolean;
  deadlineStatus: DeadlineStatus;
  statusLabel: string;
  formatted: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    milliseconds: string;
    compact: string;
  };
  timeRemainingText: string;
  timelineProgressPercentage: number;
  milestoneProgressPercentage: number;
  compositeProgressPercentage: number;
  targetTimestamp: number;
  targetDateFormatted: string;
  timeZone: string;
}

export type InterviewStageStatus = 'upcoming' | 'passed' | 'review' | 'pending' | 'rejected';

export interface InterviewStage {
  id: string;
  trackId: ExperienceTrackId;
  roundNumber: number;
  title: string;
  date: string;
  status: InterviewStageStatus;
  focusArea: string;
  interviewer?: string;
  preparationNotes?: string;
}

export type InterviewRound = InterviewStage;

export interface DailyGoal {
  id: string;
  trackId: ExperienceTrackId;
  text: string;
  completed: boolean;
  category: string;
}

export interface TrackMetric {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
}

export interface CompensationPackage {
  currency: string;
  baseSalary: number;
  bonusPercentage: number;
  equityValue: number;
  equityType: 'RSU' | 'Options' | 'Carry' | 'Tokens';
  signOnBonus: number;
  targetTotalComp: number;
  currentOffer?: number;
}

export type AmbientSoundTheme = 
  | 'cyber_hum' 
  | 'ticker_market' 
  | 'rain_lofi' 
  | 'binaural_focus' 
  | 'stealth_radar' 
  | 'none';

export interface ExperienceTheme {
  primary: string;
  primaryGlow: string;
  accent: string;
  bgGradient: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  ambientSound: AmbientSoundTheme;
  scanlines?: boolean;
}

// 1. Developer Track Specifics
export interface LeetCodeCategoryStat {
  name: string;
  count: number;
  mastered: number;
}

export interface DeveloperExperienceData {
  targetRole: string;
  targetCompany: string;
  leetcodeCategories: LeetCodeCategoryStat[];
  systemDesignTopics: string[];
  mockRating: number;
  deepWorkHours: number;
}

// 2. Interview & Quant Track Specifics
export interface MathSpeedRecord {
  accuracyPct: number;
  avgLatencyMs: number;
  highScore: number;
  recentScores: number[];
}

export interface InterviewExperienceData {
  targetFirm: string;
  superdayDate: string;
  mathRecords: MathSpeedRecord;
  targetSharpe: number;
  currentSharpe: number;
  drillsCompleted: number;
}

// 3. Job Hunt & Founder Track Specifics
export interface FeatureSprintItem {
  id: string;
  name: string;
  status: 'planned' | 'in_progress' | 'shipped';
  impact: 'Critical' | 'High' | 'Medium';
}

export interface JobHuntExperienceData {
  ventureName: string;
  targetRaise: number;
  postMoneyCap: number;
  monthlyBurn: number;
  cashInBank: number;
  applicationsSent: number;
  responseRatePct: number;
  featureSprints: FeatureSprintItem[];
}

// 4. Career Switch & Remote Track Specifics
export interface NomadDestination {
  city: string;
  country: string;
  avgCost: number;
  taxAdvantage: string;
  timezone: string;
  offset: number;
}

export interface CareerSwitchExperienceData {
  sourceDomain: string;
  targetDomain: string;
  targetCity: string;
  destinations: NomadDestination[];
  selectedCityIndex: number;
  monthlyRemoteRevenue: number;
  taxRatePct: number;
  myWorkStartHour: number;
  myWorkDuration: number;
}

// 5. First Job & Defense Cyber Track Specifics
export interface CveLabItem {
  id: string;
  cveId: string;
  target: string;
  status: 'In_Progress' | 'Replicated' | 'Patched';
  severity: 'Critical' | 'High';
}

export interface FirstJobExperienceData {
  pathway: string;
  clearanceScope: 'None' | 'Secret' | 'TS_SCI';
  defconStatus: string;
  competingOffersCount: number;
  recruiterUrgency: number;
  cveLabs: CveLabItem[];
  githubContributions: number;
}

export type SpecializedExperienceData = 
  | { type: 'developer'; data: DeveloperExperienceData }
  | { type: 'interview'; data: InterviewExperienceData }
  | { type: 'job-hunt'; data: JobHuntExperienceData }
  | { type: 'career-switch'; data: CareerSwitchExperienceData }
  | { type: 'first-job'; data: FirstJobExperienceData };

export interface CareerExperience {
  id: ExperienceTrackId;
  name: string;
  tagline: string;
  badge: string;
  icon: string;
  route: string;
  theme: ExperienceTheme;
  targetRole: string;
  targetCompany: string;
  targetOfferDate: string; // ISO 8601 or YYYY-MM-DD
  startDateIso: string;
  deadlineTime?: string; // HH:mm
  timeZone?: string; // IANA e.g. "UTC", "America/New_York"
  goalDescription?: string;
  motivationalMessage?: string;
  // Module 1: Interview Countdown specific form fields
  interviewType?: 'Technical' | 'HR' | 'Coding' | 'Managerial' | 'Other';
  prepNotes?: string;
  // Module 2: 30-Day Job Hunt Sprint specific form fields
  preferredLocation?: string;
  targetSalary?: number | string;
  targetCompanies?: string;
  // Module 3: Developer Skill Upgrade specific form fields
  currentSkillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  selectedTechnology?: 'React' | 'JavaScript' | 'TypeScript' | 'Node.js' | 'Python' | 'SQL' | 'DSA' | 'System Design';
  dailyStudyDuration?: string;
  // Module 4: First Job Countdown specific form fields
  collegeName?: string;
  graduationYear?: number | string;
  currentPrepLevel?: 'Beginner' | 'Intermediate' | 'Ready';
  // Module 5: Career Switch Countdown specific form fields
  currentJobRole?: string;
  currentTechnology?: string;
  targetTechnology?: string;
  expectedSalary?: number | string;
  readinessScore: number;
  streakDays: number;
  compensation: CompensationPackage;
  milestones: Milestone[];
  interviewPipeline: InterviewStage[];
  dailyGoals: DailyGoal[];
  customMetrics: TrackMetric[];
  quotes: string[];
  notes: string;
  specialized: SpecializedExperienceData;
  passkeyProtected?: boolean;
  isPasskeyUnlocked?: boolean;
  passkeyName?: string;
}

// Countdown Customizer / Studio Preset
export interface CountdownDesignPreset {
  id: string;
  name: string;
  trackId: ExperienceTrackId;
  fontFamily: 'mono' | 'sans' | 'display';
  styleVariant: 'glass' | 'cyber' | 'terminal' | 'minimal' | 'bold';
  accentColor: string;
  backgroundColor: string;
  showMilliseconds: boolean;
  showProgressBar: boolean;
  showQuotes: boolean;
  ambientSound: AmbientSoundTheme;
  customQuote?: string;
  createdDate: string;
}

// App Settings & Theme
export type ThemeMode = 'dark' | 'light' | 'system';

export interface AppSettings {
  themeMode: ThemeMode;
  timeFormat: '12h' | '24h';
  soundEnabled: boolean;
  soundVolume: number;
  currentSoundTheme: AmbientSoundTheme;
  vibrationOnMilestone: boolean;
  showMilliseconds: boolean;
  activeTrackId: ExperienceTrackId | 'overview';
  isLockScreenActive: boolean;
  zenMode: boolean;
  activeDesignPresetId: string;
}

// Date & Countdown Calculation Result
export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalSeconds: number;
  totalMilliseconds: number;
  isExpired: boolean;
  formatted: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    milliseconds: string;
  };
  progressPercentage: number;
}

// User Profile & Authentication
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  hasPasskey: boolean;
  passkeyRegisteredAt?: string;
  passkeyName?: string;
  createdAt: string;
}

// Passkey Credential Record
export interface PasskeyRecord {
  id: string;
  name: string;
  userId: string;
  userEmail: string;
  credentialId: string;
  transports?: string[];
  createdAt: string;
  lastUsedAt?: string;
}

// Project Passkey Security Status
export interface ProjectPasskeyStatus {
  trackId: ExperienceTrackId;
  isProtected: boolean;
  isUnlocked: boolean;
  unlockedAt?: string;
}

