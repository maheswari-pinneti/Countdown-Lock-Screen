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
  Sparkles,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Flame,
  CheckCircle2,
  Circle,
  Calendar,
  DollarSign,
  Award,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Settings,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  Code,
  Code2,
  Sliders,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Check,
  X,
  AlertTriangle,
  AlertOctagon,
  Globe,
  MapPin,
  Clock,
  PieChart,
  Zap,
  Trophy,
  Crosshair,
  Trash2,
  Plus,
  Edit3,
  Save,
  Palette,
  Layout,
  LucideProps,
} from 'lucide-react';

export type IconName =
  | 'Cpu'
  | 'TrendingUp'
  | 'Rocket'
  | 'Compass'
  | 'ShieldAlert'
  | 'Briefcase'
  | 'Terminal'
  | 'Activity'
  | 'Layers'
  | 'Sparkles'
  | 'Lock'
  | 'Unlock'
  | 'Volume2'
  | 'VolumeX'
  | 'Maximize'
  | 'Minimize'
  | 'Flame'
  | 'CheckCircle2'
  | 'Circle'
  | 'Calendar'
  | 'DollarSign'
  | 'Award'
  | 'ChevronRight'
  | 'ChevronLeft'
  | 'ChevronDown'
  | 'Play'
  | 'Pause'
  | 'RotateCcw'
  | 'Settings'
  | 'ArrowRight'
  | 'ArrowUpRight'
  | 'BarChart3'
  | 'Brain'
  | 'Code'
  | 'Code2'
  | 'Sliders'
  | 'Download'
  | 'Upload'
  | 'RefreshCw'
  | 'Eye'
  | 'EyeOff'
  | 'ExternalLink'
  | 'FileText'
  | 'Check'
  | 'X'
  | 'AlertTriangle'
  | 'AlertOctagon'
  | 'Globe'
  | 'MapPin'
  | 'Clock'
  | 'PieChart'
  | 'Zap'
  | 'Trophy'
  | 'Crosshair'
  | 'Trash2'
  | 'Plus'
  | 'Edit3'
  | 'Save'
  | 'Palette'
  | 'Layout';

const ICON_MAP: Record<IconName, React.ComponentType<LucideProps>> = {
  Cpu,
  TrendingUp,
  Rocket,
  Compass,
  ShieldAlert,
  Briefcase,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Flame,
  CheckCircle2,
  Circle,
  Calendar,
  DollarSign,
  Award,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Settings,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  Code,
  Code2,
  Sliders,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Check,
  X,
  AlertTriangle,
  AlertOctagon,
  Globe,
  MapPin,
  Clock,
  PieChart,
  Zap,
  Trophy,
  Crosshair,
  Trash2,
  Plus,
  Edit3,
  Save,
  Palette,
  Layout,
};

interface IconProps extends LucideProps {
  name: IconName | string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const Component = ICON_MAP[name as IconName] || Briefcase;
  return <Component {...props} />;
};
