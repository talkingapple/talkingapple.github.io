import React, { useState, useEffect } from 'react';
import { Task, BrainState, RecommendationResponse, Language, View, Goal } from './types';
import { getPrioritizedTask } from './services/priorityService';
import { BrainGauge } from './components/BrainGauge';
import { AddTask } from './components/AddTask';
import { HeroTask } from './components/HeroTask';
import { TaskList } from './components/TaskList';
import { FocusTimer } from './components/FocusTimer';
import { SettingsModal } from './components/SettingsModal';
import { Sidebar } from './components/Sidebar';
import { AnalyticsView } from './components/AnalyticsView';
import { ScheduleView } from './components/ScheduleView';
import { GoalsView } from './components/GoalsView';
import { TaskEditModal } from './components/TaskEditModal';
import { ReflectionModal } from './components/ReflectionModal';
import { BrainCircuit, Menu } from 'lucide-react';
import { getTranslation } from './utils/translations';

const INITIAL_TASKS: Task[] = [];
const INITIAL_STATE: BrainState = { fatigue: 5, motivation: 5, lastUpdated: Date.now(), xp: 0, level: 1 };

const App: React.FC = () => {
  // State Initialization with LocalStorage check
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('prioria-tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('prioria-goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [brainState, setBrainState] = useState<BrainState>(() => {
    const saved = localStorage.getItem('prioria-brainState');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('prioria-lang') as Language) || 'ja';
  });

  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Navigation & View State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Edit State
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Decomposition State (Legacy - functionality removed)
  const [decomposingTaskId, setDecomposingTaskId] = useState<string | null>(null);

  // Reflection State
  const [taskForReflection, setTaskForReflection] = useState<Task | null>(null);

  const t = getTranslation(language);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('prioria-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('prioria-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('prioria-brainState', JSON.stringify(brainState));
  }, [brainState]);

  useEffect(() => {
    localStorage.setItem('prioria-lang', language);
  }, [language]);


  // Re-run prioritization when tasks or brain state changes significantly
  // Re-run prioritization when tasks or brain state changes significantly
  useEffect(() => {
    const updatePriority = () => {
      const pending = tasks.filter(t => t.status === 'pending');
      if (pending.length === 0) {
        setRecommendation(null);
        return;
      }
      setIsProcessing(true);
      // Local Algo - fast, no debounce needed
      const rec = getPrioritizedTask(pending, brainState, language);
      setRecommendation(rec);
      setIsProcessing(false);
    };

    updatePriority();
  }, [tasks, brainState.fatigue, brainState.motivation, language]);

  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleAddTasks = (newTasks: Task[]) => {
    setTasks(prev => [...prev, ...newTasks]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Called when user clicks "Complete" - Trigger Reflection First
  const handleCompleteTaskClick = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTaskForReflection(task);
  };

  // Called after Reflection is done
  const finalizeTaskCompletion = (task: Task, multiplier: number) => {
    // 1. Gamification Logic
    // Base XP = 10. Load Multiplier + Reflection Multiplier
    const baseXP = 10;
    const loadBonus = task.cognitiveLoadScore * 0.5; // Up to 5
    const xpGained = Math.floor((baseXP + loadBonus) * multiplier); // e.g. (10 + 5) * 1.2 = 18 XP

    const newXP = Math.floor(brainState.xp + xpGained);
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

    setBrainState(prev => ({
      ...prev,
      xp: newXP,
      level: newLevel
    }));

    // 2. Recurrence Logic
    if (task.recurrence && task.recurrence !== 'none') {
      const nextDue = new Date();
      if (task.recurrence === 'daily') nextDue.setDate(nextDue.getDate() + 1);
      if (task.recurrence === 'weekly') nextDue.setDate(nextDue.getDate() + 7);

      // Update task instead of deleting
      const updatedTask: Task = {
        ...task,
        deadline: nextDue.toISOString(),
        subtasks: task.subtasks?.map(s => ({ ...s, isCompleted: false })) // Reset subtasks
      };
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    } else {
      // Mark as completed instead of deleting so we can track history/analytics/goals
      const completedTask: Task = { ...task, status: 'completed', completedAt: Date.now() };
      setTasks(prev => prev.map(t => t.id === task.id ? completedTask : t));
    }

    // Cleanup UI
    setTaskForReflection(null);
    setActiveFocusTask(null);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const handleDecomposeTask = async (taskId: string) => {
    // Feature disabled/removed
    return;
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map(s =>
            s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s
          )
        };
      }
      return t;
    }));
  };

  const handleSaveGoal = (goal: Goal) => {
    setGoals(prev => {
      const index = prev.findIndex(g => g.id === goal.id);
      if (index >= 0) {
        const newGoals = [...prev];
        newGoals[index] = goal;
        return newGoals;
      }
      return [...prev, goal];
    });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    // Optionally unlink tasks? For now keep them.
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');

  const recommendedTask = recommendation
    ? pendingTasks.find(t => t.id === recommendation.taskId)
    : pendingTasks[0];

  const renderContent = () => {
    switch (currentView) {
      case 'analytics':
        return <AnalyticsView tasks={tasks} lang={language} />;
      case 'schedule':
        return <ScheduleView tasks={pendingTasks} brainState={brainState} lang={language} />;
      case 'goals':
        return <GoalsView
          goals={goals}
          tasks={tasks} // Pass all tasks for progress calc
          onSaveGoal={handleSaveGoal}
          onDeleteGoal={handleDeleteGoal}
          onAddTasks={handleAddTasks}
          lang={language}
        />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-8">
            {/* Header for Desktop */}
            <div className="hidden md:flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">{t.dashboard}</h2>
              {pendingTasks.length > 0 && (
                <span className="text-sm font-mono text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                  {pendingTasks.length} {t.load}
                </span>
              )}
            </div>

            {/* Updated Layout: HeroTask (Recommended) at the top */}
            <HeroTask
              task={recommendedTask}
              recommendation={recommendation}
              onComplete={handleCompleteTaskClick}
              onVoiceMode={() => { }} // No-op as button removed
              onFocusMode={(t) => setActiveFocusTask(t)}
              loading={isProcessing}
              lang={language}
            />

            {/* Inputs below recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BrainGauge state={brainState} onChange={setBrainState} lang={language} />
              <AddTask onAdd={handleAddTask} lang={language} />
            </div>

            <div id="task-list-section">
              <TaskList
                tasks={pendingTasks}
                onDelete={handleDeleteTask}
                onEdit={setEditingTask}
                onDecompose={handleDecomposeTask}
                onToggleSubtask={handleToggleSubtask}
                decomposingTaskId={decomposingTaskId}
                recommendedTaskId={recommendation?.taskId}
                lang={language}
              />
            </div>

            {/* Bottom padding */}
            <div className="h-20"></div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background text-slate-100 font-sans overflow-hidden">

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentView={currentView}
        onNavigate={setCurrentView}
        lang={language}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64 transition-all duration-300">

        {/* Mobile Header */}
        <header className="md:hidden border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 h-16 flex items-center px-4 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-primary" />
              <h1 className="font-bold text-white tracking-tight">Prioria</h1>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8">
          <div className="max-w-5xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>

      {activeFocusTask && (
        <FocusTimer
          task={activeFocusTask}
          onComplete={() => handleCompleteTaskClick(activeFocusTask.id)}
          onClose={() => setActiveFocusTask(null)}
          lang={language}
        />
      )}

      {taskForReflection && (
        <ReflectionModal
          task={taskForReflection}
          onConfirm={(multiplier) => finalizeTaskCompletion(taskForReflection, multiplier)}
          lang={language}
        />
      )}

      <TaskEditModal
        task={editingTask}
        goals={goals}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
        lang={language}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        setLanguage={setLanguage}
      />
    </div>
  );
};

export default App;