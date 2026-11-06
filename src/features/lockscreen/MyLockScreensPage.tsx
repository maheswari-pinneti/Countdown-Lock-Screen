import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { soundEngine } from '../../services/soundEngine';

export const MyLockScreensPage: React.FC = () => {
  const { experiences, openLockScreen, settings, updateSettings } = useAppStore();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Icon name="Lock" className="w-7 h-7 text-cyan-400" />
            <span>My Lock Screens</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Turn your laptop, iPad, or secondary monitor into a continuous, high-status countdown workstation.
          </p>
        </div>

        <Button
          size="md"
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
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  Sound: {exp.theme.ambientSound}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{exp.name}</h3>
              <p className="text-xs text-zinc-400 mb-4">{exp.tagline}</p>

              {/* Mini Preview Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 text-center font-mono space-y-1 mb-4">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Target: {new Date(exp.targetOfferDate).toLocaleDateString()}
                </div>
                <div className="text-xl font-black text-white">
                  {exp.targetRole}
                </div>
                <div className="text-xs font-semibold" style={{ color: exp.theme.primary }}>
                  {exp.targetCompany}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
              <Button
                size="sm"
                iconLeft="Lock"
                onClick={() => {
                  soundEngine.playSuccessChime();
                  openLockScreen(exp.id);
                }}
                className="flex-1"
                style={{
                  backgroundColor: `${exp.theme.primary}20`,
                  borderColor: `${exp.theme.primary}40`,
                  color: exp.theme.primary,
                }}
              >
                Launch Workstation
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Shortcuts & Guide Card */}
      <Card className="border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-black to-slate-950">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Icon name="Sparkles" className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-sm text-white">Pro Setup: Secondary Display Mode</h4>
            <p className="text-zinc-400 leading-relaxed">
              Open OFFER MODE on your secondary desk monitor, press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200">F</kbd> for fullscreen, and hit <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200">Space</kbd> to toggle Zen Mode. You will have a live, non-distracting visual goal anchor running continuously.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
