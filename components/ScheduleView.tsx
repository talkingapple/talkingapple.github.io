import React, { useState } from 'react';
import { Task, BrainState, Language } from '../types';
import { generateDeterministicSchedule, ScheduleItem } from '../services/priorityService';
import { getTranslation } from '../utils/translations';
import { CalendarClock, Sparkles, Coffee, Briefcase, Loader2, ArrowRight } from 'lucide-react';

interface ScheduleViewProps {
    tasks: Task[];
    brainState: BrainState;
    lang: Language;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ tasks, brainState, lang }) => {
    const [availability, setAvailability] = useState('');
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const t = getTranslation(lang);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!availability.trim()) return;

        setIsGenerating(true);
        // Simulate slight processing delay for UX
        setTimeout(() => {
            const result = generateDeterministicSchedule(tasks, brainState, availability, lang);
            setSchedule(result);
            setIsGenerating(false);
        }, 600);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CalendarClock className="text-primary" />
                        {t.scheduleTitle}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">{t.scheduleDesc}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Section */}
                <div className="lg:col-span-1">
                    <div className="bg-surface p-6 rounded-2xl border border-slate-700/50 sticky top-4">
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    {lang === 'ja' ? '確保できる時間' : 'Available Duration'}
                                </label>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {['1h', '2h', '3h', '4h'].map(dur => (
                                        <button
                                            key={dur}
                                            type="button"
                                            onClick={() => setAvailability(dur)}
                                            className={`py-2 rounded-lg text-sm font-bold border transition-colors ${availability === dur
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                                }`}
                                        >
                                            {dur}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-surface text-slate-500">OR UNTIL</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <input
                                        type="time"
                                        onChange={(e) => setAvailability(`until ${e.target.value}`)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                </div>

                                <p className="text-xs text-slate-500 mt-2 text-center">
                                    {lang === 'ja' ? '選択: ' : 'Selected: '}
                                    <span className="text-secondary font-mono">{availability || '-'}</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isGenerating || tasks.length === 0}
                                className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t.generatingPlan}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        {t.generateSchedule}
                                    </>
                                )}
                            </button>
                            {tasks.length === 0 && (
                                <p className="text-xs text-red-400 text-center">{t.noTasksDesc}</p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="lg:col-span-2">
                    {schedule.length > 0 ? (
                        <div className="bg-surface p-6 rounded-2xl border border-slate-700/50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-200">{t.yourPlan}</h3>
                                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                    {t.planNote}
                                </span>
                            </div>

                            <div className="relative border-l-2 border-slate-800 ml-4 space-y-8">
                                {schedule.map((item, index) => {
                                    const isBreak = item.type === 'break' || item.type === 'buffer';
                                    return (
                                        <div key={index} className="relative pl-8">
                                            {/* Timeline Dot */}
                                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${isBreak
                                                ? 'bg-slate-900 border-slate-500'
                                                : 'bg-slate-900 border-primary'
                                                }`}></div>

                                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                                <div className="min-w-[100px] text-sm font-mono text-slate-400 pt-0.5">
                                                    {item.time}
                                                </div>

                                                <div className={`flex-1 p-4 rounded-xl border ${isBreak
                                                    ? 'bg-slate-800/50 border-slate-700 text-slate-300'
                                                    : 'bg-primary/10 border-primary/30 text-white'
                                                    }`}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {isBreak ? <Coffee className="w-5 h-5 text-slate-400" /> : <Briefcase className="w-5 h-5 text-primary" />}
                                                            <h4 className="font-bold text-lg">{item.activity}</h4>
                                                        </div>
                                                        {item.type === 'task' && (
                                                            <span className="text-xs uppercase font-bold tracking-wider text-primary border border-primary/30 px-2 py-0.5 rounded">
                                                                Task
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.notes && (
                                                        <p className="mt-2 text-sm text-slate-400 flex items-start gap-2">
                                                            <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
                                                            {item.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <CalendarClock className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-400 mb-2">
                                {t.schedule}
                            </h3>
                            <p className="text-slate-600 max-w-sm">
                                {t.scheduleDesc}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};