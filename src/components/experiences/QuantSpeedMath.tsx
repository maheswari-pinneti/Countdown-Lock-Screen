import React, { useState, useEffect, useRef } from 'react';
import { CareerExperience } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import {
  Zap,
  Play,
  RotateCcw,
  Trophy,
  Flame,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Percent
} from 'lucide-react';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

interface Question {
  prompt: string;
  answer: number;
  category: string;
}

function generateQuestion(): Question {
  const type = Math.floor(Math.random() * 4);

  if (type === 0) {
    // 2-digit multiplication (e.g. 14 * 18)
    const a = Math.floor(Math.random() * 18) + 11;
    const b = Math.floor(Math.random() * 18) + 11;
    return {
      prompt: `${a} × ${b} = ?`,
      answer: a * b,
      category: 'Multiplication'
    };
  } else if (type === 1) {
    // Percentage calculation (e.g. 15% of 240)
    const p = [10, 15, 20, 25, 30, 40, 50, 75][Math.floor(Math.random() * 8)];
    const base = (Math.floor(Math.random() * 15) + 2) * 20;
    return {
      prompt: `${p}% of ${base} = ?`,
      answer: (p * base) / 100,
      category: 'Percentage'
    };
  } else if (type === 2) {
    // Squares (e.g. 17^2 or 14^2 - 10^2)
    const a = Math.floor(Math.random() * 15) + 11;
    return {
      prompt: `${a}² = ?`,
      answer: a * a,
      category: 'Squares'
    };
  } else {
    // Expected Value: Roll a fair 6-sided die, what is EV of 2 * roll + 3?
    const multiplier = Math.floor(Math.random() * 4) + 2;
    const addition = Math.floor(Math.random() * 6) + 1;
    // EV of die is 3.5. multiplier * 3.5 + addition
    // To keep it integer, we use even multipliers or integer results
    const multEven = multiplier * 2;
    return {
      prompt: `Expected Value of (${multEven} × Die_Roll + ${addition})? [Die 1-6]`,
      answer: multEven * 3.5 + addition,
      category: 'Expected Value'
    };
  }
}

export const QuantSpeedMath: React.FC<Props> = ({ experience, onUpdateExperience }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem('quant_high_score') || 14)
  );
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Timer
  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      soundEngine.playSuccessChime();
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('quant_high_score', String(score));
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore]);

  const handleStartGame = () => {
    soundEngine.playKeyClick();
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setUserAnswer('');
    setLastFeedback(null);
    setCurrentQuestion(generateQuestion());
    setIsPlaying(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPlaying) return;

    const val = parseFloat(userAnswer.trim());
    if (isNaN(val)) return;

    if (Math.abs(val - currentQuestion.answer) < 0.01) {
      soundEngine.playTick();
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setLastFeedback('correct');
      setCurrentQuestion(generateQuestion());
      setUserAnswer('');

      // Update experience metric
      const updatedMetrics = [...experience.customMetrics];
      const mathMetric = updatedMetrics.find(m => m.label.includes('Mental Math'));
      if (mathMetric && newScore > mathMetric.current) {
        mathMetric.current = newScore;
        onUpdateExperience({ ...experience, customMetrics: updatedMetrics });
      }
    } else {
      setStreak(0);
      setLastFeedback('wrong');
      setUserAnswer('');
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Bloomberg Terminal Status Bar */}
      <div className="p-3 rounded-lg bg-stone-900 border border-amber-500/30 flex flex-wrap items-center justify-between text-xs text-amber-400">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-wider">CITADEL / JANE STREET ALPHA ENGINE</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">ZETAMAC DRILL PROTOCOL</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>RECORD: {highScore} PTS</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Flame className="w-3.5 h-3.5" />
            <span>STREAK: {streak}</span>
          </div>
        </div>
      </div>

      {/* Main Game Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-black border-2 border-amber-500/40 shadow-[0_0_30px_rgba(255,153,0,0.15)] flex flex-col items-center relative overflow-hidden">
        {/* Amber Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500" />

        {!isPlaying && timeLeft === 60 ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Wall Street Speed Math Simulator
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Jane Street & Citadel technical rounds require rapid calculation under intense time pressure. Solve as many equations as possible in 60 seconds.
            </p>
            <button
              onClick={handleStartGame}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,153,0,0.4)] flex items-center gap-2 mx-auto"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Initiate 60s Sprint</span>
            </button>
          </div>
        ) : !isPlaying && timeLeft === 0 ? (
          <div className="text-center py-6 space-y-4">
            <div className="text-4xl font-extrabold text-amber-400 mb-1">
              {score} Correct
            </div>
            <p className="text-sm text-zinc-300">
              {score >= 20 ? '🌟 Exceptional Wall Street Caliber' : score >= 12 ? '⚡ Solid Quant Velocity' : '📚 Practice Daily to Increase Speed'}
            </p>
            <button
              onClick={handleStartGame}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Sprint</span>
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Top Bar inside game */}
            <div className="w-full flex justify-between items-center text-xs text-zinc-400 mb-6 pb-2 border-b border-zinc-800">
              <span className="text-amber-400 font-bold">{currentQuestion.category}</span>
              <span className={`font-bold font-mono text-base ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-zinc-200'}`}>
                ⏱ {timeLeft}s remaining
              </span>
              <span className="text-emerald-400 font-bold">SCORE: {score}</span>
            </div>

            {/* Prompt Question */}
            <div className="text-3xl md:text-5xl font-black text-white tracking-wider my-6 font-mono text-center">
              {currentQuestion.prompt}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex gap-2">
              <input
                ref={inputRef}
                type="number"
                step="any"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type answer & press Enter"
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border-2 border-amber-500/50 text-white font-mono text-xl text-center focus:outline-none focus:border-amber-400"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-sm uppercase"
              >
                Submit
              </button>
            </form>

            {/* Feedback notification */}
            <div className="h-6 mt-3 text-xs font-mono">
              {lastFeedback === 'correct' && (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Correct! +1
                </span>
              )}
              {lastFeedback === 'wrong' && (
                <span className="text-red-400 flex items-center gap-1 font-bold">
                  <XCircle className="w-3.5 h-3.5" /> Incorrect, retry!
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quant Options & Greeks Live Cheat Sheet */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { greek: 'Delta (Δ)', desc: 'Sensitivity of option price to underlying asset move (0 to 1 for calls)' },
          { greek: 'Gamma (Γ)', desc: 'Rate of change of delta per $1 move in underlying asset' },
          { greek: 'Vega (ν)', desc: 'Sensitivity of option price to 1% shift in implied volatility' },
          { greek: 'Theta (θ)', desc: 'Time decay of option value per calendar day elapsed' },
        ].map((g) => (
          <div key={g.greek} className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs">
            <div className="font-bold text-amber-400 mb-1">{g.greek}</div>
            <div className="text-[11px] text-zinc-400 leading-snug">{g.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
