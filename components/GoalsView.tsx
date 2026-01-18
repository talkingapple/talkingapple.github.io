import React, { useState } from 'react';
import { Goal, Task, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { Plus, Flag, Calendar, Target, Trash2 } from 'lucide-react';
import { GoalEditModal } from './GoalEditModal';

interface GoalsViewProps {
    goals: Goal[];
    tasks: Task[];
    onSaveGoal: (goal: Goal) => void;
    onDeleteGoal: (id: string) => void;
    onAddTasks: (tasks: Task[]) => void;
    lang: Language;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ goals, tasks, onSaveGoal, onDeleteGoal, onAddTasks, lang }) => {
    const t = getTranslation(lang);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getProgress = (goalId: string) => {
        const goalTasks = tasks.filter(t => t.goalId === goalId);
        if (goalTasks.length === 0) return 0;
        const completed = goalTasks.filter(t => t.status === 'completed').length;
        return Math.round((completed / goalTasks.length) * 100);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Target className="text-primary" />
                        {t.goalsTitle}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">{t.goalsDesc}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                >
                    <Plus className="w-4 h-4" />
                    {t.addGoal}
                </button>
            </div>

            {goals.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center">
                    <Flag className="w-12 h-12 text-slate-600 mb-4" />
                    <p className="text-slate-500">{t.noGoals}</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 text-primary font-bold hover:underline"
                    >
                        {t.createGoal}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map(goal => {
                        const progress = getProgress(goal.id);
                        const linkedTasks = tasks.filter(t => t.goalId === goal.id && t.status === 'pending');

                        return (
                            <div key={goal.id} className="bg-surface rounded-2xl border border-slate-700 overflow-hidden group hover:border-slate-600 transition-colors">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                                        <button onClick={() => onDeleteGoal(goal.id)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                    {goal.description && <p className="text-slate-400 text-sm mb-4">{goal.description}</p>}

                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                        <Calendar className="w-3 h-3" />
                                        {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No Deadline'}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400 font-bold uppercase">{t.progress}</span>
                                            <span className="text-primary font-bold">{progress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Linked Tasks Preview */}
                                    {linkedTasks.length > 0 && (
                                        <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">{t.linkedTasks} ({linkedTasks.length})</p>
                                            <ul className="space-y-1">
                                                {linkedTasks.slice(0, 3).map(task => (
                                                    <li key={task.id} className="text-sm text-slate-300 truncate">• {task.title}</li>
                                                ))}
                                                {linkedTasks.length > 3 && <li className="text-xs text-slate-500 italic">+ {linkedTasks.length - 3} more</li>}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <GoalEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSaveGoal}
                lang={lang}
            />
        </div>
    );
};