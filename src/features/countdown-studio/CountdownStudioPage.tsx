import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { useCountdown } from '../../hooks/useCountdown';
import { CountdownDesignPreset, ExperienceTrackId } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const CountdownStudioPage: React.FC = () => {
  const { experiences, presets, addDesignPreset, deleteDesignPreset, openLockScreen } = useAppStore();

  const [selectedTrackId, setSelectedTrackId] = useState<ExperienceTrackId>('developer');
  const [presetName, setPresetName] = useState('My Custom Studio Countdown');
  const [fontFamily, setFontFamily] = useState<'mono' | 'sans' | 'display'>('mono');
  const [styleVariant, setStyleVariant] = useState<'glass' | 'cyber' | 'terminal' | 'minimal' | 'bold'>('glass');
  const [accentColor, setAccentColor] = useState('#22c55e');
  const [showMilliseconds, setShowMilliseconds] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [showQuotes, setShowQuotes] = useState(true);
  const [customQuote, setCustomQuote] = useState('Execute with relentless precision.');

  const selectedTrack = experiences.find((e) => e.id === selectedTrackId) || experiences[0];
  const countdown = useCountdown(selectedTrack.targetOfferDate, selectedTrack.startDateIso);

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    const newPreset: CountdownDesignPreset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim() || 'Custom Countdown Preset',
      trackId: selectedTrackId,
      fontFamily,
      styleVariant,
      accentColor,
      backgroundColor: '#0a0d14',
      showMilliseconds,
      showProgressBar,
      showQuotes,
      ambientSound: selectedTrack.theme.ambientSound,
      customQuote,
      createdDate: new Date().toISOString().slice(0, 10),
    };
    addDesignPreset(newPreset);
    setPresetName('My Custom Studio Countdown');
  };

  const handleApplyPreset = (preset: CountdownDesignPreset) => {
    soundEngine.playSuccessChime();
    setSelectedTrackId(preset.trackId);
    setFontFamily(preset.fontFamily);
    setStyleVariant(preset.styleVariant);
    setAccentColor(preset.accentColor);
    setShowMilliseconds(preset.showMilliseconds);
    setShowProgressBar(preset.showProgressBar);
    setShowQuotes(preset.showQuotes);
    if (preset.customQuote) setCustomQuote(preset.customQuote);
  };

  const fontClass = {
    mono: 'font-mono',
    sans: 'font-sans',
    display: 'font-display',
  }[fontFamily];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Icon name="Palette" className="w-7 h-7 text-cyan-400" />
            <span>Countdown Design Studio</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Customize typography, aesthetic variants, colors, and countdown display properties. Save designs to your local preset gallery.
          </p>
        </div>

        <Button
          size="sm"
          iconLeft="Lock"
          onClick={() => openLockScreen(selectedTrackId)}
        >
          Launch Fullscreen Lock Screen
        </Button>
      </div>

      {/* Main Studio Grid: Live Preview & Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Live Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-bold text-zinc-300">LIVE WORKSTATION PREVIEW</span>
            <span className="font-mono">Bound to: {selectedTrack.badge}</span>
          </div>

          {/* Preview Box */}
          <div
            className={`p-8 md:p-12 rounded-3xl border relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-500 ${fontClass} ${
              styleVariant === 'terminal'
                ? 'bg-stone-950 border-amber-500/40 text-amber-400'
                : styleVariant === 'cyber'
                ? 'bg-[#05070e] border-cyan-500/40 text-cyan-400'
                : styleVariant === 'minimal'
                ? 'bg-[#0b1311] border-emerald-500/30 text-emerald-300'
                : styleVariant === 'bold'
                ? 'bg-[#08080a] border-red-500/40 text-red-400'
                : 'bg-zinc-950/80 border-white/10 text-white backdrop-blur-2xl'
            }`}
            style={{
              boxShadow: `0 0 50px ${accentColor}15`,
            }}
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-20"
              style={{ backgroundColor: accentColor }}
            />

            <Badge
              label={selectedTrack.badge}
              icon={selectedTrack.icon}
              variant="zinc"
              className="mb-4"
              style={{
                backgroundColor: `${accentColor}15`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            />

            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1">
              {selectedTrack.targetRole}
            </h3>
            <p className="text-xs text-zinc-400 mb-6 font-medium">
              {selectedTrack.targetCompany} • Target Lock-In: {new Date(selectedTrack.targetOfferDate).toLocaleDateString()}
            </p>

            {/* Countdown Digits */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-md my-2">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-black text-white">{countdown.formatted.days}</span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Days</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-black text-white">{countdown.formatted.hours}</span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Hours</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-black text-white">{countdown.formatted.minutes}</span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Mins</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-black" style={{ color: accentColor }}>
                  {countdown.formatted.seconds}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Secs</span>
              </div>
            </div>

            {showMilliseconds && (
              <div className="text-xs font-mono text-zinc-500 mt-2">
                .{countdown.formatted.milliseconds} Milliseconds
              </div>
            )}

            {showProgressBar && (
              <div className="w-full max-w-sm mt-4">
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${countdown.progressPercentage}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
              </div>
            )}

            {showQuotes && (
              <div className="mt-6 px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-400 italic">
                "{customQuote}"
              </div>
            )}
          </div>
        </div>

        {/* Right: Customizer Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Sliders" className="w-4 h-4 text-emerald-400" />
              <span>Design Controls</span>
            </h3>

            <div className="space-y-4">
              {/* Bound Track */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Bind to Career Track</label>
                <div className="grid grid-cols-2 gap-2">
                  {experiences.map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playKeyClick();
                        setSelectedTrackId(exp.id);
                        setAccentColor(exp.theme.primary);
                      }}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        selectedTrackId === exp.id
                          ? 'bg-white/10 border-white/40 text-white'
                          : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon name={exp.icon} className="w-3.5 h-3.5" style={{ color: exp.theme.primary }} />
                      <span className="truncate">{exp.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Variant */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Visual Aesthetic Variant</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['glass', 'cyber', 'terminal', 'minimal', 'bold'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        soundEngine.playKeyClick();
                        setStyleVariant(v);
                      }}
                      className={`p-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        styleVariant === v
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-black/40 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Typography</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mono', 'sans', 'display'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        soundEngine.playKeyClick();
                        setFontFamily(f);
                      }}
                      className={`p-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        fontFamily === f
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-black/40 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Palette */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Accent Color</label>
                <div className="flex items-center gap-2">
                  {['#22c55e', '#ff9900', '#06b6d4', '#10b981', '#ef4444', '#a855f7', '#fbbf24'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => {
                        soundEngine.playKeyClick();
                        setAccentColor(col);
                      }}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: col,
                        borderColor: accentColor === col ? '#ffffff' : 'transparent',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                  <span>Display Milliseconds</span>
                  <input
                    type="checkbox"
                    checked={showMilliseconds}
                    onChange={(e) => setShowMilliseconds(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                  <span>Display Progress Bar</span>
                  <input
                    type="checkbox"
                    checked={showProgressBar}
                    onChange={(e) => setShowProgressBar(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                  <span>Display Wisdom Quotes</span>
                  <input
                    type="checkbox"
                    checked={showQuotes}
                    onChange={(e) => setShowQuotes(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Custom Quote text */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Custom Quote Text</label>
                <input
                  type="text"
                  value={customQuote}
                  onChange={(e) => setCustomQuote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-100"
                />
              </div>

              {/* Save Form */}
              <form onSubmit={handleSavePreset} className="pt-2 space-y-2">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset Name..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500"
                />
                <Button size="md" type="submit" iconLeft="Save" className="w-full">
                  Save Preset to Gallery
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>

      {/* Saved Presets Gallery */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Icon name="Layout" className="w-4 h-4 text-cyan-400" />
          <span>Preset Gallery ({presets.length} Presets Available)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">{preset.name}</span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                </div>
                <div className="text-xs text-zinc-400 space-y-1">
                  <div>Track: <span className="text-zinc-200 capitalize">{preset.trackId}</span></div>
                  <div>Style: <span className="text-zinc-200 capitalize">{preset.styleVariant}</span> • Font: <span className="text-zinc-200 capitalize">{preset.fontFamily}</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-800/80">
                <button
                  onClick={() => handleApplyPreset(preset)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  Apply in Studio ➔
                </button>

                <button
                  onClick={() => deleteDesignPreset(preset.id)}
                  className="p-1 text-zinc-500 hover:text-red-400"
                  title="Delete Preset"
                >
                  <Icon name="Trash2" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

