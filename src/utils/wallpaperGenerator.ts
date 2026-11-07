import type { Milestone } from '../types';

export type WallpaperThemeId =
  | 'minimal-focus'
  | 'dark-premium'
  | 'motivational-career'
  | 'soft-gradient'
  | 'clean-professional'
  // Legacy aliases
  | 'midnight'
  | 'obsidian'
  | 'electric'
  | 'minimal-light'
  | 'focus';

export type WallpaperAspectRatio = '9:16' | '9:19.5' | '9:20';
export type WallpaperTypographySize = 'standard' | 'large' | 'xlarge';
export type WallpaperBackgroundStyle = 'gradient' | 'solid' | 'mesh' | 'grid';
export type GoogleFontOption = 'jakarta' | 'space' | 'mono' | 'outfit' | 'sora' | 'inter';

export interface WallpaperPriorityMilestone {
  title: string;
  priority: string;
  dueDate?: string;
}

export interface WallpaperConfig {
  themeId: WallpaperThemeId;
  aspectRatio: WallpaperAspectRatio;
  typographySize: WallpaperTypographySize;
  backgroundStyle: WallpaperBackgroundStyle;
  fontFamily?: GoogleFontOption;
  accentColor?: string;
  topLabel?: string;
  title: string;
  subtitle: string;
  countdownNumber: string | number;
  countdownUnit: string;
  deadlineInfo: string;
  progressPercentage: number;
  showProgressBar: boolean;
  priorityMilestone?: WallpaperPriorityMilestone;
  shortMilestones?: string[];
  showMilestones: boolean;
  motivationalQuote: string;
  showQuote: boolean;
  showClockSafeGuide?: boolean;
}

export interface ThemeColors {
  name: string;
  description: string;
  bgStart: string;
  bgEnd: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
  progressBg: string;
  progressFill: string;
  signatureColor: string;
  hasGrid?: boolean;
  hasGlow?: boolean;
}

export const THEME_PRESETS: Record<WallpaperThemeId, ThemeColors> = {
  'minimal-focus': {
    name: 'MINIMAL FOCUS',
    description: 'Clean monochrome aesthetic with large centered countdown and zero clutter',
    bgStart: '#0f1117',
    bgEnd: '#090a0f',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    accent: '#38bdf8',
    cardBg: 'rgba(56, 189, 248, 0.05)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
    progressBg: 'rgba(255, 255, 255, 0.1)',
    progressFill: '#38bdf8',
    signatureColor: '#94a3b8',
    hasGlow: false,
  },
  'dark-premium': {
    name: 'DARK PREMIUM',
    description: 'Deep obsidian carbon with metallic gold & silver executive accents',
    bgStart: '#000000',
    bgEnd: '#08080a',
    textPrimary: '#ffffff',
    textSecondary: '#fbbf24',
    textMuted: '#a1a1aa',
    accent: '#f59e0b',
    cardBg: 'rgba(245, 158, 11, 0.08)',
    cardBorder: 'rgba(245, 158, 11, 0.3)',
    progressBg: 'rgba(255, 255, 255, 0.1)',
    progressFill: '#fbbf24',
    signatureColor: '#fbbf24',
    hasGlow: true,
  },
  'motivational-career': {
    name: 'MOTIVATIONAL CAREER',
    description: 'Energetic cyber cyan and electric blue gradient with bold career milestones',
    bgStart: '#020b1f',
    bgEnd: '#04132e',
    textPrimary: '#ffffff',
    textSecondary: '#38bdf8',
    textMuted: '#7dd3fc',
    accent: '#00f0ff',
    cardBg: 'rgba(0, 240, 255, 0.1)',
    cardBorder: 'rgba(0, 240, 255, 0.4)',
    progressBg: 'rgba(0, 240, 255, 0.15)',
    progressFill: '#00f0ff',
    signatureColor: '#00f0ff',
    hasGrid: true,
    hasGlow: true,
  },
  'soft-gradient': {
    name: 'SOFT GRADIENT',
    description: 'Lush twilight violet to midnight indigo pastel gradient with frosted glass cards',
    bgStart: '#1e1035',
    bgEnd: '#0a0a1f',
    textPrimary: '#ffffff',
    textSecondary: '#c084fc',
    textMuted: '#a78bfa',
    accent: '#c084fc',
    cardBg: 'rgba(192, 132, 252, 0.12)',
    cardBorder: 'rgba(192, 132, 252, 0.35)',
    progressBg: 'rgba(255, 255, 255, 0.15)',
    progressFill: '#a855f7',
    signatureColor: '#e9d5ff',
    hasGlow: true,
  },
  'clean-professional': {
    name: 'CLEAN PROFESSIONAL',
    description: 'Crisp corporate layout with cobalt blue accents and high-contrast typography',
    bgStart: '#0b1329',
    bgEnd: '#030712',
    textPrimary: '#ffffff',
    textSecondary: '#60a5fa',
    textMuted: '#94a3b8',
    accent: '#2563eb',
    cardBg: 'rgba(37, 99, 235, 0.1)',
    cardBorder: 'rgba(37, 99, 235, 0.35)',
    progressBg: 'rgba(255, 255, 255, 0.12)',
    progressFill: '#3b82f6',
    signatureColor: '#60a5fa',
    hasGlow: false,
  },

  // Aliases for backwards compatibility:
  midnight: {
    name: 'MIDNIGHT',
    description: 'Dark navy background with cyan typography & minimal luxury feel',
    bgStart: '#060d1a',
    bgEnd: '#020612',
    textPrimary: '#ffffff',
    textSecondary: '#67e8f9',
    textMuted: '#94a3b8',
    accent: '#06b6d4',
    cardBg: 'rgba(6, 182, 212, 0.08)',
    cardBorder: 'rgba(6, 182, 212, 0.25)',
    progressBg: 'rgba(255, 255, 255, 0.12)',
    progressFill: '#06b6d4',
    signatureColor: '#22d3ee',
    hasGlow: true,
  },
  obsidian: {
    name: 'OBSIDIAN',
    description: 'Deep pitch black with white typography and subtle metallic silver accents',
    bgStart: '#000000',
    bgEnd: '#0a0a0c',
    textPrimary: '#ffffff',
    textSecondary: '#e4e4e7',
    textMuted: '#71717a',
    accent: '#d4d4d8',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    progressBg: 'rgba(255, 255, 255, 0.1)',
    progressFill: '#f4f4f5',
    signatureColor: '#a1a1aa',
    hasGlow: false,
  },
  electric: {
    name: 'ELECTRIC',
    description: 'Futuristic dark blue with electric neon cyan and geometric cyber details',
    bgStart: '#020b1f',
    bgEnd: '#04132e',
    textPrimary: '#ffffff',
    textSecondary: '#38bdf8',
    textMuted: '#7dd3fc',
    accent: '#00f0ff',
    cardBg: 'rgba(0, 240, 255, 0.1)',
    cardBorder: 'rgba(0, 240, 255, 0.4)',
    progressBg: 'rgba(0, 240, 255, 0.15)',
    progressFill: '#00f0ff',
    signatureColor: '#00f0ff',
    hasGrid: true,
    hasGlow: true,
  },
  'minimal-light': {
    name: 'MINIMAL LIGHT',
    description: 'Off-white background with crisp dark typography and soft grey accents',
    bgStart: '#f8fafc',
    bgEnd: '#edf2f7',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    accent: '#0284c7',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    cardBorder: 'rgba(148, 163, 184, 0.35)',
    progressBg: 'rgba(148, 163, 184, 0.25)',
    progressFill: '#0284c7',
    signatureColor: '#0f172a',
    hasGlow: false,
  },
  focus: {
    name: 'FOCUS',
    description: 'Deep charcoal background with large countdown and minimal distractions',
    bgStart: '#121316',
    bgEnd: '#0c0d0e',
    textPrimary: '#f4f4f5',
    textSecondary: '#fbbf24',
    textMuted: '#a1a1aa',
    accent: '#f59e0b',
    cardBg: 'rgba(245, 158, 11, 0.08)',
    cardBorder: 'rgba(245, 158, 11, 0.25)',
    progressBg: 'rgba(255, 255, 255, 0.1)',
    progressFill: '#f59e0b',
    signatureColor: '#fbbf24',
    hasGlow: true,
  },
};

/**
 * Returns pixel dimensions for selected aspect ratio.
 */
export function getCanvasDimensions(aspectRatio: WallpaperAspectRatio): { width: number; height: number } {
  switch (aspectRatio) {
    case '9:19.5':
      return { width: 1080, height: 2340 };
    case '9:20':
      return { width: 1080, height: 2400 };
    case '9:16':
    default:
      return { width: 1080, height: 1920 };
  }
}

function getGoogleFontFamily(font?: GoogleFontOption, isMono: boolean = false): string {
  if (isMono || font === 'mono') {
    return '"JetBrains Mono", "Geist Mono", "Fira Code", monospace';
  }
  switch (font) {
    case 'space':
      return '"Space Grotesk", "Plus Jakarta Sans", sans-serif';
    case 'outfit':
      return '"Outfit", "Plus Jakarta Sans", sans-serif';
    case 'sora':
      return '"Sora", "Plus Jakarta Sans", sans-serif';
    case 'inter':
      return '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    case 'jakarta':
    default:
      return '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
  }
}

/**
 * Renders the complete 9:16 smartphone wallpaper onto an HTML5 Canvas.
 * Designed specifically for high-resolution 1080x1920 lock-screen rendering.
 */
export function renderWallpaperOnCanvas(
  canvas: HTMLCanvasElement,
  config: WallpaperConfig
): void {
  const { width, height } = getCanvasDimensions(config.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const theme = THEME_PRESETS[config.themeId] || THEME_PRESETS.midnight;
  const effectiveAccent = config.accentColor || theme.accent;

  // 1. BACKGROUND RENDERING
  if (config.backgroundStyle === 'solid') {
    ctx.fillStyle = theme.bgStart;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Linear Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, theme.bgStart);
    gradient.addColorStop(0.5, theme.bgStart);
    gradient.addColorStop(1, theme.bgEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Mesh Glow / Ambient Radial Light
  if (config.backgroundStyle === 'mesh' || theme.hasGlow) {
    const radial = ctx.createRadialGradient(
      width / 2,
      height * 0.45,
      20,
      width / 2,
      height * 0.45,
      width * 0.75
    );
    radial.addColorStop(0, `${effectiveAccent}25`);
    radial.addColorStop(0.5, `${effectiveAccent}08`);
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  }

  // Tech Grid Background Overlay
  if (config.backgroundStyle === 'grid' || theme.hasGrid) {
    ctx.save();
    ctx.strokeStyle = `${effectiveAccent}15`;
    ctx.lineWidth = 1;
    const gridSize = 48;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // Corner technical crosshairs
    const drawCross = (cx: number, cy: number) => {
      ctx.strokeStyle = `${effectiveAccent}40`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy);
      ctx.lineTo(cx + 15, cy);
      ctx.moveTo(cx, cy - 15);
      ctx.lineTo(cx, cy + 15);
      ctx.stroke();
    };
    drawCross(60, 60);
    drawCross(width - 60, 60);
    drawCross(60, height - 60);
    drawCross(width - 60, height - 60);
    ctx.restore();
  }

  // 2. CLOCK-SAFE AREA VISUAL GUIDE (Only if explicitly enabled for preview framing)
  if (config.showClockSafeGuide) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 100, width - 120, 260);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NATIVE PHONE CLOCK SAFE ZONE', width / 2, 240);
    ctx.restore();
  }

  // 3. TOP SECTION: DATE & BADGE
  const topDateY = 410;
  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  ctx.save();
  ctx.textAlign = 'center';

  // Small Top Label Pill
  if (config.topLabel) {
    const pillText = config.topLabel.toUpperCase();
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const textWidth = ctx.measureText(pillText).width;
    const pillW = textWidth + 48;
    const pillH = 46;
    const pillX = (width - pillW) / 2;
    const pillY = topDateY - 60;

    ctx.fillStyle = theme.cardBg;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 23);
    ctx.fill();

    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = effectiveAccent;
    ctx.fillText(pillText, width / 2, pillY + 31);
  }

  // Today Date String
  ctx.fillStyle = theme.textMuted;
  ctx.font = `600 28px ${getGoogleFontFamily(config.fontFamily)}`;
  ctx.letterSpacing = '1px';
  ctx.fillText(todayStr.toUpperCase(), width / 2, topDateY);
  ctx.restore();

  // 4. CENTER SECTION: GOAL TITLE, LARGE COUNTDOWN & DEADLINE
  const centerY = height * 0.42;

  ctx.save();
  ctx.textAlign = 'center';

  // Goal Title
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `800 48px ${getGoogleFontFamily(config.fontFamily)}`;
  ctx.letterSpacing = '-0.5px';
  // Wrap or truncate title to max 2 lines
  ctx.fillText(config.title, width / 2, centerY - 140);

  // Subtitle / Company
  if (config.subtitle) {
    ctx.fillStyle = theme.textSecondary;
    ctx.font = `600 30px ${getGoogleFontFamily(config.fontFamily)}`;
    ctx.fillText(config.subtitle, width / 2, centerY - 90);
  }

  // Massive Countdown Number
  let countdownFontSize = 170;
  if (config.typographySize === 'large') countdownFontSize = 210;
  if (config.typographySize === 'xlarge') countdownFontSize = 250;

  ctx.font = `900 ${countdownFontSize}px ${getGoogleFontFamily(config.fontFamily, true)}`;
  ctx.fillStyle = effectiveAccent;

  if (theme.hasGlow) {
    ctx.shadowColor = effectiveAccent;
    ctx.shadowBlur = 40;
  }
  ctx.fillText(String(config.countdownNumber), width / 2, centerY + 80);
  ctx.shadowBlur = 0; // reset shadow

  // Countdown Unit Label (e.g. "DAYS REMAINING")
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `800 32px ${getGoogleFontFamily(config.fontFamily)}`;
  ctx.letterSpacing = '4px';
  ctx.fillText(config.countdownUnit.toUpperCase(), width / 2, centerY + 140);

  // Deadline Information
  ctx.fillStyle = theme.textMuted;
  ctx.font = `500 26px ${getGoogleFontFamily(config.fontFamily)}`;
  ctx.letterSpacing = '0.5px';
  ctx.fillText(config.deadlineInfo, width / 2, centerY + 185);
  ctx.restore();

  // 5. PROGRESS BAR SECTION
  let currentY = centerY + 250;

  if (config.showProgressBar) {
    ctx.save();
    const barWidth = width - 200;
    const barHeight = 24;
    const barX = (width - barWidth) / 2;

    // Progress percentage label
    ctx.fillStyle = theme.textSecondary;
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('EXECUTION PROGRESS', barX, currentY - 14);

    ctx.textAlign = 'right';
    ctx.fillStyle = effectiveAccent;
    ctx.fillText(`${config.progressPercentage}%`, barX + barWidth, currentY - 14);

    // Track Background
    ctx.fillStyle = theme.progressBg;
    ctx.beginPath();
    ctx.roundRect(barX, currentY, barWidth, barHeight, 12);
    ctx.fill();

    // Fill
    const fillWidth = Math.max(16, (barWidth * Math.min(100, Math.max(0, config.progressPercentage))) / 100);
    ctx.fillStyle = theme.progressFill;
    ctx.beginPath();
    ctx.roundRect(barX, currentY, fillWidth, barHeight, 12);
    ctx.fill();

    currentY += 70;
    ctx.restore();
  }

  // 6. MILESTONES SECTION: ONE PRIORITY + UP TO 3 SHORT CHIPS
  if (config.showMilestones && config.priorityMilestone) {
    ctx.save();
    const cardWidth = width - 160;
    const cardX = 80;
    const cardHeight = 150;

    // Priority Milestone Card Background
    ctx.fillStyle = theme.cardBg;
    ctx.beginPath();
    ctx.roundRect(cardX, currentY, cardWidth, cardHeight, 28);
    ctx.fill();

    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Priority Tag
    const tagY = currentY + 44;
    ctx.fillStyle = effectiveAccent;
    ctx.font = `800 20px ${getGoogleFontFamily(config.fontFamily)}`;
    ctx.textAlign = 'left';
    ctx.fillText(`●  PRIORITY: ${config.priorityMilestone.priority.toUpperCase()}`, cardX + 36, tagY);

    if (config.priorityMilestone.dueDate) {
      ctx.textAlign = 'right';
      ctx.fillStyle = theme.textMuted;
      ctx.font = `600 20px ${getGoogleFontFamily(config.fontFamily)}`;
      ctx.fillText(`Due: ${config.priorityMilestone.dueDate}`, cardX + cardWidth - 36, tagY);
    }

    // Milestone Title
    ctx.fillStyle = theme.textPrimary;
    ctx.font = `700 28px ${getGoogleFontFamily(config.fontFamily)}`;
    ctx.textAlign = 'left';
    const maxTitleW = cardWidth - 72;

    // Truncate if title is long
    let displayTitle = config.priorityMilestone.title;
    if (ctx.measureText(displayTitle).width > maxTitleW) {
      while (ctx.measureText(displayTitle + '...').width > maxTitleW && displayTitle.length > 0) {
        displayTitle = displayTitle.slice(0, -1);
      }
      displayTitle += '...';
    }
    ctx.fillText(displayTitle, cardX + 36, currentY + 98);

    currentY += cardHeight + 30;

    // Up to 3 Short Milestone Chips
    if (config.shortMilestones && config.shortMilestones.length > 0) {
      const chips = config.shortMilestones.slice(0, 3);
      const chipSpacing = 16;
      ctx.font = `600 20px ${getGoogleFontFamily(config.fontFamily)}`;

      // Measure total width of all chips to center them
      const chipWidths = chips.map((c) => ctx.measureText(c).width + 36);
      const totalChipsWidth =
        chipWidths.reduce((sum, w) => sum + w, 0) + (chips.length - 1) * chipSpacing;
      let startChipX = (width - totalChipsWidth) / 2;

      chips.forEach((chipText, i) => {
        const cW = chipWidths[i];
        const cH = 46;

        ctx.fillStyle = theme.cardBg;
        ctx.beginPath();
        ctx.roundRect(startChipX, currentY, cW, cH, 23);
        ctx.fill();

        ctx.strokeStyle = theme.cardBorder;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = theme.textMuted;
        ctx.textAlign = 'center';
        ctx.fillText(chipText, startChipX + cW / 2, currentY + 30);

        startChipX += cW + chipSpacing;
      });

      currentY += 70;
    }
    ctx.restore();
  }

  // 7. BOTTOM SECTION: MOTIVATIONAL QUOTE & BRAND SIGNATURE
  const bottomY = height - 120;

  ctx.save();
  ctx.textAlign = 'center';

  // Motivational Quote
  if (config.showQuote && config.motivationalQuote) {
    ctx.fillStyle = theme.textMuted;
    ctx.font = `italic 500 24px ${getGoogleFontFamily(config.fontFamily)}`;
    const quoteText = `"${config.motivationalQuote}"`;
    ctx.fillText(quoteText, width / 2, bottomY - 60);
  }

  // Brand Signature: OFFER MODE
  ctx.fillStyle = theme.signatureColor;
  ctx.font = `900 28px ${getGoogleFontFamily(config.fontFamily)}`;
  ctx.letterSpacing = '10px';
  ctx.fillText('OFFER MODE', width / 2, bottomY);

  // Subtle accent line under brand signature
  ctx.fillStyle = effectiveAccent;
  ctx.fillRect((width - 60) / 2, bottomY + 16, 60, 4);

  ctx.restore();
}

/**
 * Exports wallpaper as high-resolution PNG file download.
 * Returns true if successful, throws Error if canvas fails.
 */
export async function downloadWallpaperPng(
  config: WallpaperConfig,
  filename?: string
): Promise<{ success: boolean; filename: string }> {
  try {
    // Ensure standard font availability before rendering
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const { width, height } = getCanvasDimensions(config.aspectRatio);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    renderWallpaperOnCanvas(canvas, config);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob conversion failed.'));
          return;
        }

        const defaultName = `offer-mode-lockscreen-${config.themeId}-${width}x${height}-${Date.now()}.png`;
        const finalName = filename || defaultName;

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = finalName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        // Revoke after a brief delay
        setTimeout(() => URL.revokeObjectURL(url), 3000);

        resolve({ success: true, filename: finalName });
      }, 'image/png');
    });
  } catch (error) {
    console.error('Wallpaper PNG export error:', error);
    throw error;
  }
}

