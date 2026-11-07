import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { soundEngine } from '../../services/soundEngine';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-12 animate-fadeIn max-w-2xl mx-auto">
      {/* Glitch / 8-Bit Cyber Matrix Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <span>HTTP_STATUS // 404 TARGET_NOT_FOUND</span>
      </div>

      {/* Massive 404 Graphic */}
      <div className="relative mb-6">
        <div className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-400 to-zinc-700 select-none drop-shadow-[0_0_35px_rgba(255,255,255,0.15)]">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-48 h-48 rounded-full border border-dashed border-rose-500/40 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
      </div>

      {/* Error Description */}
      <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
        Vector Coordinate Disconnected
      </h1>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
        The requested career workstation route does not exist or has been relocated to another tactical sector. Re-align your navigation below.
      </p>

      {/* Primary Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10 w-full max-w-sm">
        <Button
          size="md"
          variant="primary"
          iconLeft="LayoutDashboard"
          onClick={() => {
            soundEngine.playSuccessChime();
            navigate('/');
          }}
          className="w-full sm:w-auto flex-1 justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)]"
        >
          Return to Dashboard
        </Button>

        <Button
          size="md"
          variant="secondary"
          iconLeft="BookOpen"
          onClick={() => {
            soundEngine.playKeyClick();
            navigate('/help');
          }}
          className="w-full sm:w-auto justify-center"
        >
          Browse Docs
        </Button>
      </div>

      {/* Quick Access Grid to The 5 Core Experiences */}
      <Card className="w-full text-left p-5 bg-[#0A0E1A]/80 border-zinc-800">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80">
          <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="Compass" className="w-3.5 h-3.5 text-cyan-400" />
            Quick Sector Reroute
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">5 Active Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <NavLink
            to="/interview"
            onClick={() => soundEngine.playKeyClick()}
            className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 transition-all flex items-center gap-2 group"
          >
            <Icon name="Calendar" className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">Interview Countdown</span>
          </NavLink>

          <NavLink
            to="/job-hunt"
            onClick={() => soundEngine.playKeyClick()}
            className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-cyan-500/10 border border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-all flex items-center gap-2 group"
          >
            <Icon name="Briefcase" className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">30-Day Job Hunt</span>
          </NavLink>

          <NavLink
            to="/developer"
            onClick={() => soundEngine.playKeyClick()}
            className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-300 transition-all flex items-center gap-2 group"
          >
            <Icon name="Code" className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Developer Skill Upgrade</span>
          </NavLink>

          <NavLink
            to="/first-job"
            onClick={() => soundEngine.playKeyClick()}
            className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/40 text-zinc-300 hover:text-rose-300 transition-all flex items-center gap-2 group"
          >
            <Icon name="GraduationCap" className="w-4 h-4 text-rose-400" />
            <span className="font-semibold">First Job Countdown</span>
          </NavLink>

          <NavLink
            to="/career-switch"
            onClick={() => soundEngine.playKeyClick()}
            className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-purple-500/10 border border-zinc-800 hover:border-purple-500/40 text-zinc-300 hover:text-purple-300 transition-all flex items-center gap-2 group sm:col-span-2"
          >
            <Icon name="ArrowRightLeft" className="w-4 h-4 text-purple-400" />
            <span className="font-semibold">Career Switch Countdown</span>
          </NavLink>
        </div>
      </Card>
    </div>
  );
};

