
export type Language = 'en' | 'ja';

export type View = 'dashboard' | 'analytics' | 'schedule' | 'goals';

export enum TaskType {
  MEMORIZATION = 'Memorization',
  COMPREHENSION = 'Comprehension',
  CREATION = 'Creation',
  LOGIC = 'Logic',
  ROUTINE = 'Routine'
}

export enum Difficulty {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export type RecurrencePattern = 'none' | 'daily' | 'weekly';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string; // ISO Date string
  estimatedMinutes: number;
  type: TaskType;
  difficulty: Difficulty;
  importance: number; // 1-5 scale (5 is highest)
  cognitiveLoadScore: number; // 1-10 scale calculated by algorithm
  status: 'pending' | 'completed';
  createdAt: number;
  completedAt?: number;
  subtasks?: Subtask[]; 
  recurrence?: RecurrencePattern;
  goalId?: string; // Link to a Goal
}

export interface BrainState {
  fatigue: number; // 1 (Fresh) - 10 (Exhausted)
  motivation: number; // 1 (Low) - 10 (High)
  lastUpdated: number;
  xp: number; // Gamification: Brain Points
  level: number; // Gamification: Level
}

export interface RecommendationResponse {
  taskId: string;
  reasoning: string;
  suggestedAction: string; // "Just do 5 minutes", "Deep work mode", etc.
  voiceModeAvailable: boolean;
}

export interface ScheduleItem {
  time: string; // e.g. "10:00 - 10:45"
  activity: string;
  type: 'task' | 'break' | 'buffer';
  taskId?: string; // Optional link to actual task
  notes?: string;
}