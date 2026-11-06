export type ExperienceId = 'swe_faang' | 'quant_citadel' | 'founder_stealth' | 'remote_architect' | 'cyber_redteam';

export interface Milestone {
  id: string;
  title: string;
  deadline: string; // ISO date
  completed: boolean;
  category: 'prep' | 'interview' | 'negotiation' | 'decision';
  notes?: string;
}

export interface InterviewRound {
  id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'passed' | 'review' | 'pending';
  interviewer?: string;
  focusArea: string;
}

export interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

export interface CompensationPackage {
  currency: string;
  baseSalary: number;
  bonusPercentage: number;
  equityValue: number; // 4-year total or annual
  equityType: 'RSU' | 'Options' | 'Carry' | 'Tokens';
  signOnBonus: number;
  targetTotalComp: number;
  currentOffer?: number;
}

export interface CareerExperience {
  id: ExperienceId;
  name: string;
  tagline: string;
  badge: string;
  icon: string;
  theme: {
    primary: string;
    primaryGlow: string;
    accent: string;
    bgGradient: string;
    cardBg: string;
    borderColor: string;
    textColor: string;
    ambientSound: 'cyber_hum' | 'ticker_market' | 'rain_lofi' | 'binaural_focus' | 'stealth_radar';
  };
  targetRole: string;
  targetCompany: string;
  targetOfferDate: string; // ISO string e.g. "2026-12-15T18:00:00"
  targetOfferDateEnd?: string;
  readinessScore: number; // 0 - 100
  streakDays: number;
  compensation: CompensationPackage;
  milestones: Milestone[];
  interviewPipeline: InterviewRound[];
  dailyGoals: DailyGoal[];
  customMetrics: {
    label: string;
    current: number;
    target: number;
    unit: string;
  }[];
  quotes: string[];
  notes: string;
  // Specific data fields
  specializedData: Record<string, any>;
}

export interface AppSettings {
  timeFormat: '12h' | '24h';
  soundEnabled: boolean;
  soundVolume: number;
  currentSoundTheme: 'cyber_hum' | 'ticker_market' | 'rain_lofi' | 'binaural_focus' | 'stealth_radar' | 'none';
  vibrationOnMilestone: boolean;
  showMilliseconds: boolean;
  activeExperienceId: ExperienceId | 'overview';
  isLockScreenActive: boolean;
  zenMode: boolean;
}
