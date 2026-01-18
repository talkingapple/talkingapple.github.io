import React from 'react';
import { Task, RecommendationResponse, Language } from '../types';
import { BrainCircuit, Clock, TrendingUp, Mic, CheckCircle, PlayCircle } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface HeroTaskProps {
  task: Task | undefined;
  recommendation: RecommendationResponse | null;
  onComplete: (id: string) => void;
  onVoiceMode: (task: Task) => void;
  onFocusMode: (task: Task) => void;
  loading: boolean;
  lang: Language;
}

export const HeroTask: React.FC<HeroTaskProps> = ({ task, recommendation, onComplete, onVoiceMode, onFocusMode, loading, lang }) => {
  const t = getTranslation(lang);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 min-h-[300px] flex flex-col items-center justify-center text-center animate-pulse">
        <BrainCircuit className="w-16 h-16 text-primary mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-slate-300">{t.consulting}</h2>
        <p className="text-slate-500 mt-2">{t.consultingDesc}</p>
      </div>
    );
  }

  if (!task || !recommendation) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
        <h2 className="text-xl font-bold text-slate-300">{t.noTasks}</h2>
        <p className="text-slate-500">{t.noTasksDesc}</p>
      </div>
    );
  }

  return (
    <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl">
        
        {/* Badge Header */}
        <div className="flex justify-between items-start mb-6">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <BrainCircuit className="w-3 h-3" />
                {t.recommendedNow}
            </span>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{task.estimatedMinutes} {t.minutes}</span>
                <span className="text-slate-600">|</span>
                <TrendingUp className="w-4 h-4" />
                <span>{t.load}: {task.cognitiveLoadScore}/10</span>
            </div>
        </div>

        {/* Main Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            {task.title}
        </h1>
        <p className="text-slate-400 text-lg mb-6">
            {recommendation.suggestedAction}
        </p>

        {/* AI Reasoning Box */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-8 border border-slate-700/50">
            <p className="text-sm text-slate-300 italic">
                <span className="font-bold text-secondary not-italic mr-2">{t.why}</span>
                "{recommendation.reasoning}"
            </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
            <button 
                onClick={() => onComplete(task.id)}
                className="flex-1 bg-white text-slate-900 font-bold py-4 px-6 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
                <CheckCircle className="w-5 h-5" />
                {t.markComplete}
            </button>
            
            <button 
                onClick={() => onFocusMode(task)}
                className="flex-1 bg-gradient-to-r from-primary/80 to-primary text-white font-bold py-4 px-6 rounded-xl border border-transparent hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
                <PlayCircle className="w-5 h-5" />
                {t.startFocus}
            </button>
        </div>
        </div>
    </div>
  );
};