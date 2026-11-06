import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { TrackHeader } from '../../components/layout/TrackHeader';
import { TrackRoadmap } from '../../components/layout/TrackRoadmap';
import { QuantSpeedMath } from '../../components/experiences/QuantSpeedMath';

export const InterviewPage: React.FC = () => {
  const { experiences, updateExperience, openLockScreen } = useAppStore();
  const track = experiences.find((e) => e.id === 'interview') || experiences[1];

  return (
    <div className="space-y-8 animate-fadeIn">
      <TrackHeader
        experience={track}
        onUpdateExperience={updateExperience}
        onLaunchLockScreen={() => openLockScreen('interview')}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>High-Stakes Superday & Speed Math Workstation</span>
        </h2>
        <QuantSpeedMath experience={track} onUpdateExperience={updateExperience} />
      </section>

      <TrackRoadmap experience={track} onUpdateExperience={updateExperience} />
    </div>
  );
};
