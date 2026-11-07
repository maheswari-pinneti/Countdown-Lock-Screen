import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { soundEngine } from '../../services/soundEngine';
import { useAppStore } from '../../store/AppContext';
import { ExperienceTrackId } from '../../types';

export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  department: 'Engineering' | 'Product' | 'Campus & Junior' | 'Career Pivot' | 'Cloud & DevOps';
  level: string;
  targetCompany: string;
  targetDate: string;
  daysRemaining: number;
  salaryTarget: string;
  trackId: ExperienceTrackId;
  iconName: string;
  iconBg: string;
  iconColor: string;
  skills: string[];
  bio: string;
}

export const EMPLOYEE_PROFILES: EmployeeProfile[] = [
  {
    id: 'emp-1',
    name: 'Alex Rivera',
    role: 'Senior Full Stack Engineer',
    department: 'Engineering',
    level: 'Senior / L5',
    targetCompany: 'Stripe & Linear',
    targetDate: 'Nov 28, 2026',
    daysRemaining: 24,
    salaryTarget: '$220,000 Base',
    trackId: 'interview',
    iconName: 'Code2',
    iconBg: 'bg-amber-950/60 border-amber-500/40 text-amber-400',
    iconColor: '#ff9900',
    skills: ['React 19', 'TypeScript', 'Distributed Caching', 'Node.js'],
    bio: 'Preparing for technical panel and system architecture rounds with high-concurrency microservices.',
  },
  {
    id: 'emp-2',
    name: 'Marcus Vance',
    role: 'Staff Distributed Systems Architect',
    department: 'Engineering',
    level: 'Staff / L6',
    targetCompany: 'Google Core Architecture',
    targetDate: 'Jan 05, 2027',
    daysRemaining: 39,
    salaryTarget: '$485,000 TC',
    trackId: 'developer',
    iconName: 'Cpu',
    iconBg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400',
    iconColor: '#22c55e',
    skills: ['Raft Consensus', 'Go', 'Kubernetes Internals', 'Multi-Region Sharding'],
    bio: 'Leveling up distributed consensus protocols, monotonic data structures, and staff engineering trade-offs.',
  },
  {
    id: 'emp-3',
    name: 'Priya Sharma',
    role: 'Associate Software Engineer',
    department: 'Campus & Junior',
    level: 'Entry-Level / L3',
    targetCompany: 'Microsoft & Cisco Campus',
    targetDate: 'Dec 22, 2026',
    daysRemaining: 46,
    salaryTarget: '$140,000 Base',
    trackId: 'first-job',
    iconName: 'GraduationCap',
    iconBg: 'bg-red-950/60 border-red-500/40 text-red-400',
    iconColor: '#ef4444',
    skills: ['Core Java', 'Data Structures', 'SQL', 'Git CI/CD'],
    bio: 'Campus senior preparing placement drive coding rounds, aptitude accuracy, and first-day onboarding essentials.',
  },
  {
    id: 'emp-4',
    name: 'Elena Rostova',
    role: 'Active 30-Day Sprint Engineer',
    department: 'Engineering',
    level: 'Mid-Senior / L4-L5',
    targetCompany: 'Tier-1 High Growth Tech',
    targetDate: 'Dec 01, 2026',
    daysRemaining: 26,
    salaryTarget: '$185,000 Base',
    trackId: 'job-hunt',
    iconName: 'Briefcase',
    iconBg: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400',
    iconColor: '#06b6d4',
    skills: ['Full Stack Web', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
    bio: 'Executing 3 applications/day target, LinkedIn engineering manager sequences, and competing offer leverage.',
  },
  {
    id: 'emp-5',
    name: 'David Okafor',
    role: 'Principal Cloud & Solutions Architect',
    department: 'Career Pivot',
    level: 'Lead / Principal',
    targetCompany: 'AWS Partner Ecosystem',
    targetDate: 'Feb 04, 2027',
    daysRemaining: 55,
    salaryTarget: '$195,000 Base',
    trackId: 'career-switch',
    iconName: 'Shuffle',
    iconBg: 'bg-teal-950/60 border-teal-500/40 text-teal-400',
    iconColor: '#10b981',
    skills: ['Terraform', 'Multi-Cloud AWS/GCP', 'Docker', 'System Bridge'],
    bio: 'Transitioning 10+ years of legacy IT operations into modern cloud architecture with capstone Terraform projects.',
  },
  {
    id: 'emp-6',
    name: 'Samantha Wu',
    role: 'Senior Product & Platform Strategist',
    department: 'Product',
    level: 'Senior PM',
    targetCompany: 'Figma & Vercel',
    targetDate: 'Dec 15, 2026',
    daysRemaining: 34,
    salaryTarget: '$210,000 Base',
    trackId: 'interview',
    iconName: 'BarChart3',
    iconBg: 'bg-purple-950/60 border-purple-500/40 text-purple-400',
    iconColor: '#c084fc',
    skills: ['Product Sense', 'Metric Frameworks', 'System Design Trade-offs', 'A/B Testing'],
    bio: 'Preparing executive product design presentations, North Star metric teardowns, and leadership interviews.',
  },
  {
    id: 'emp-7',
    name: 'Jordan Miller',
    role: 'DevOps & Site Reliability Engineer',
    department: 'Cloud & DevOps',
    level: 'Senior SRE',
    targetCompany: 'Datadog & Cloudflare',
    targetDate: 'Jan 18, 2027',
    daysRemaining: 48,
    salaryTarget: '$205,000 Base',
    trackId: 'developer',
    iconName: 'Globe',
    iconBg: 'bg-blue-950/60 border-blue-500/40 text-blue-400',
    iconColor: '#38bdf8',
    skills: ['eBPF Observability', 'Prometheus', 'Terraform', 'Incident Triage'],
    bio: 'Hardening multi-cloud disaster recovery runbooks, zero-downtime blue/green rollouts, and p99 SLO monitoring.',
  },
  {
    id: 'emp-8',
    name: 'Chloe Tremblay',
    role: 'Design Systems & Frontend Architect',
    department: 'Engineering',
    level: 'Staff / L6',
    targetCompany: 'Airbnb & Linear',
    targetDate: 'Dec 30, 2026',
    daysRemaining: 37,
    salaryTarget: '$230,000 Base',
    trackId: 'developer',
    iconName: 'Palette',
    iconBg: 'bg-pink-950/60 border-pink-500/40 text-pink-400',
    iconColor: '#f472b6',
    skills: ['Design Tokens', 'Web Components', 'Accessibility WCAG', 'Radix UI'],
    bio: 'Crafting micro-interactions, CSS subgrid architectures, and unified multi-brand token registries.',
  },
];

export const EmployeeDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { openLockScreen } = useAppStore();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = ['All', 'Engineering', 'Product', 'Campus & Junior', 'Career Pivot', 'Cloud & DevOps'];

  const filteredEmployees = EMPLOYEE_PROFILES.filter((emp) => {
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              Directory & Roles
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-xs text-zinc-400 font-mono">Route: /directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Icon name="Users" className="w-8 h-8 text-cyan-400" />
            <span>Employee & Career Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Browse employee roles, track sprint countdowns, review skill stacks, and launch lock-screen wallpaper presets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            iconLeft="Lock"
            onClick={() => {
              soundEngine.playSuccessChime();
              openLockScreen('developer');
            }}
          >
            Launch Lock Screen
          </Button>
          <Button
            size="sm"
            variant="secondary"
            iconLeft="Palette"
            onClick={() => {
              soundEngine.playKeyClick();
              navigate('/countdown-studio');
            }}
          >
            Studio
          </Button>
        </div>
      </div>

      {/* Employee Icon Palette Bar */}
      <div className="p-5 rounded-3xl bg-[#080D1A] border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.15)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Contact" className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Employee Role Icons & Specialties
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {EMPLOYEE_PROFILES.length} Verified Roles
          </span>
        </div>

        {/* Horizontal Icon Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {EMPLOYEE_PROFILES.map((emp) => (
            <div
              key={emp.id}
              onClick={() => {
                soundEngine.playKeyClick();
                setSearchQuery(emp.role);
              }}
              className="p-3 rounded-2xl bg-[#040711] border border-zinc-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col items-center text-center group"
              title={`Filter by ${emp.role}`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 border transition-transform group-hover:scale-110 ${emp.iconBg}`}
              >
                <Icon name={emp.iconName} className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white line-clamp-1">{emp.name}</span>
              <span className="text-[9px] text-zinc-400 line-clamp-1 font-mono">{emp.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Department Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => {
                soundEngine.playKeyClick();
                setSelectedDept(dept);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDept === dept
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-[#0F172A] border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Icon name="Search" className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, role, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A0F1D] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <Icon name="X" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <Card
            key={emp.id}
            accentColor={emp.iconColor}
            className="flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all bg-[#080D1A]"
          >
            <div>
              {/* Header with Employee Icon & Status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${emp.iconBg}`}
                  >
                    <Icon name={emp.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight leading-tight">
                      {emp.name}
                    </h3>
                    <div className="text-xs text-cyan-300 font-semibold">{emp.role}</div>
                  </div>
                </div>

                <Badge label={emp.level} variant="cyan" />
              </div>

              {/* Department & Sprint Deadline */}
              <div className="p-3 rounded-2xl bg-[#040711] border border-zinc-800 space-y-1.5 text-xs text-zinc-300 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-mono text-[11px]">Department:</span>
                  <span className="font-bold text-white">{emp.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-mono text-[11px]">Target Company:</span>
                  <span className="font-bold text-amber-400">{emp.targetCompany}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-mono text-[11px]">Target Salary:</span>
                  <span className="font-mono font-bold text-emerald-400">{emp.salaryTarget}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                  <span className="text-zinc-500 font-mono text-[11px]">Sprint Deadline:</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {emp.daysRemaining} Days Left ({emp.targetDate})
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3">
                {emp.bio}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {emp.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-4">
              <Button
                size="sm"
                iconLeft="Calendar"
                onClick={() => {
                  soundEngine.playSuccessChime();
                  navigate(`/${emp.trackId}`);
                }}
              >
                Open Sprint
              </Button>

              <button
                onClick={() => {
                  soundEngine.playKeyClick();
                  openLockScreen(emp.trackId);
                }}
                className="p-2 rounded-xl text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Preview Employee Lock Screen"
              >
                <Icon name="Lock" className="w-3.5 h-3.5" />
                <span>Lock Screen</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

