import React, { useState } from 'react';
import { calculateCognitiveLoad } from '../services/priorityService';
import { Task, Language, RecurrencePattern, TaskType, Difficulty } from '../types';
import { Plus, X, Calendar, Clock, AlertTriangle, Layers } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface AddTaskProps {
  onAdd: (task: Task) => void;
  lang: Language;
}

export const AddTask: React.FC<AddTaskProps> = ({ onAdd, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = getTranslation(lang);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [type, setType] = useState<TaskType>(TaskType.ROUTINE);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [importance, setImportance] = useState(3);
  const [recurrence, setRecurrence] = useState<RecurrencePattern>('none');
  const [deadline, setDeadline] = useState('');

  // --- Rule-based Smart Input Parsing ---
  const analyzeInput = (text: string) => {
    const lower = text.toLowerCase();

    // 1. Time (e.g. 30min, 2h)
    const timeMatch = lower.match(/(\d+)\s*(m|min|h|hour)/);
    if (timeMatch) {
      let val = parseInt(timeMatch[1]);
      const unit = timeMatch[2];
      if (unit.startsWith('h')) val *= 60;
      setMinutes(val);
    }

    // 2. Importance
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('important') || lower.includes('試験') || lower.includes('テスト')) {
      setImportance(5);
    }

    // 3. Difficulty
    if (lower.includes('hard') || lower.includes('complex') || lower.includes('difficult') || lower.includes('難')) {
      setDifficulty(Difficulty.HIGH);
    } else if (lower.includes('easy') || lower.includes('simple') || lower.includes('quick') || lower.includes('楽') || lower.includes('簡単')) {
      setDifficulty(Difficulty.LOW);
    }

    // 4. Type (Keyword mapping)
    if (lower.includes('read') || lower.includes('study') || lower.includes('book') || lower.includes('読')) setType(TaskType.COMPREHENSION);
    else if (lower.includes('write') || lower.includes('essay') || lower.includes('post') || lower.includes('書いて')) setType(TaskType.CREATION);
    else if (lower.includes('math') || lower.includes('logic') || lower.includes('solve') || lower.includes('計算')) setType(TaskType.LOGIC);
    else if (lower.includes('memorize') || lower.includes('vocab') || lower.includes('word') || lower.includes('暗記')) setType(TaskType.MEMORIZATION);
    else if (lower.includes('email') || lower.includes('clean') || lower.includes('daily') || lower.includes('掃除')) setType(TaskType.ROUTINE);

    // 5. Deadline (simple detection 'today', 'tomorrow')
    if (lower.includes('today') || lower.includes('今日')) {
      const d = new Date();
      d.setHours(23, 59, 0, 0);
      setDeadline(d.toISOString().slice(0, 16));
    }
    else if (lower.includes('tomorrow') || lower.includes('明日')) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(23, 59, 0, 0);
      setDeadline(d.toISOString().slice(0, 16));
    }
  };

  // Auto-analyze title keywords when user stops typing
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (title) analyzeInput(title);
    }, 800);
    return () => clearTimeout(timer);
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const loadScore = calculateCognitiveLoad(type, difficulty, minutes);

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      estimatedMinutes: minutes,
      type,
      difficulty,
      importance,
      cognitiveLoadScore: loadScore,
      status: 'pending',
      createdAt: Date.now(),
      recurrence,
      deadline: deadline ? new Date(deadline).toISOString() : undefined
    };

    onAdd(newTask);
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMinutes(30);
    setType(TaskType.ROUTINE);
    setDifficulty(Difficulty.MEDIUM);
    setImportance(3);
    setRecurrence('none');
    setDeadline('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 group"
      >
        <Plus className="group-hover:scale-110 transition-transform" />
        {t.addTaskButton}
      </button>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{t.addTaskButton}</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{lang === 'ja' ? 'タイトル' : 'Title'}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder={lang === 'ja' ? '例: 英単語50個暗記' : 'e.g., Study 50 vocab words'}
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{lang === 'ja' ? '詳細 (任意)' : 'Description (Optional)'}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-primary focus:outline-none h-20 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3" /> {lang === 'ja' ? 'タイプ' : 'Type'}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300"
            >
              {Object.values(TaskType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {lang === 'ja' ? '難易度' : 'Difficulty'}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300"
            >
              {Object.values(Difficulty).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Minutes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {lang === 'ja' ? '時間 (分)' : 'Minutes'}
            </label>
            <input
              type="number"
              min="5"
              step="5"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-primary"
            />
          </div>

          {/* Importance */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-secondary" /> {lang === 'ja' ? '重要度 (1-5)' : 'Importance (1-5)'}
            </label>
            <div className="flex gap-1 h-[38px] items-center">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setImportance(v)}
                  className={`w-8 h-8 rounded-full font-bold text-sm transition-all ${importance >= v ? 'bg-secondary text-white' : 'bg-slate-700 text-slate-400'
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Deadline */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {lang === 'ja' ? '期限' : 'Deadline'}
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300"
            />
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.recurrence?.daily ? t.recurrence.daily.split(' ')[0] : 'Repeat'}</label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrencePattern)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300"
            >
              <option value="none">{t.recurrence.none}</option>
              <option value="daily">{t.recurrence.daily}</option>
              <option value="weekly">{t.recurrence.weekly}</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-bold hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t.addToBrain}
          </button>
        </div>
      </form>
    </div>
  );
};