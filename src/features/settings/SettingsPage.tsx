import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { soundEngine } from '../../services/soundEngine';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, exportData, importData, resetToDefaults } = useAppStore();

  const handleSoundToggle = (enabled: boolean) => {
    updateSettings({ soundEnabled: enabled });
    soundEngine.setMuted(!enabled);
    if (enabled) soundEngine.playSuccessChime();
  };

  const handleVolumeChange = (vol: number) => {
    updateSettings({ soundVolume: vol });
    soundEngine.setVolume(vol);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        alert('All tracks, goals, and settings restored successfully!');
      } else {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Icon name="Settings" className="w-7 h-7 text-cyan-400" />
          <span>System & Preferences</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure clock display standards, Web Audio procedural soundscapes, and data backups.
        </p>
      </div>

      <div className="space-y-6">
        {/* Display & Time */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Clock" className="w-4 h-4 text-cyan-400" />
            <span>Clock & Precision</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Time Format</span>
                <span className="text-[11px] text-zinc-500">Toggle between standard 12-hour AM/PM and 24-hour military format</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playKeyClick();
                    updateSettings({ timeFormat: '12h' });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    settings.timeFormat === '12h'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  12-Hour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playKeyClick();
                    updateSettings({ timeFormat: '24h' });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    settings.timeFormat === '24h'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  24-Hour
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Show Milliseconds</span>
                <span className="text-[11px] text-zinc-500">High-speed 50ms tick updates on countdown timers</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showMilliseconds}
                onChange={(e) => updateSettings({ showMilliseconds: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Procedural Audio Engine */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Volume2" className="w-4 h-4 text-emerald-400" />
            <span>Web Audio Synthesizer</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Soundscape & Clicks</span>
                <span className="text-[11px] text-zinc-500">Synthesizes ambient focus drones, tick pulses, and milestone chimes</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleSoundToggle(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="py-2">
              <div className="flex justify-between text-xs text-zinc-300 mb-2">
                <span>Master Volume</span>
                <span className="font-mono text-emerald-400">{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Download" className="w-4 h-4 text-cyan-400" />
            <span>Data Storage & Backups</span>
          </h3>

          <p className="text-xs text-zinc-400 leading-relaxed">
            All countdown targets, interview stages, daily goals, and notes are saved locally in your browser's persistent LocalStorage. You can export a snapshot backup anytime.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="sm" iconLeft="Download" onClick={exportData}>
              Export Backup JSON
            </Button>

            <label className="inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 select-none text-xs px-4 py-2.5 gap-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 cursor-pointer">
              <Icon name="Upload" className="w-4 h-4 shrink-0" />
              <span>Import Backup JSON</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <Button
              size="sm"
              variant="danger"
              iconLeft="RefreshCw"
              onClick={() => {
                if (window.confirm('Reset all 5 career tracks and presets back to factory defaults?')) {
                  resetToDefaults();
                }
              }}
            >
              Reset to Factory Demo Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
