import React, { useState, useEffect } from 'react';
import { Task, Language } from '../types';
import { Play, Pause, Square, CheckCircle, BrainCircuit, X } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface FocusTimerProps {
  task: Task;
  onComplete: () => void;
  onClose: () => void;
  lang: Language;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ task, onComplete, onClose, lang }) => {
  const t = getTranslation(lang);
  // Default to task estimate or 25 mins if 0
  const initialTime = (task.estimatedMinutes > 0 ? task.estimatedMinutes : 25) * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
      >
        <X className="w-6 h-6 text-slate-300" />
      </button>

      <div className="max-w-md w-full text-center space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">
            <BrainCircuit className="w-4 h-4" />
            {t.focusMode}
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">{task.title}</h1>
          <p className="text-slate-400">{t.focusDesc}</p>
        </div>

        {/* Timer Display */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Circular Glow */}
          <div className={`absolute inset-0 rounded-full border-4 border-slate-800 ${isActive ? 'shadow-[0_0_50px_rgba(99,102,241,0.2)]' : ''}`}></div>
          <div className="text-6xl font-mono font-bold text-white tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:border-slate-500 transition-all text-white"
            title={isActive ? t.pause : t.resume}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>

          <button
            onClick={onComplete}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform text-white"
            title={t.finish}
          >
            <CheckCircle className="w-10 h-10" />
          </button>

          <button
            onClick={onClose}
            className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:border-red-500/50 hover:text-red-400 transition-all text-slate-400"
            title={t.stopTimer}
          >
            <Square className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};