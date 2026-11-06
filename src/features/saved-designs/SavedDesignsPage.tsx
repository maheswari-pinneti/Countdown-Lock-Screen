import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { soundEngine } from '../../services/soundEngine';

export const SavedDesignsPage: React.FC = () => {
  const { presets, deleteDesignPreset, openLockScreen } = useAppStore();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Icon name="Layout" className="w-7 h-7 text-cyan-400" />
            <span>Saved Countdown Designs</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse and manage customized countdown displays and aesthetic presets.
          </p>
        </div>

        <NavLink to="/countdown-studio">
          <Button size="sm" iconLeft="Plus">
            Create in Studio
          </Button>
        </NavLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset) => (
          <Card key={preset.id} accentColor={preset.accentColor} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-white">{preset.name}</span>
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: preset.accentColor }}
                />
              </div>

              <div className="space-y-1.5 text-xs text-zinc-400 font-mono">
                <div>Track: <span className="text-zinc-200 capitalize font-bold">{preset.trackId}</span></div>
                <div>Variant: <span className="text-zinc-200 capitalize">{preset.styleVariant}</span></div>
                <div>Font: <span className="text-zinc-200 capitalize">{preset.fontFamily}</span></div>
                <div>Created: <span className="text-zinc-500">{preset.createdDate}</span></div>
              </div>

              {preset.customQuote && (
                <div className="mt-4 p-3 rounded-xl bg-black/40 border border-zinc-800 text-xs text-zinc-300 italic">
                  "{preset.customQuote}"
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-800">
              <Button
                size="sm"
                iconLeft="Lock"
                onClick={() => {
                  soundEngine.playSuccessChime();
                  openLockScreen(preset.trackId);
                }}
              >
                Launch
              </Button>

              <button
                onClick={() => deleteDesignPreset(preset.id)}
                className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                title="Delete preset"
              >
                <Icon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

