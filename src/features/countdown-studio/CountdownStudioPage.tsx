import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/AppContext';
import { useCountdownEngine } from '../../hooks/useCountdownEngine';
import {
  WallpaperThemeId,
  WallpaperAspectRatio,
  WallpaperTypographySize,
  WallpaperBackgroundStyle,
  GoogleFontOption,
  WallpaperConfig,
  THEME_PRESETS,
  downloadWallpaperPng,
  getCanvasDimensions,
} from '../../utils/wallpaperGenerator';
import { WallpaperPreviewCanvas } from '../../components/studio/WallpaperPreviewCanvas';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ExperienceTrackId } from '../../types';

const PRIMARY_THEME_IDS: WallpaperThemeId[] = [
  'minimal-focus',
  'dark-premium',
  'motivational-career',
  'soft-gradient',
  'clean-professional',
];

const ACCENT_PALETTE = [
  { label: 'Cyan', color: '#06b6d4' },
  { label: 'Electric', color: '#00f0ff' },
  { label: 'Emerald', color: '#22c55e' },
  { label: 'Amber', color: '#f59e0b' },
  { label: 'Purple', color: '#a855f7' },
  { label: 'Rose', color: '#f43f5e' },
  { label: 'Silver', color: '#e4e4e7' },
];

export const CountdownStudioPage: React.FC = () => {
  const { experiences, presets, addDesignPreset, openLockScreen } = useAppStore();

  // 1. Module Source Selection
  const [selectedTrackId, setSelectedTrackId] = useState<ExperienceTrackId>('developer');
  const activeTrack = useMemo(
    () => experiences.find((e) => e.id === selectedTrackId) || experiences[0],
    [experiences, selectedTrackId]
  );

  // 2. Real-Time Shared Countdown Engine
  const completedCount = activeTrack.milestones.filter((m) => m.completed).length;
  const totalCount = activeTrack.milestones.length;

  const countdown = useCountdownEngine({
    targetDate: activeTrack.targetOfferDate,
    startDate: activeTrack.startDateIso,
    deadlineTime: activeTrack.deadlineTime || '18:00',
    timeZone: activeTrack.timeZone || 'Local',
    completedMilestones: completedCount,
    totalMilestones: totalCount,
  });

  // 3. Studio Customization State
  const [themeId, setThemeId] = useState<WallpaperThemeId>('dark-premium');
  const [aspectRatio, setAspectRatio] = useState<WallpaperAspectRatio>('9:16');
  const [typographySize, setTypographySize] = useState<WallpaperTypographySize>('large');
  const [backgroundStyle, setBackgroundStyle] = useState<WallpaperBackgroundStyle>('mesh');
  const [fontFamily, setFontFamily] = useState<GoogleFontOption>('jakarta');
  const [customAccent, setCustomAccent] = useState<string>('#06b6d4');

  // Text Fields (Initialized from active track)
  const [customTitle, setCustomTitle] = useState(activeTrack.name);
  const [customSubtitle, setCustomSubtitle] = useState(
    `${activeTrack.targetRole} • ${activeTrack.targetCompany}`
  );
  const [topLabel, setTopLabel] = useState(`${activeTrack.badge} • OFFER MODE`);
  const [motivationalQuote, setMotivationalQuote] = useState(
    activeTrack.motivationalMessage || activeTrack.quotes[0] || 'Every deadline deserves a plan.'
  );

  // Milestone Selection
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    activeTrack.milestones[0]?.id || ''
  );

  // Toggles
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [showMilestones, setShowMilestones] = useState(true);
  const [showQuote, setShowQuote] = useState(true);
  const [showClockSafeGuide, setShowClockSafeGuide] = useState(false);

  // UI Export Feedback
  const [isExporting, setIsExporting] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Handle switching module source
  const handleTrackChange = (newTrackId: ExperienceTrackId) => {
    soundEngine.playKeyClick();
    setSelectedTrackId(newTrackId);
    const track = experiences.find((e) => e.id === newTrackId);
    if (track) {
      setCustomTitle(track.name);
      setCustomSubtitle(`${track.targetRole} • ${track.targetCompany}`);
      setTopLabel(`${track.badge} • OFFER MODE`);
      setMotivationalQuote(
        track.motivationalMessage || track.quotes[0] || 'Every deadline deserves a plan.'
      );
      if (track.milestones.length > 0) {
        setSelectedMilestoneId(track.milestones[0].id);
      }
    }
  };

  // Determine Priority Milestone & Short Milestones
  const currentPriorityMilestone = useMemo(() => {
    const found = activeTrack.milestones.find((m) => m.id === selectedMilestoneId);
    if (found) {
      return {
        title: found.title,
        priority: found.priority || 'high',
        dueDate: found.dueDate || found.deadline,
      };
    }
    const urgent = activeTrack.milestones.find((m) => m.priority === 'urgent' && !m.completed);
    if (urgent) {
      return {
        title: urgent.title,
        priority: urgent.priority,
        dueDate: urgent.dueDate || urgent.deadline,
      };
    }
    const first = activeTrack.milestones[0];
    return first
      ? { title: first.title, priority: first.priority || 'medium', dueDate: first.dueDate || first.deadline }
      : { title: 'Execute with relentless precision', priority: 'high' };
  }, [activeTrack.milestones, selectedMilestoneId]);

  const shortMilestoneLabels = useMemo(() => {
    return activeTrack.milestones
      .filter((m) => m.id !== selectedMilestoneId)
      .slice(0, 3)
      .map((m) => m.title);
  }, [activeTrack.milestones, selectedMilestoneId]);

  // Combined Wallpaper Config for Real-Time Canvas Rendering
  const wallpaperConfig: WallpaperConfig = useMemo(() => {
    return {
      themeId,
      aspectRatio,
      typographySize,
      backgroundStyle,
      fontFamily,
      accentColor: customAccent,
      topLabel,
      title: customTitle,
      subtitle: customSubtitle,
      countdownNumber: countdown.formatted.days,
      countdownUnit: countdown.days === 1 ? 'DAY REMAINING' : 'DAYS REMAINING',
      deadlineInfo: `TARGET LOCK: ${countdown.targetDateFormatted} (${countdown.timeZone.split('/').pop()})`,
      progressPercentage: countdown.compositeProgressPercentage,
      showProgressBar,
      priorityMilestone: currentPriorityMilestone,
      shortMilestones: shortMilestoneLabels,
      showMilestones,
      motivationalQuote,
      showQuote,
      showClockSafeGuide,
    };
  }, [
    themeId,
    aspectRatio,
    typographySize,
    backgroundStyle,
    customAccent,
    topLabel,
    customTitle,
    customSubtitle,
    countdown,
    showProgressBar,
    currentPriorityMilestone,
    shortMilestoneLabels,
    showMilestones,
    motivationalQuote,
    showQuote,
    showClockSafeGuide,
  ]);

  // Real PNG Image Export Handler
  const handleExportPng = async () => {
    setIsExporting(true);
    setExportFeedback(null);
    soundEngine.playKeyClick();

    try {
      const dimensions = getCanvasDimensions(aspectRatio);
      const filename = `offer-mode-${themeId}-${activeTrack.id}-${dimensions.width}x${dimensions.height}.png`;
      const result = await downloadWallpaperPng(wallpaperConfig, filename);

      soundEngine.playSuccessChime();
      setExportFeedback({
        type: 'success',
        message: `High-resolution PNG exported successfully (${dimensions.width}x${dimensions.height} px). Suitable for smartphone lock screen.`,
      });
    } catch (err: any) {
      console.error('PNG export failed', err);
      setExportFeedback({
        type: 'error',
        message: err.message || 'Failed to generate PNG wallpaper. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Save current design preset to app store
  const handleSaveToPresets = () => {
    soundEngine.playSuccessChime();
    addDesignPreset({
      id: `preset-${Date.now()}`,
      name: `${THEME_PRESETS[themeId].name} • ${activeTrack.name.split(' ')[0]}`,
      trackId: selectedTrackId,
      fontFamily: 'mono',
      styleVariant: themeId === 'electric' ? 'cyber' : themeId === 'focus' ? 'bold' : 'glass',
      accentColor: customAccent,
      backgroundColor: THEME_PRESETS[themeId].bgStart,
      showMilliseconds: true,
      showProgressBar,
      showQuotes: showQuote,
      ambientSound: activeTrack.theme.ambientSound,
      customQuote: motivationalQuote,
      createdDate: new Date().toISOString().slice(0, 10),
    });
    setExportFeedback({
      type: 'success',
      message: 'Design saved to Saved Designs presets gallery!',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              Wallpaper Generator
            </span>
            <span className="text-xs text-zinc-500 font-mono">1080 × 1920 HD</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Icon name="Smartphone" className="w-7 h-7 text-cyan-400" />
            <span>Countdown Lock Screen Studio</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Generate pixel-perfect 9:16 smartphone lock-screen wallpapers with live countdowns, priority milestones, and clock-safe framing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="secondary"
            iconLeft="Bookmark"
            onClick={handleSaveToPresets}
          >
            Save Preset
          </Button>

          <Button
            size="sm"
            iconLeft="Download"
            onClick={handleExportPng}
            disabled={isExporting}
            style={{
              backgroundColor: customAccent,
              color: '#000',
              fontWeight: 700,
            }}
          >
            {isExporting ? 'Exporting PNG...' : 'Download PNG Wallpaper'}
          </Button>
        </div>
      </div>

      {/* Export Feedback Banner */}
      {exportFeedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between animate-in fade-in ${
            exportFeedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/60 border border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Icon
              name={exportFeedback.type === 'success' ? 'CheckCircle2' : 'AlertCircle'}
              className="w-4 h-4 shrink-0"
            />
            <span>{exportFeedback.message}</span>
          </div>
          <button
            onClick={() => setExportFeedback(null)}
            className="text-zinc-400 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Responsive Real-Time Wallpaper Canvas Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="p-4 rounded-3xl bg-zinc-950/70 border border-zinc-800 shadow-2xl flex flex-col items-center">
            {/* Top Device Status Bar Simulation */}
            <div className="w-full flex items-center justify-between px-4 py-2 text-[11px] text-zinc-500 font-mono mb-2 border-b border-zinc-800/80">
              <span className="flex items-center gap-1.5 font-bold text-zinc-400">
                <Icon name="Eye" className="w-3.5 h-3.5 text-cyan-400" />
                Live 9:16 Canvas
              </span>
              <span>{getCanvasDimensions(aspectRatio).width} × {getCanvasDimensions(aspectRatio).height} px</span>
            </div>

            {/* The Live Interactive Canvas */}
            <div className="w-full max-w-[340px] my-2">
              <WallpaperPreviewCanvas config={wallpaperConfig} />
            </div>

            {/* Preview Toolbar */}
            <div className="w-full flex items-center justify-between gap-2 pt-3 border-t border-zinc-800/80 text-xs">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playKeyClick();
                  setShowClockSafeGuide(!showClockSafeGuide);
                }}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                  showClockSafeGuide
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon name="Clock" className="w-3.5 h-3.5" />
                <span>Clock Safe Area: {showClockSafeGuide ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => openLockScreen(selectedTrackId)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition-all"
              >
                <Icon name="Maximize" className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Functional Customization Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* CONTROL SECTION 1: THEME LIBRARY (All 5 Themes) */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icon name="Palette" className="w-4 h-4 text-cyan-400" />
                <span>1. Theme Library (5 Signature Styles)</span>
              </h3>
              <Badge label={`Current: ${THEME_PRESETS[themeId].name}`} variant="cyan" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {PRIMARY_THEME_IDS.map((tKey) => {
                const t = THEME_PRESETS[tKey];
                const isActive = themeId === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => {
                      soundEngine.playKeyClick();
                      setThemeId(tKey);
                      setCustomAccent(t.accent);
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/30 shadow-lg scale-102'
                        : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      {/* Theme color swatch */}
                      <div
                        className="w-full h-8 rounded-xl mb-2 border flex items-center justify-center gap-1.5"
                        style={{
                          background: `linear-gradient(135deg, ${t.bgStart}, ${t.bgEnd})`,
                          borderColor: t.cardBorder,
                        }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: t.accent }}
                        />
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: t.textPrimary }}
                        />
                      </div>
                      <div className="text-xs font-bold text-white truncate">{t.name}</div>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{t.description}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* CONTROL SECTION 2: CAREER MODULE / COUNTDOWN SOURCE */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icon name="Target" className="w-4 h-4 text-emerald-400" />
                <span>2. Select Career Module Countdown</span>
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                {activeTrack.badge} ({countdown.formatted.days}d {countdown.formatted.hours}h {countdown.formatted.minutes}m)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => handleTrackChange(exp.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTrackId === exp.id
                      ? 'border-emerald-500 bg-emerald-950/30 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon name={exp.icon} className="w-3.5 h-3.5" style={{ color: exp.theme.primary }} />
                    <span className="text-xs truncate">{exp.name.split(' ')[0]}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono block truncate">
                    {exp.badge}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* CONTROL SECTION 3: TEXT & GOAL EDITING */}
          <Card>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Icon name="Edit3" className="w-4 h-4 text-zinc-400" />
              <span>3. Edit Wallpaper Typography & Labels</span>
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Goal Title (Prominent)
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Senior Staff Engineering Loop"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Subtitle / Organization
                  </label>
                  <input
                    type="text"
                    value={customSubtitle}
                    onChange={(e) => setCustomSubtitle(e.target.value)}
                    placeholder="e.g. Google Architecture & Anthropic"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Top Badge Label
                  </label>
                  <input
                    type="text"
                    value={topLabel}
                    onChange={(e) => setTopLabel(e.target.value)}
                    placeholder="e.g. FAANG • OFFER MODE"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Motivational Quote (Bottom)
                  </label>
                  <input
                    type="text"
                    value={motivationalQuote}
                    onChange={(e) => setMotivationalQuote(e.target.value)}
                    placeholder="e.g. Every deadline deserves a plan."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* CONTROL SECTION 4: MILESTONE SELECTION & DISPLAY */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icon name="CheckSquare" className="w-4 h-4 text-cyan-400" />
                <span>4. Featured Milestone Selection</span>
              </h3>
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMilestones}
                  onChange={(e) => setShowMilestones(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-0"
                />
                <span>Display Milestones</span>
              </label>
            </div>

            {showMilestones && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Select Priority Milestone to Highlight
                </label>
                <select
                  value={selectedMilestoneId}
                  onChange={(e) => {
                    soundEngine.playKeyClick();
                    setSelectedMilestoneId(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  {activeTrack.milestones.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.priority?.toUpperCase() || 'NORMAL'}] {m.title} (Due: {m.dueDate || m.deadline})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  The studio highlights your selected priority milestone on the wallpaper, plus up to 3 upcoming milestones as secondary chips.
                </p>
              </div>
            )}
          </Card>

          {/* CONTROL SECTION 5: APPEARANCE & FORMATTING */}
          <Card>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Icon name="Sliders" className="w-4 h-4 text-amber-400" />
              <span>5. Visual Hierarchy, Background & Aspect Ratio</span>
            </h3>

            <div className="space-y-4">
              {/* Aspect Ratio Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Device Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '9:16', label: '9:16 Standard', res: '1080 × 1920' },
                    { id: '9:19.5', label: '9:19.5 Modern iPhone', res: '1080 × 2340' },
                    { id: '9:20', label: '9:20 Tall Android', res: '1080 × 2400' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playKeyClick();
                        setAspectRatio(ratio.id as WallpaperAspectRatio);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        aspectRatio === ratio.id
                          ? 'border-cyan-500 bg-cyan-950/30 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs">{ratio.label}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{ratio.res}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Size & Background Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Countdown Number Scale
                  </label>
                  <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs">
                    {(['standard', 'large', 'xlarge'] as WallpaperTypographySize[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          soundEngine.playKeyClick();
                          setTypographySize(size);
                        }}
                        className={`flex-1 py-1 rounded-lg capitalize font-semibold transition-all ${
                          typographySize === size
                            ? 'bg-zinc-800 text-white shadow'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Background Style
                  </label>
                  <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs">
                    {(['gradient', 'solid', 'mesh', 'grid'] as WallpaperBackgroundStyle[]).map(
                      (style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => {
                            soundEngine.playKeyClick();
                            setBackgroundStyle(style);
                          }}
                          className={`flex-1 py-1 rounded-lg capitalize font-semibold transition-all ${
                            backgroundStyle === style
                              ? 'bg-zinc-800 text-white shadow'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {style}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Google Font Family Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Google Font Family</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Live Google Fonts</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'jakarta', label: 'Plus Jakarta Sans', fontClass: 'font-sans' },
                    { id: 'space', label: 'Space Grotesk', fontClass: 'font-display' },
                    { id: 'outfit', label: 'Outfit (Geometric)', fontClass: 'font-outfit' },
                    { id: 'sora', label: 'Sora (Display)', fontClass: 'font-sora' },
                    { id: 'mono', label: 'JetBrains Mono', fontClass: 'font-mono' },
                    { id: 'inter', label: 'Inter (Clean)', fontClass: 'font-sans' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playKeyClick();
                        setFontFamily(f.id as GoogleFontOption);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        fontFamily === f.id
                          ? 'border-cyan-500 bg-cyan-950/40 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs">{f.label}</div>
                      <div className={`text-[10px] text-cyan-400/80 font-mono mt-0.5 ${f.fontClass}`}>
                        Aa 123
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Palette */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Accent Color
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {ACCENT_PALETTE.map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => {
                        soundEngine.playKeyClick();
                        setCustomAccent(item.color);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        customAccent === item.color
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.label}
                    >
                      {customAccent === item.color && (
                        <Icon name="Check" className="w-3.5 h-3.5 text-black stroke-[3]" />
                      )}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={customAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0"
                    title="Custom Color Picker"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800 text-xs">
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showProgressBar}
                    onChange={(e) => setShowProgressBar(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-0"
                  />
                  <span>Progress Bar</span>
                </label>

                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showQuote}
                    onChange={(e) => setShowQuote(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-0"
                  />
                  <span>Motivational Quote</span>
                </label>

                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showClockSafeGuide}
                    onChange={(e) => setShowClockSafeGuide(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                  />
                  <span>Clock Safe Guide</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Button
              size="lg"
              variant="secondary"
              iconLeft="Lock"
              onClick={() => openLockScreen(selectedTrackId)}
            >
              Preview Fullscreen
            </Button>

            <Button
              size="lg"
              iconLeft="Download"
              onClick={handleExportPng}
              disabled={isExporting}
              style={{
                backgroundColor: customAccent,
                color: '#000',
                fontWeight: 800,
                boxShadow: `0 0 25px ${customAccent}50`,
              }}
            >
              {isExporting ? 'Generating 1080×1920 PNG...' : 'Download PNG Lock Screen'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
