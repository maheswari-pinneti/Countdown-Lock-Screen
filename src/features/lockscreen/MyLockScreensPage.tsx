import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { soundEngine } from '../../services/soundEngine';
import { downloadWallpaperPng } from '../../utils/wallpaperGenerator';
import { formatDisplayDate } from '../../utils/date';

export const MyLockScreensPage: React.FC = () => {
  const { experiences, openLockScreen, settings, updateSettings } = useAppStore();

  const handleDownloadWallpaper = async (exp: any) => {
    soundEngine.playKeyClick();
    const completedCount = exp.milestones.filter((m: any) => m.completed).length;
    const diffDays = Math.max(
      0,
      Math.ceil((new Date(exp.targetOfferDate).getTime() - Date.now()) / (86400 * 1000))
    );
    const progressPct =
      exp.milestones.length > 0
        ? Math.round((completedCount / exp.milestones.length) * 100)
        : 50;

    await downloadWallpaperPng({
      themeId: exp.id === 'interview' ? 'midnight' : exp.id === 'job-hunt' ? 'electric' : exp.id === 'first-job' ? 'focus' : 'obsidian',
      aspectRatio: '9:16',
      typographySize: 'large',
      backgroundStyle: 'mesh',
      accentColor: exp.theme.primary,
      topLabel: `${exp.badge} • Offer Mode`,
      title: exp.name,
      subtitle: `${exp.targetRole} • ${exp.targetCompany}`,
      countdownNumber: diffDays,
      countdownUnit: diffDays === 1 ? 'Day Remaining' : 'Days Remaining',
      deadlineInfo: `Target Date: ${formatDisplayDate(exp.targetOfferDate)}`,
      progressPercentage: progressPct,
      showProgressBar: true,
      priorityMilestone: exp.milestones[0]
        ? { title: exp.milestones[0].title, priority: exp.milestones[0].priority || 'high', dueDate: exp.milestones[0].dueDate || exp.milestones[0].deadline }
        : undefined,
      shortMilestones: exp.milestones.slice(1, 4).map((m: any) => m.title),
      showMilestones: true,
      motivationalQuote: exp.motivationalMessage || exp.quotes[0] || 'Every deadline deserves a plan.',
      showQuote: true,
    });
    soundEngine.playSuccessChime();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2.5 font-display">
            <Icon name="Clock" className="w-7 h-7 text-indigo-400" />
            <span>My Countdowns & Lock Screens</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active career countdown workstations, deadline progress trackers, and ambient lock screen displays.
          </p>
        </div>

        <Button
          size="md"
          variant="gradient"
          iconLeft="Maximize"
          onClick={() => {
            soundEngine.playSuccessChime();
            openLockScreen('developer');
          }}
        >
          Launch Primary Lock Screen
        </Button>
      </div>

      {/* Lock Screens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <Card
            key={exp.id}
            accentColor={exp.theme.primary}
            hoverGlow
            className="flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge
                  label={exp.badge}
                  icon={exp.icon}
                  variant="zinc"
                  style={{
                    backgroundColor: `${exp.theme.primary}15`,
                    borderColor: `${exp.theme.primary}40`,
                    color: exp.theme.primary,
                  }}
                />
                <span className="text-xs text-slate-400 font-medium">
                  {exp.streakDays}-day streak
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{exp.name}</h3>
              <p className="text-xs text-slate-400 mb-4">{exp.tagline}</p>

              {/* Mini Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1 mb-4 backdrop-blur-md">
                <div className="text-xs text-slate-400 font-medium">
                  Target: {formatDisplayDate(exp.targetOfferDate)}
                </div>
                <div className="text-lg font-bold text-white">
                  {exp.targetRole}
                </div>
                <div className="text-xs font-semibold" style={{ color: exp.theme.primary }}>
                  {exp.targetCompany}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <Button
                size="sm"
                iconLeft="Lock"
                onClick={() => {
                  soundEngine.playSuccessChime();
                  openLockScreen(exp.id);
                }}
                className="flex-1 font-semibold text-xs"
                style={{
                  backgroundColor: `${exp.theme.primary}20`,
                  borderColor: `${exp.theme.primary}40`,
                  color: exp.theme.primary,
                }}
              >
                Launch Lock Screen
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Shortcuts & Guide Card */}
      <Card className="border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
            <Icon name="Sparkles" className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold text-sm text-white">Pro Setup: Secondary Display Mode</h4>
            <p className="text-slate-400 leading-relaxed font-normal">
              Open Offer Mode on your secondary desk monitor, press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">F</kbd> for fullscreen, and hit <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Space</kbd> to toggle Zen Mode. You will have a live, non-distracting visual goal anchor running continuously.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};


