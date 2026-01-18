import React, { useState } from 'react';
import { Task, Difficulty, Language } from '../types';
import { Trash2, Calendar, Brain, Clock, AlertCircle, Split, Check, Loader2, Pencil, Sparkles, Filter } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface TaskListProps {
    tasks: Task[];
    onDelete: (id: string) => void;
    onDecompose: (id: string) => void;
    onEdit: (task: Task) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
    decomposingTaskId: string | null;
    recommendedTaskId?: string;
    lang: Language;
}

type FilterType = 'all' | 'quick' | 'lowLoad' | 'urgent';

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onDecompose, onEdit, onToggleSubtask, decomposingTaskId, recommendedTaskId, lang }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    if (tasks.length === 0) return null;

    const t = getTranslation(lang);

    // Helper to calculate relative date and urgency color
    const getDeadlineInfo = (dateStr?: string) => {
        if (!dateStr) return { text: '', color: 'text-slate-500', bg: 'bg-slate-500/10' };

        const target = new Date(dateStr);
        const now = new Date();
        target.setHours(0, 0, 0, 0);
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: t.overdue, color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertCircle, isUrgent: true };
        if (diffDays === 0) return { text: t.today, color: 'text-orange-400', bg: 'bg-orange-500/10', icon: AlertCircle, isUrgent: true };
        if (diffDays === 1) return { text: t.tomorrow, color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Calendar, isUrgent: false };

        return {
            text: target.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', { month: 'short', day: 'numeric' }),
            color: 'text-slate-400',
            bg: 'bg-slate-800',
            icon: Calendar,
            isUrgent: false
        };
    };

    const getDifficultyColor = (diff: Difficulty) => {
        switch (diff) {
            case Difficulty.HIGH: return 'border-red-500/50 text-red-400 bg-red-500/5';
            case Difficulty.MEDIUM: return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/5';
            case Difficulty.LOW: return 'border-emerald-500/50 text-emerald-400 bg-emerald-500/5';
        }
    };

    // Filter Tasks
    const filteredTasks = tasks.filter(task => {
        switch (activeFilter) {
            case 'quick': return task.estimatedMinutes <= 15;
            case 'lowLoad': return task.cognitiveLoadScore <= 4;
            case 'urgent':
                const dl = getDeadlineInfo(task.deadline);
                return dl.isUrgent;
            case 'all': default: return true;
        }
    });

    // Sort tasks: Recommended first, then Urgent deadlines
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        // 1. Recommended task always first (only if in list)
        if (a.id === recommendedTaskId) return -1;
        if (b.id === recommendedTaskId) return 1;

        // 2. Sort by deadline
        const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return dateA - dateB;
    });

    const filters: { id: FilterType, label: string }[] = [
        { id: 'all', label: t.filterAll },
        { id: 'quick', label: t.filterQuick },
        { id: 'lowLoad', label: t.filterLowLoad },
        { id: 'urgent', label: t.filterUrgent }
    ];

    return (
        <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">

            {/* Header and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    {t.allTasks}
                    <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        {sortedTasks.length}
                    </span>
                </h3>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                    {filters.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${activeFilter === f.id
                                    ? 'bg-primary/20 text-primary border-primary'
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {sortedTasks.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        No tasks match this filter.
                    </div>
                ) : sortedTasks.map(task => {
                    const deadlineInfo = getDeadlineInfo(task.deadline);
                    const DeadlineIcon = deadlineInfo.icon || Calendar;
                    const isDecomposing = decomposingTaskId === task.id;
                    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
                    const isRecommended = task.id === recommendedTaskId;

                    return (
                        <div
                            key={task.id}
                            className={`group relative bg-surface p-4 rounded-xl transition-all hover:shadow-lg ${isRecommended
                                    ? 'border-2 border-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                    : 'border border-slate-700/50 hover:border-slate-600'
                                }`}
                        >
                            {/* Highlight Badge for Recommended */}
                            {isRecommended && (
                                <div className="absolute -top-3 left-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                                    <Sparkles className="w-3 h-3" />
                                    AI Recommended
                                </div>
                            )}

                            {/* Left Colored Bar for Difficulty */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${task.difficulty === Difficulty.HIGH ? 'bg-red-500' :
                                    task.difficulty === Difficulty.MEDIUM ? 'bg-yellow-500' : 'bg-emerald-500'
                                }`}></div>

                            <div className="pl-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        {/* Top Row: Tags */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase tracking-wider ${getDifficultyColor(task.difficulty)}`}>
                                                {t.difficulty[task.difficulty]}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-400 uppercase tracking-wider">
                                                {t.taskType[task.type]}
                                            </span>
                                            {(deadlineInfo.text === t.overdue || deadlineInfo.text === t.today) && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 ${deadlineInfo.color} ${deadlineInfo.bg}`}>
                                                    <AlertCircle className="w-3 h-3" />
                                                    {deadlineInfo.text}
                                                </span>
                                            )}
                                            {task.recurrence && task.recurrence !== 'none' && (
                                                <span className="text-[10px] px-2 py-0.5 rounded border border-blue-500/30 text-blue-400 uppercase tracking-wider">
                                                    {task.recurrence === 'daily' ? 'Daily' : 'Weekly'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h4 className="font-bold text-lg text-slate-200 leading-snug">
                                            {task.title}
                                        </h4>

                                        {/* Bottom Row: Metadata */}
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className={`flex items-center gap-1.5 ${deadlineInfo.color}`}>
                                                <DeadlineIcon className="w-4 h-4" />
                                                <span className="font-medium">{deadlineInfo.text || 'No Date'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                <span>{task.estimatedMinutes} {t.minutes}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title={`${t.load}: ${task.cognitiveLoadScore}/10`}>
                                                <Brain className="w-4 h-4 text-slate-600" />
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-1.5 h-3 rounded-sm ${(i + 1) * 2 <= task.cognitiveLoadScore
                                                                    ? 'bg-primary'
                                                                    : 'bg-slate-700'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => onEdit(task)}
                                            className="p-2 text-slate-600 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                            title={t.editTask}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onDelete(task.id)}
                                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Remove Task"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Subtasks Section */}
                                {hasSubtasks && (
                                    <div className="mt-4 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            <Split className="w-3 h-3" />
                                            {t.steps}
                                        </div>
                                        <div className="space-y-1">
                                            {task.subtasks!.map(sub => (
                                                <div key={sub.id} className="flex items-start gap-3 p-1.5 hover:bg-slate-800/50 rounded transition-colors group/sub">
                                                    <button
                                                        onClick={() => onToggleSubtask(task.id, sub.id)}
                                                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${sub.isCompleted
                                                                ? 'bg-success border-success text-slate-900'
                                                                : 'border-slate-600 hover:border-slate-400 bg-slate-800'
                                                            }`}
                                                    >
                                                        {sub.isCompleted && <Check className="w-3 h-3" />}
                                                    </button>
                                                    <span className={`text-sm ${sub.isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                                        {sub.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isDecomposing && !hasSubtasks && (
                                    <div className="mt-4 p-3 flex items-center gap-2 text-sm text-primary animate-pulse">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {t.generatingSteps}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};