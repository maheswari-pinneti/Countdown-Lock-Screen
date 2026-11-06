import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { TrackHeader } from '../../components/layout/TrackHeader';
import { TrackRoadmap } from '../../components/layout/TrackRoadmap';
import { FounderRunwayCalc } from '../../components/experiences/FounderRunwayCalc';

export const JobHuntPage: React.FC = () => {
  const { experiences, updateExperience, openLockScreen } = useAppStore();
  const track = experiences.find((e) => e.id === 'job-hunt') || experiences[2];

  return (
    <div className="space-y-8 animate-fadeIn">
      <TrackHeader
        experience={track}
        onUpdateExperience={updateExperience}
        onLaunchLockScreen={() => openLockScreen('job-hunt')}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Capital Runway & Product Sprint Foundry</span>
        </h2>
        <FounderRunwayCalc experience={track} onUpdateExperience={updateExperience} />
      </section>

      <TrackRoadmap experience={track} onUpdateExperience={updateExperience} />
    </div>
  );
};

