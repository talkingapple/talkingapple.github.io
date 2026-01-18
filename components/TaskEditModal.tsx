import React, { useState, useEffect } from 'react';
import { Task, Language, Difficulty, TaskType, Goal } from '../types';
import { X, Save, Calendar, Clock, Brain, Tag, Target } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface TaskEditModalProps {
    task: Task | null;
    goals: Goal[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedTask: Task) => void;
    lang: Language;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, goals, isOpen, onClose, onSave, lang }) => {
    const t = getTranslation(lang);
    const [formData, setFormData] = useState<Task | null>(null);

    useEffect(() => {
        if (task) {
            setFormData({ ...task });
        }
    }, [task]);

    if (!isOpen || !formData) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
            onClose();
        }
    };

    // Helper to safely handle deadline date input
    const getDeadlineDate = () => {
        if (!formData.deadline) return '';
        try {
            return new Date(formData.deadline).toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {t.editTask}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="edit-task-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">{t.title}</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">{t.description}</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none min-h-[80px]"
                            />
                        </div>

                        {/* Grid for settings */}
                        {/* Grid for settings */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* Deadline */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {t.deadline}
                                </label>
                                <input
                                    type="date"
                                    value={getDeadlineDate()}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>

                            {/* Estimated Minutes */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {t.estimatedMinutes}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.estimatedMinutes}
                                    onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>

                            {/* Importance */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                                    <Target className="w-3 h-3 text-secondary" /> Importance (1-5)
                                </label>
                                <div className="flex gap-1 h-[42px] items-center">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, importance: v })}
                                            className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${(formData.importance || 1) >= v ? 'bg-secondary text-white' : 'bg-slate-700 text-slate-400'
                                                }`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Goal Selector */}
                            {goals.length > 0 && (
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                                        <Target className="w-3 h-3" /> {t.selectGoal}
                                    </label>
                                    <select
                                        value={formData.goalId || ''}
                                        onChange={(e) => setFormData({ ...formData, goalId: e.target.value || undefined })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                    >
                                        <option value="">{t.selectGoal}</option>
                                        {goals.map(g => (
                                            <option key={g.id} value={g.id}>{g.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-700 pt-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t.manualOverride}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Cognitive Load Score */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                                        <Brain className="w-3 h-3" /> {t.load} (1-10)
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={formData.cognitiveLoadScore}
                                        onChange={(e) => setFormData({ ...formData, cognitiveLoadScore: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>1</span>
                                        <span className="text-white font-bold">{formData.cognitiveLoadScore}</span>
                                        <span>10</span>
                                    </div>
                                </div>

                                {/* Difficulty Enum */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                                        <Tag className="w-3 h-3" /> Difficulty
                                    </label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                    >
                                        {Object.values(Difficulty).map(d => (
                                            <option key={d} value={d}>{t.difficulty[d]}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Task Type Enum */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                                        <Tag className="w-3 h-3" /> Type
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskType })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                    >
                                        {Object.values(TaskType).map(type => (
                                            <option key={type} value={type}>{t.taskType[type]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                        {t.cancel}
                    </button>
                    <button
                        type="submit"
                        form="edit-task-form"
                        className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-bold hover:opacity-90 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {t.saveChanges}
                    </button>
                </div>
            </div>
        </div>
    );
};