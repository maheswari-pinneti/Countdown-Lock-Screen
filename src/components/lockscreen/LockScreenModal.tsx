import React, { useState, useEffect, useRef } from 'react';
import { CareerExperience, AppSettings } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';
import { soundEngine } from '../../services/soundEngine';
import { ExperienceIcon } from '../common/ExperienceIcon';
import {
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Sparkles,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
  Clock,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  experiences: CareerExperience[];
  activeExperienceId: string;
  settings: AppSettings;
  onClose: () => void;
  onSelectExperience: (id: string) => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const LockScreenModal: React.FC<Props> = ({
  experiences,
  activeExperienceId,
  settings,
  onClose,
  onSelectExperience,
  onUpdateSettings,
}) => {
  const currentExperience = experiences.find(e => e.id === activeExperienceId) || experiences[0];
  const countdown = useCountdown(currentExperience.targetOfferDate);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [zenMode, setZenMode] = useState(settings.zenMode);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  // Live wall clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'z' || e.key === 'Z' || e.key === ' ') {
        e.preventDefault();
        setZenMode(prev => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (experiences[idx]) {
          onSelectExperience(experiences[idx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [experiences, onClose, onSelectExperience]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const newSoundEnabled = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: newSoundEnabled });
    soundEngine.setMuted(!newSoundEnabled);
    if (newSoundEnabled) {
      soundEngine.playAmbient(currentExperience.theme.ambientSound);
    } else {
      soundEngine.stopAmbient();
    }
  };

  // Switch sound when experience changes
  useEffect(() => {
    if (settings.soundEnabled) {
      soundEngine.playAmbient(currentExperience.theme.ambientSound);
    }
  }, [currentExperience.id, settings.soundEnabled]);

  // Rotate quotes every 12 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % currentExperience.quotes.length);
    }, 12000);
    return () => clearInterval(quoteTimer);
  }, [currentExperience.quotes.length]);

  // Celebration if countdown reaches 0
  useEffect(() => {
    if (countdown.isExpired) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [countdown.isExpired]);

  // Slide-to-unlock mouse/touch handler
  const handleSliderMove = (clientX: number) => {
    if (!isDraggingSlider || !sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(rect.width - 56, clientX - rect.left - 28));
    const percent = pos / (rect.width - 56);
    setSliderPosition(pos);
    if (percent > 0.88) {
      soundEngine.playSuccessChime();
      setIsDraggingSlider(false);
      onClose();
    }
  };

  const handleSliderEnd = () => {
    setIsDraggingSlider(false);
    setSliderPosition(0);
  };

  const formattedWallClock = settings.timeFormat === '12h'
    ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    : currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const formattedWallDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-black text-white select-none overflow-hidden transition-all duration-700 ${
        currentExperience.id === 'quant_citadel'
          ? 'font-mono'
          : 'font-sans'
      }`}
      onMouseMove={(e) => handleSliderMove(e.clientX)}
      onMouseUp={handleSliderEnd}
      onTouchMove={(e) => e.touches[0] && handleSliderMove(e.touches[0].clientX)}
      onTouchEnd={handleSliderEnd}
    >
      {/* Background Ambience / Generative Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[140px] opacity-25 transition-all duration-1000"
          style={{ backgroundColor: currentExperience.theme.primary }}
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/80 to-black pointer-events-none" />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${currentExperience.theme.primary} 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
        {/* CRT Scanline effect for Quant mode */}
        {currentExperience.id === 'quant_citadel' && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
        )}
      </div>

      {/* Top Header Bar */}
      <header className={`relative z-10 w-full px-8 py-6 flex items-center justify-between transition-opacity duration-300 ${zenMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
              OFFER MODE ACTIVE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-slate-400">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{currentExperience.streakDays} Day Preparation Streak</span>
          </div>
        </div>

        {/* Experience Quick Switcher Pills */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
          {experiences.map((exp, idx) => {
            const isActive = exp.id === currentExperience.id;
            return (
              <button
                key={exp.id}
                onClick={() => {
                  soundEngine.playKeyClick();
                  onSelectExperience(exp.id);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title={`Press ${idx + 1} to switch`}
              >
                <ExperienceIcon name={exp.icon} className="w-3.5 h-3.5" style={{ color: exp.theme.primary }} />
                <span>{exp.name.split(' ')[0]}</span>
                <span className="text-[10px] text-zinc-500 hidden xl:inline">[{idx + 1}]</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playKeyClick();
              setZenMode(z => !z);
            }}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Zen Mode (Toggle with Space)"
          >
            {zenMode ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Soundscape (M)"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all"
            title="Exit Lock Screen (ESC)"
          >
            Dashboard (Esc)
          </button>
        </div>
      </header>

      {/* Main Center Display */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-6xl mx-auto w-full text-center py-4">
        {/* Wall Clock Time */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-sm font-medium tracking-widest uppercase text-zinc-400 mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>{formattedWallDate}</span>
          </div>
          <div className="text-4xl md:text-6xl font-light tracking-tight text-white/90 drop-shadow-sm font-mono">
            {formattedWallClock}
          </div>
        </div>

        {/* Target Badge & Role */}
        <div className="mb-6 flex flex-col items-center">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 border backdrop-blur-md"
            style={{
              backgroundColor: `${currentExperience.theme.primary}15`,
              borderColor: `${currentExperience.theme.primary}40`,
              color: currentExperience.theme.primary,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>{currentExperience.badge}</span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 max-w-4xl">
            {currentExperience.targetRole}
          </h1>

          <p className="text-sm md:text-lg text-slate-300 flex items-center justify-center gap-2 font-medium">
            <Briefcase className="w-4 h-4 text-zinc-400" />
            <span>{currentExperience.targetCompany}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-semibold">
              ${(currentExperience.compensation.targetTotalComp / 1000).toFixed(0)}k TC Target
            </span>
          </p>
        </div>

        {/* The Mega Countdown Grid */}
        <div className="grid grid-cols-4 md:grid-cols-5 gap-3 md:gap-5 w-full max-w-3xl my-2">
          {/* Days */}
          <div className="relative group p-4 md:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: currentExperience.theme.primary }}
            />
            <span className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white font-mono">
              {countdown.formatted.days}
            </span>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-zinc-400 mt-2">
              Days
            </span>
          </div>

          {/* Hours */}
          <div className="relative group p-4 md:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: currentExperience.theme.primary }}
            />
            <span className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white font-mono">
              {countdown.formatted.hours}
            </span>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-zinc-400 mt-2">
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div className="relative group p-4 md:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: currentExperience.theme.primary }}
            />
            <span className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white font-mono">
              {countdown.formatted.minutes}
            </span>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-zinc-400 mt-2">
              Minutes
            </span>
          </div>

          {/* Seconds */}
          <div className="relative group p-4 md:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: currentExperience.theme.primary }}
            />
            <span
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight font-mono"
              style={{ color: currentExperience.theme.primary }}
            >
              {countdown.formatted.seconds}
            </span>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-zinc-400 mt-2">
              Seconds
            </span>
          </div>

          {/* Milliseconds (hidden on smallest screens) */}
          <div className="hidden md:flex relative group p-4 md:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl shadow-2xl flex-col items-center justify-center overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-1 opacity-50"
              style={{ backgroundColor: currentExperience.theme.primary }}
            />
            <span className="text-3xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tight text-zinc-400">
              {countdown.formatted.milliseconds}
            </span>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-2">
              Millis
            </span>
          </div>
        </div>

        {/* Progress Bar towards Target Date */}
        <div className="w-full max-w-xl my-4">
          <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5 font-mono">
            <span>Target Lock-In: {new Date(currentExperience.targetOfferDate).toLocaleDateString()}</span>
            <span>{countdown.progressPercentage.toFixed(1)}% Window Elapsed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${countdown.progressPercentage}%`,
                backgroundColor: currentExperience.theme.primary,
                boxShadow: `0 0 12px ${currentExperience.theme.primary}`,
              }}
            />
          </div>
        </div>

        {/* Motivational Wisdom Quotes */}
        <div className="mt-4 px-6 py-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md max-w-xl transition-all">
          <p className="text-xs md:text-sm italic text-zinc-300 font-light">
            "{currentExperience.quotes[quoteIndex % currentExperience.quotes.length]}"
          </p>
        </div>
      </main>

      {/* Bottom Footer & Slide to Unlock */}
      <footer className="relative z-10 w-full px-8 py-6 flex flex-col items-center gap-4">
        {/* Slide to Unlock Track */}
        <div
          ref={sliderTrackRef}
          className="relative w-72 md:w-80 h-12 rounded-full bg-zinc-900/90 border border-zinc-800 backdrop-blur-md overflow-hidden flex items-center px-1 shadow-inner select-none cursor-pointer"
        >
          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-semibold tracking-wider uppercase text-zinc-500 animate-pulse">
            Slide to Unlock ➔
          </div>

          {/* Draggable Knob */}
          <div
            onMouseDown={() => setIsDraggingSlider(true)}
            onTouchStart={() => setIsDraggingSlider(true)}
            style={{ transform: `translateX(${sliderPosition}px)` }}
            className="relative z-10 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-transform cursor-grab active:cursor-grabbing active:scale-105"
          >
            {isDraggingSlider ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-zinc-800" />}
          </div>
        </div>

        {/* Quick hint */}
        <div className="text-[11px] text-zinc-500 flex items-center gap-3">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Esc</kbd> to unlock</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Space</kbd> for Zen</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">1-5</kbd> switch</span>
        </div>
      </footer>
    </div>
  );
};
