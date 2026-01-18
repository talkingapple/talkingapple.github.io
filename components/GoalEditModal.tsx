import React, { useState } from 'react';
import { Goal, Language } from '../types';
import { X, Save, Calendar, Flag } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface GoalEditModalProps {
  goal?: Goal; // If provided, edit mode. If undefined, create mode.
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  lang: Language;
}

export const GoalEditModal: React.FC<GoalEditModalProps> = ({ goal, isOpen, onClose, onSave, lang }) => {
  const t = getTranslation(lang);
  
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [deadline, setDeadline] = useState(goal?.deadline || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Goal = {
        id: goal?.id || Date.now().toString(),
        title,
        description,
        deadline: deadline || undefined,
        createdAt: goal?.createdAt || Date.now()
    };
    
    onSave(newGoal);
    onClose();
    // Reset if create mode
    if (!goal) {
        setTitle('');
        setDescription('');
        setDeadline('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flag className="text-primary" />
            {goal ? t.editTask : t.createGoal}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{t.goalTitle}</label>
                <input 
                    type="text" 
                    required
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="e.g. Learn French, Run a Marathon..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{t.goalDescription}</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none min-h-[80px]"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {t.goalDeadline}
                </label>
                <input 
                    type="date" 
                    value={deadline} 
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                 <button 
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                    {t.cancel}
                </button>
                <button 
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-bold hover:opacity-90 flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {t.saveChanges}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};