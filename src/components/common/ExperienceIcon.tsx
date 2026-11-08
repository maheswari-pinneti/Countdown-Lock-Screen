import React from 'react';
import { EXTENDED_ICON_REGISTRY } from '../icons';
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
  CalendarCheck,
  Code,
  GraduationCap,
  ArrowLeftRight,
  Target,
  Sparkles,
  Flame,
  Award,
  Clock,
  LucideProps
} from 'lucide-react';

interface Props extends LucideProps {
  name: string;
}

export const ExperienceIcon: React.FC<Props> = ({ name, ...props }) => {
  switch (name) {
    case 'calendar-check':
    case 'CalendarCheck':
      return <CalendarCheck {...props} />;
    case 'briefcase-business':
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'code':
    case 'Code':
      return <Code {...props} />;
    case 'graduation-cap':
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'arrow-left-right':
    case 'ArrowLeftRight':
      return <ArrowLeftRight {...props} />;
    case 'Target':
      return <Target {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    case 'Award':
      return <Award {...props} />;
    case 'Clock':
      return <Clock {...props} />;
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
    default: {
      const ExtendedComponent = EXTENDED_ICON_REGISTRY[name] || EXTENDED_ICON_REGISTRY[name.toLowerCase()];
      if (ExtendedComponent) {
        return <ExtendedComponent {...(props as any)} />;
      }
      return <Briefcase {...props} />;
    }
  }
};
