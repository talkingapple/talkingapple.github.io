import React from 'react';
import { Task, Language, Difficulty, TaskType } from '../types';
import { getTranslation } from '../utils/translations';
import { PieChart, Clock, Brain, Activity, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  lang: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, lang }) => {
  const t = getTranslation(lang);

  // Calculations
  const totalTasks = tasks.length;
  const totalLoadScore = tasks.reduce((acc, t) => acc + t.cognitiveLoadScore, 0);
  const avgLoad = totalTasks > 0 ? (totalLoadScore / totalTasks).toFixed(1) : "0.0";
  const totalMinutes = tasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Distribution Data
  const highLoadCount = tasks.filter(t => t.difficulty === Difficulty.HIGH).length;
  const medLoadCount = tasks.filter(t => t.difficulty === Difficulty.MEDIUM).length;
  const lowLoadCount = tasks.filter(t => t.difficulty === Difficulty.LOW).length;

  const getTypeCount = (type: TaskType) => tasks.filter(t => t.type === type).length;
  
  // Custom Donut Chart Component
  const TaskTypeChart = () => {
    const types = Object.values(TaskType);
    const data = types.map(type => ({ type, count: getTypeCount(type) })).filter(d => d.count > 0);
    const total = data.reduce((acc, d) => acc + d.count, 0);
    
    if (total === 0) return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-500">
        <PieChart className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-sm">No data available</span>
      </div>
    );

    let cumulativePercent = 0;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#818cf8'];
    const bgColors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-warning', 'bg-indigo-400'];

    return (
      <div className="flex flex-col md:flex-row items-center gap-8 py-4">
        {/* Visual Chart - SVG Implementation */}
        <div className="relative w-40 h-40 shrink-0">
           <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
             {data.map((d, i) => {
               const percent = d.count / total;
               const strokeDasharray = `${percent * circumference} ${circumference}`;
               const strokeDashoffset = -cumulativePercent * circumference;
               cumulativePercent += percent;
               
               return (
                 <circle
                   key={d.type}
                   cx="50"
                   cy="50"
                   r={radius}
                   fill="none"
                   strokeWidth="12"
                   stroke={colors[i % 5]}
                   strokeDasharray={strokeDasharray}
                   strokeDashoffset={strokeDashoffset}
                   className="transition-all duration-500 ease-out hover:opacity-80"
                 />
               );
             })}
           </svg>
           
           <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
             <span className="text-2xl font-bold text-white">{total}</span>
             <span className="text-xs text-slate-500">Tasks</span>
           </div>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          {data.map((d, i) => {
             return (
               <div key={d.type} className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${bgColors[i % 5]} shrink-0`} />
                 <div className="flex flex-col min-w-0">
                   <span className="text-xs font-bold text-slate-300 truncate">{d.type}</span>
                   <span className="text-[10px] text-slate-500">{d.count} tasks ({Math.round(d.count/total*100)}%)</span>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    );
  };

  // Mock Trend Graph (SVG)
  const MockTrendGraph = () => (
    <div className="w-full h-40 flex items-end justify-between gap-1 pt-8 pb-2 px-2">
        {[4, 6, 5, 8, 7, 5, 8].map((h, i) => (
            <div key={i} className="group relative flex-1 flex flex-col justify-end gap-2 items-center h-full">
                 <div 
                    className="w-full bg-primary/20 border-t-2 border-primary rounded-t-sm transition-all group-hover:bg-primary/40"
                    style={{ height: `${h * 10}%` }}
                 ></div>
                 <span className="text-[10px] text-slate-600 font-mono">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                 </span>
                 {/* Tooltip */}
                 <div className="absolute -top-8 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Focus: {h}/10
                 </div>
            </div>
        ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{t.analyticsTitle}</h2>
          <span className="text-xs font-mono text-slate-500">Updated: Just now</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-slate-700/50">
           <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs text-slate-500 font-medium">+12% vs last week</span>
           </div>
           <div className="text-3xl font-bold text-white mb-1">{totalTasks}</div>
           <div className="text-sm text-slate-400">{t.totalTasks}</div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-slate-700/50">
           <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Brain className="w-5 h-5 text-secondary" />
              </div>
              <span className={`text-xs font-medium ${Number(avgLoad) > 7 ? 'text-red-400' : 'text-emerald-400'}`}>
                {Number(avgLoad) > 7 ? 'Heavy Load' : 'Balanced'}
              </span>
           </div>
           <div className="text-3xl font-bold text-white mb-1">{avgLoad}</div>
           <div className="text-sm text-slate-400">{t.avgLoad} (1-10)</div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-slate-700/50">
           <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs text-slate-500 font-medium">Est. Duration</span>
           </div>
           <div className="text-3xl font-bold text-white mb-1">{totalHours}<span className="text-lg text-slate-500 font-normal ml-1">hr</span></div>
           <div className="text-sm text-slate-400">{t.totalTime}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Load Distribution */}
          <div className="bg-surface p-6 rounded-2xl border border-slate-700/50">
             <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                {t.loadDistribution}
             </h3>
             
             <div className="space-y-4">
                {/* High Load Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-red-400 font-medium">{t.highLoad}</span>
                        <span className="text-slate-400">{highLoadCount} tasks</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-red-500 rounded-full transition-all duration-1000"
                            style={{ width: `${totalTasks ? (highLoadCount / totalTasks) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Medium Load Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-yellow-400 font-medium">{t.medLoad}</span>
                        <span className="text-slate-400">{medLoadCount} tasks</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                            style={{ width: `${totalTasks ? (medLoadCount / totalTasks) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Low Load Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-emerald-400 font-medium">{t.lowLoad}</span>
                        <span className="text-slate-400">{lowLoadCount} tasks</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                            style={{ width: `${totalTasks ? (lowLoadCount / totalTasks) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>
             </div>
          </div>

          {/* Task Types Pie */}
          <div className="bg-surface p-6 rounded-2xl border border-slate-700/50">
             <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-slate-400" />
                {t.typeDistribution}
             </h3>
             <TaskTypeChart />
          </div>
      </div>

      {/* Weekly Trend (Mock) */}
      <div className="bg-surface p-6 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                {t.weeklyTrend}
            </h3>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Last 7 Days</span>
          </div>
          <div className="w-full bg-slate-900/50 rounded-xl border border-slate-800/50 relative">
             <MockTrendGraph />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
             Simulated data: Your daily average focus score based on completed tasks.
          </p>
      </div>

      {/* Bottom Spacer */}
      <div className="h-20"></div>
    </div>
  );
};