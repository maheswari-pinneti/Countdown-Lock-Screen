import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Waves,
  CloudRain,
  Radio,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { FocusSession } from '../../types';
import { loadFocusSessions, saveFocusSessions } from '../../services/lifeStorageService';
import { ambientAudio, AmbientSoundType } from '../../services/ambientAudioService';

type FocusModeType = 'pomodoro' | 'short_break' | 'deep_work';

const MODE_CONFIGS: Record<FocusModeType, { label: string; durationMinutes: number; badgeColor: string }> = {
  pomodoro: { label: 'Pomodoro Sprint', durationMinutes: 25, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  short_break: { label: 'Recharge Break', durationMinutes: 5, badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  deep_work: { label: 'Deep Architecture Block', durationMinutes: 50, badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
};

export const FocusModePage: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<FocusModeType>('pomodoro');
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [taskName, setTaskName] = useState('');
  const [selectedSound, setSelectedSound] = useState<AmbientSoundType | 'off'>('off');
  const [volume, setVolume] = useState(25);
  const [isZenMode, setIsZenMode] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSessions(loadFocusSessions());
    return () => {
      ambientAudio.stopSound();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleCompleteSession = () => {
    setIsActive(false);
    const duration = MODE_CONFIGS[currentMode].durationMinutes;

    if (currentMode !== 'short_break') {
      const newSession: FocusSession = {
        id: `focus-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        durationMinutes: duration,
        focusType: currentMode === 'pomodoro' ? 'pomodoro' : 'deep_work',
        taskTitle: taskName.trim() || 'Deep Work Sprint',
        completed: true,
      };
      const updated = [newSession, ...sessions];
      setSessions(updated);
      saveFocusSessions(updated);
    }

    // Switch to break automatically
    if (currentMode !== 'short_break') {
      switchMode('short_break');
    } else {
      switchMode('pomodoro');
    }
  };

  const switchMode = (mode: FocusModeType) => {
    setIsActive(false);
    setCurrentMode(mode);
    setSecondsRemaining(MODE_CONFIGS[mode].durationMinutes * 60);
  };

  const toggleSound = (sound: AmbientSoundType) => {
    if (selectedSound === sound) {
      ambientAudio.stopSound();
      setSelectedSound('off');
    } else {
      ambientAudio.startSound(sound, volume / 100);
      setSelectedSound(sound);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientAudio.setVolume(newVol / 100);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalSeconds = MODE_CONFIGS[currentMode].durationMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  const todaySessions = sessions.filter(
    (s) => s.date === new Date().toISOString().split('T')[0] && s.completed
  );
  const todayFocusMinutes = todaySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className={`space-y-8 animate-fadeIn pb-12 ${isZenMode ? 'fixed inset-0 z-50 bg-slate-950 p-6 md:p-12 overflow-y-auto' : ''}`}>
      {/* Header */}
      {!isZenMode && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950/40 via-card-bg to-slate-900 border border-teal-500/20 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  <Timer className="w-3.5 h-3.5" />
                  Cognitive Flow Hub
                </span>
                <span className="text-xs text-text-muted">Distraction-Free Deep Work</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Deep Work Focus Engine & Ambient Audio
              </h1>
              <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
                Enter the cognitive flow state with interval time-blocking and synthesized neural soundscapes
                (Brown Noise, Rain Drizzle, and Theta Binaural Beats) generated client-side via Web Audio.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Today&apos;s Focus</p>
                <p className="text-3xl font-black text-teal-400 mt-1">{todayFocusMinutes}m</p>
                <p className="text-[11px] text-text-muted mt-0.5">{todaySessions.length} completed sprints</p>
              </div>
              <button
                onClick={() => setIsZenMode(true)}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30 hover:scale-105 transition-all"
                title="Enter Fullscreen Zen Mode"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Focus Chamber */}
      <div className="card p-8 md:p-12 border border-white/10 text-center relative overflow-hidden flex flex-col items-center">
        {/* Zen Mode Exit Button */}
        {isZenMode && (
          <button
            onClick={() => setIsZenMode(false)}
            className="absolute top-6 right-6 p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 flex items-center gap-2 text-xs font-bold"
          >
            <Minimize2 className="w-4 h-4" />
            Exit Zen
          </button>
        )}

        {/* Mode Selector Tabs */}
        <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-white/5 mb-8">
          {(['pomodoro', 'short_break', 'deep_work'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => switchMode(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === mode
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25 scale-105'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {MODE_CONFIGS[mode].label} ({MODE_CONFIGS[mode].durationMinutes}m)
            </button>
          ))}
        </div>

        {/* Current Objective Input */}
        <div className="w-full max-w-md mb-6">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="What is your singular high-leverage focus objective?"
            className="w-full text-center px-4 py-2 rounded-xl bg-slate-900/60 border border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Giant Monospace Timer */}
        <div className="relative my-4">
          <div className="text-7xl md:text-9xl font-black tracking-tighter text-white font-mono drop-shadow-[0_0_35px_rgba(20,184,166,0.25)]">
            {formattedTime}
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full mt-6 overflow-hidden max-w-sm mx-auto">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => switchMode(currentMode)}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-base flex items-center gap-2.5 shadow-xl shadow-teal-500/25 hover:scale-105 transition-all"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                Pause Sprint
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                Start Focus Sprint
              </>
            )}
          </button>

          <button
            onClick={handleCompleteSession}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-white/10 transition-colors"
            title="Complete & Log Session"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Synthesized Ambient Audio Soundscapes */}
      <div className="card p-6 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Pure Web Audio Soundscapes
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                  Zero Network Audio
                </span>
              </h3>
              <p className="text-xs text-text-muted">Acoustic masking to eliminate environmental chatter and distraction</p>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2 rounded-xl border border-white/5">
            {volume === 0 ? <VolumeX className="w-4 h-4 text-text-muted" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <span className="text-xs font-mono text-text-muted w-8">{volume}%</span>
          </div>
        </div>

        {/* Sound Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => toggleSound('brown_noise')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              selectedSound === 'brown_noise'
                ? 'bg-teal-500/20 border-teal-500/50 text-white shadow-lg shadow-teal-500/10'
                : 'bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                Deep Brown Noise
                {selectedSound === 'brown_noise' && (
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">Low-frequency warm rumble simulating airplane cabin calm</p>
            </div>
          </button>

          <button
            onClick={() => toggleSound('rain_drizzle')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              selectedSound === 'rain_drizzle'
                ? 'bg-teal-500/20 border-teal-500/50 text-white shadow-lg shadow-teal-500/10'
                : 'bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                Gentle Rain Drizzle
                {selectedSound === 'rain_drizzle' && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">Natural acoustic mask for open offices or noisy spaces</p>
            </div>
          </button>

          <button
            onClick={() => toggleSound('binaural_theta')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              selectedSound === 'binaural_theta'
                ? 'bg-teal-500/20 border-teal-500/50 text-white shadow-lg shadow-teal-500/10'
                : 'bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                4Hz Theta Waves
                {selectedSound === 'binaural_theta' && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">Dual sine binaural beat for deep cognitive flow (headphones recommended)</p>
            </div>
          </button>
        </div>
      </div>

      {/* Focus History */}
      <div className="card p-6 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          Recent Flow Sessions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sessions.slice(0, 6).map((s) => (
            <div key={s.id} className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white line-clamp-1">{s.taskTitle || 'Deep Work Sprint'}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{s.date} • {s.focusType}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-black bg-teal-500/10 text-teal-300 border border-teal-500/20">
                +{s.durationMinutes}m
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusModePage;
