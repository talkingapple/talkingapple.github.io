import React from 'react';
import { Task, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { ThumbsUp, Minus, ThumbsDown, Star } from 'lucide-react';

interface ReflectionModalProps {
  task: Task;
  onConfirm: (multiplier: number) => void;
  lang: Language;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ task, onConfirm, lang }) => {
  const t = getTranslation(lang);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
      <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/20 rounded-full">
                <Star className="w-8 h-8 text-primary fill-primary animate-pulse" />
            </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">{t.finish}</h2>
        <p className="text-slate-400 mb-6">{task.title}</p>
        
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-300 font-medium mb-3">{t.reflectionDesc}</p>
            <div className="flex justify-center gap-3">
                <button 
                    onClick={() => onConfirm(0.8)} // Easy = Less raw XP maybe? Or just feedback. Let's make it standard bonus but logic can change. For now, bonus is same, this is for data.
                    className="flex-1 p-3 bg-slate-800 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500 rounded-xl transition-all group flex flex-col items-center gap-2"
                >
                    <ThumbsUp className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" />
                    <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-bold">{t.refEasy}</span>
                </button>

                <button 
                    onClick={() => onConfirm(1.0)} 
                    className="flex-1 p-3 bg-slate-800 hover:bg-blue-500/10 border border-slate-700 hover:border-blue-500 rounded-xl transition-all group flex flex-col items-center gap-2"
                >
                    <Minus className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                    <span className="text-xs text-slate-400 group-hover:text-blue-400 font-bold">{t.refNormal}</span>
                </button>

                <button 
                    onClick={() => onConfirm(1.2)} // Hard = More XP
                    className="flex-1 p-3 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500 rounded-xl transition-all group flex flex-col items-center gap-2"
                >
                    <ThumbsDown className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
                    <span className="text-xs text-slate-400 group-hover:text-red-400 font-bold">{t.refHard}</span>
                </button>
            </div>
        </div>
        
        <p className="text-xs text-primary font-bold uppercase tracking-wider">
            + {t.refBonus}
        </p>

      </div>
    </div>
  );
};