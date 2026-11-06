import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { TrackHeader } from '../../components/layout/TrackHeader';
import { TrackRoadmap } from '../../components/layout/TrackRoadmap';
import { SweTrackDetail } from '../../components/experiences/SweTrackDetail';

export const DeveloperPage: React.FC = () => {
  const { experiences, updateExperience, openLockScreen } = useAppStore();
  const track = experiences.find((e) => e.id === 'developer') || experiences[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      <TrackHeader
        experience={track}
        onUpdateExperience={updateExperience}
        onLaunchLockScreen={() => openLockScreen('developer')}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Algorithmic & Distributed Systems Workstation</span>
        </h2>
        <SweTrackDetail experience={track} onUpdateExperience={updateExperience} />
      </section>

      <TrackRoadmap experience={track} onUpdateExperience={updateExperience} />
    </div>
  );
};
