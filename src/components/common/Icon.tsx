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
  Target,
  Heart,
  Smile,
  Star,
  Sun,
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
  ChevronUp,
  HelpCircle,
  Info,
  MessageSquare,
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
  CalendarCheck,
  GraduationCap,
  ArrowLeftRight,
  LayoutDashboard,
  User,
  Users,
  UserCheck,
  UserPlus,
  Contact,
  BadgeCheck,
  Laptop,
  Headphones,
  BookOpen,
  Bell,
  Shuffle,
  Search,
  Filter,
  Share2,
  CheckSquare,
  Fingerprint,
  Key,
  KeyRound,
  ShieldCheck,
  LogIn,
  LogOut,
  Mail,
  TrendingDown,
  Gauge,
  LineChart,
  Percent,
  Shield,
  Workflow,
  SlidersHorizontal,
  Grid,
  LucideProps,
} from 'lucide-react';

export type IconName =
  | 'Cpu'
  | 'TrendingUp'
  | 'TrendingDown'
  | 'Gauge'
  | 'LineChart'
  | 'Percent'
  | 'Shield'
  | 'Workflow'
  | 'SlidersHorizontal'
  | 'Grid'
  | 'Rocket'
  | 'Compass'
  | 'ShieldAlert'
  | 'Briefcase'
  | 'Terminal'
  | 'Activity'
  | 'Layers'
  | 'Sparkles'
  | 'Target'
  | 'Heart'
  | 'Smile'
  | 'Star'
  | 'Sun'
  | 'Lock'
  | 'Unlock'
  | 'Volume2'
  | 'VolumeX'
  | 'CalendarCheck'
  | 'GraduationCap'
  | 'ArrowLeftRight'
  | 'LayoutDashboard'
  | 'calendar-check'
  | 'briefcase-business'
  | 'code'
  | 'graduation-cap'
  | 'arrow-left-right'
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
  | 'ChevronUp'
  | 'HelpCircle'
  | 'Info'
  | 'MessageSquare'
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
  | 'Layout'
  | 'User'
  | 'Users'
  | 'UserCheck'
  | 'UserPlus'
  | 'Contact'
  | 'BadgeCheck'
  | 'Laptop'
  | 'Headphones'
  | 'BookOpen'
  | 'Bell'
  | 'Shuffle'
  | 'Search'
  | 'Filter'
  | 'Share2'
  | 'CheckSquare'
  | 'Fingerprint'
  | 'Key'
  | 'KeyRound'
  | 'ShieldCheck'
  | 'LogIn'
  | 'LogOut'
  | 'Mail';

const ICON_MAP: Record<IconName, React.ComponentType<LucideProps>> = {
  Cpu,
  TrendingUp,
  TrendingDown,
  Gauge,
  LineChart,
  Percent,
  Shield,
  Workflow,
  SlidersHorizontal,
  Grid,
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
  Target,
  Heart,
  Smile,
  Star,
  Sun,
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
  ChevronUp,
  HelpCircle,
  Info,
  MessageSquare,
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
  CalendarCheck,
  GraduationCap,
  ArrowLeftRight,
  LayoutDashboard,
  User,
  Users,
  UserCheck,
  UserPlus,
  Contact,
  BadgeCheck,
  Laptop,
  Headphones,
  BookOpen,
  Bell,
  Shuffle,
  Search,
  Filter,
  Share2,
  CheckSquare,
  Fingerprint,
  Key,
  KeyRound,
  ShieldCheck,
  LogIn,
  LogOut,
  Mail,
  'calendar-check': CalendarCheck,
  'briefcase-business': Briefcase,
  'code': Code,
  'graduation-cap': GraduationCap,
  'arrow-left-right': ArrowLeftRight,
};

import { EXTENDED_ICON_REGISTRY } from '../icons';

interface IconProps extends LucideProps {
  name: IconName | string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const normalizedKey = typeof name === 'string' ? name.toLowerCase() : '';
  const ExtendedComponent = EXTENDED_ICON_REGISTRY[name] || EXTENDED_ICON_REGISTRY[normalizedKey];

  if (ExtendedComponent) {
    return <ExtendedComponent {...(props as any)} />;
  }

  const Component = ICON_MAP[name as IconName] || Briefcase;
  return <Component {...props} />;
};

