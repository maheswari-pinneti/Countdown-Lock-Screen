import React from 'react';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  moduleName: string;
  isCompleted: boolean;
  isExpired: boolean;
  completionPercentage: number;
  completedMilestonesCount: number;
  totalMilestonesCount: number;
  onReset: () => void;
  onLaunchLockScreen: () => void;
  themeColor?: string;
}

export const ModuleCompletionBanner: React.FC<Props> = ({
  moduleName,
  isCompleted,
  isExpired,
  completionPercentage,
  completedMilestonesCount,
  totalMilestonesCount,
  onReset,
  onLaunchLockScreen,
  themeColor = '#06b6d4',
}) => {
  if (!isCompleted && !isExpired && completionPercentage < 100) {
    return null;
  }

  const handleCelebrate = () => {
    soundEngine.playSuccessChime();
  };

  return (
    <div
      className="p-6 md:p-8 rounded-3xl border relative overflow-hidden backdrop-blur-xl animate-in fade-in duration-300"
      style={{
        backgroundColor: '#0a0d14',
        borderColor: `${themeColor}60`,
        boxShadow: `0 0 60px ${themeColor}20`,
      }}
    >
      <div
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
        style={{ backgroundColor: themeColor }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <Icon name="Award" className="w-4 h-4" />
            <span>
              {completionPercentage >= 100
                ? 'All Milestones Achieved!'
                : 'Target Deadline Reached'}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {completionPercentage >= 100
              ? `Congratulations! ${moduleName} is 100% Complete`
              : `${moduleName} Deadline Reached`}
          </h3>

          <p className="text-sm text-zinc-300 max-w-xl">
            {completionPercentage >= 100
              ? `You have executed all ${totalMilestonesCount} key milestones with full precision. You are in peak Offer Mode.`
              : `Your scheduled sprint deadline has arrived with ${completedMilestonesCount} of ${totalMilestonesCount} milestones completed.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            size="md"
            variant="secondary"
            iconLeft="RotateCcw"
            onClick={() => {
              if (window.confirm(`Reset ${moduleName} to its preset milestones and default timeline?`)) {
                onReset();
              }
            }}
          >
            Reset Module
          </Button>

          <Button
            size="md"
            iconLeft="Lock"
            onClick={() => {
              handleCelebrate();
              onLaunchLockScreen();
            }}
            style={{
              backgroundColor: themeColor,
              color: '#000',
              boxShadow: `0 0 25px ${themeColor}60`,
            }}
          >
            Launch Celebration Lock
          </Button>
        </div>
      </div>
    </div>
  );
};

