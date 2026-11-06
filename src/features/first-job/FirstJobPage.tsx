import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { TrackHeader } from '../../components/layout/TrackHeader';
import { TrackRoadmap } from '../../components/layout/TrackRoadmap';
import { CyberTacticalOps } from '../../components/experiences/CyberTacticalOps';

export const FirstJobPage: React.FC = () => {
  const { experiences, updateExperience, openLockScreen } = useAppStore();
  const track = experiences.find((e) => e.id === 'first-job') || experiences[4];

  return (
    <div className="space-y-8 animate-fadeIn">
      <TrackHeader
        experience={track}
        onUpdateExperience={updateExperience}
        onLaunchLockScreen={() => openLockScreen('first-job')}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Tactical Defense & Offer Leverage Matrix</span>
        </h2>
        <CyberTacticalOps experience={track} onUpdateExperience={updateExperience} />
      </section>

      <TrackRoadmap experience={track} onUpdateExperience={updateExperience} />
    </div>
  );
};
