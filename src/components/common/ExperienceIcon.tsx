import React from 'react';
import {
  Cpu,
  TrendingUp,
  Rocket,
  Compass,
  ShieldAlert,
  Briefcase,
  Terminal,
  Activity,
  Layers,
  LucideProps
} from 'lucide-react';

interface Props extends LucideProps {
  name: string;
}

export const ExperienceIcon: React.FC<Props> = ({ name, ...props }) => {
  switch (name) {
    case 'Cpu':
      return <Cpu {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Rocket':
      return <Rocket {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'Terminal':
      return <Terminal {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    default:
      return <Briefcase {...props} />;
  }
};

