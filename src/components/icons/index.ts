import React from 'react';
import { CustomIconProps } from './SimpleIcons';

export * from './SimpleIcons';
export * from './FontAwesomeIcons';
export * from './BootstrapIcons';
export * from './NounProjectIcons';
export * from './MaterialIcons';
export * from './Icons8Icons';
export * from './FlaticonIcons';

import {
  SiGithub,
  SiGoogle,
  SiLinkedin,
  SiX,
  SiReact,
  SiTypescript,
  SiPython,
  SiDocker,
  SiAws,
  SiFigma,
  SiSlack,
  SiNotion,
  SiLeetcode,
} from './SimpleIcons';

import {
  FaBriefcase,
  FaGraduationCap,
  FaTrophy,
  FaBullseye,
  FaMugHot,
  FaHandshake,
} from './FontAwesomeIcons';

import {
  BiBootstrap,
  BiKanban,
  BiDiagram3,
  BiLightningCharge,
  BiWallet2,
} from './BootstrapIcons';

import {
  NounTarget,
  NounMountain,
  NounGrowth,
  NounBalance,
} from './NounProjectIcons';

import {
  MaterialWork,
  MaterialSchedule,
  MaterialVerified,
  MaterialSavings,
  MaterialMood,
  MaterialWaterDrop,
} from './MaterialIcons';

import {
  Icons8Resume,
  Icons8Interview,
  Icons8Contract,
  Icons8MoneyBag,
} from './Icons8Icons';

import {
  FlaticonMeditation,
  FlaticonSleep,
  FlaticonExercise,
  FlaticonAirplane,
  FlaticonGratitude,
} from './FlaticonIcons';

// Comprehensive Cross-Library Icon Registry
export const EXTENDED_ICON_REGISTRY: Record<string, React.FC<CustomIconProps>> = {
  // Simple Icons (Brand & Tech)
  'si-github': SiGithub,
  'github': SiGithub,
  'si-google': SiGoogle,
  'google': SiGoogle,
  'si-linkedin': SiLinkedin,
  'linkedin': SiLinkedin,
  'si-x': SiX,
  'twitter': SiX,
  'x': SiX,
  'si-react': SiReact,
  'react': SiReact,
  'si-typescript': SiTypescript,
  'typescript': SiTypescript,
  'si-python': SiPython,
  'python': SiPython,
  'si-docker': SiDocker,
  'docker': SiDocker,
  'si-aws': SiAws,
  'aws': SiAws,
  'si-figma': SiFigma,
  'figma': SiFigma,
  'si-slack': SiSlack,
  'slack': SiSlack,
  'si-notion': SiNotion,
  'notion': SiNotion,
  'si-leetcode': SiLeetcode,
  'leetcode': SiLeetcode,

  // Font Awesome Style
  'fa-briefcase': FaBriefcase,
  'fa-graduation-cap': FaGraduationCap,
  'fa-trophy': FaTrophy,
  'fa-bullseye': FaBullseye,
  'fa-mug-hot': FaMugHot,
  'coffee': FaMugHot,
  'fa-handshake': FaHandshake,

  // Bootstrap Icons Style
  'bi-bootstrap': BiBootstrap,
  'bootstrap': BiBootstrap,
  'bi-kanban': BiKanban,
  'kanban': BiKanban,
  'bi-diagram3': BiDiagram3,
  'architecture': BiDiagram3,
  'bi-lightning-charge': BiLightningCharge,
  'bi-wallet2': BiWallet2,

  // The Noun Project Style
  'noun-target': NounTarget,
  'noun-mountain': NounMountain,
  'summit': NounMountain,
  'noun-growth': NounGrowth,
  'noun-balance': NounBalance,

  // Google Fonts & Material Symbols
  'material-work': MaterialWork,
  'material-schedule': MaterialSchedule,
  'material-verified': MaterialVerified,
  'material-savings': MaterialSavings,
  'material-mood': MaterialMood,
  'material-water-drop': MaterialWaterDrop,
  'water': MaterialWaterDrop,

  // Icons8 Style
  'icons8-resume': Icons8Resume,
  'resume': Icons8Resume,
  'icons8-interview': Icons8Interview,
  'icons8-contract': Icons8Contract,
  'contract': Icons8Contract,
  'icons8-money-bag': Icons8MoneyBag,

  // Flaticon Style
  'flaticon-meditation': FlaticonMeditation,
  'meditation': FlaticonMeditation,
  'flaticon-sleep': FlaticonSleep,
  'sleep': FlaticonSleep,
  'flaticon-exercise': FlaticonExercise,
  'workout': FlaticonExercise,
  'flaticon-airplane': FlaticonAirplane,
  'travel': FlaticonAirplane,
  'flaticon-gratitude': FlaticonGratitude,
  'gratitude': FlaticonGratitude,
};
