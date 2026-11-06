import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { TrackHeader } from '../../components/layout/TrackHeader';
import { TrackRoadmap } from '../../components/layout/TrackRoadmap';
import { NomadTimezoneBudget } from '../../components/experiences/NomadTimezoneBudget';

export const CareerSwitchPage: React.FC = () => {
  const { experiences, updateExperience, openLockScreen } = useAppStore();
  const track = experiences.find((e) => e.id === 'career-switch') || experiences[3];

  return (
    <div className="space-y-8 animate-fadeIn">
      <TrackHeader
        experience={track}
        onUpdateExperience={updateExperience}
        onLaunchLockScreen={() => openLockScreen('career-switch')}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Global Autonomy & Geo-Arbitrage Workstation</span>
        </h2>
        <NomadTimezoneBudget experience={track} onUpdateExperience={updateExperience} />
      </section>

      <TrackRoadmap experience={track} onUpdateExperience={updateExperience} />
    </div>
  );
};

