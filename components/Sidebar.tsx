import React from 'react';
import { Language, View } from '../types';
import { getTranslation } from '../utils/translations';
import { BrainCircuit, LayoutDashboard, ListTodo, PieChart, Settings, X, CalendarClock, Target } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  currentView: View;
  onNavigate: (view: View) => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenSettings, currentView, onNavigate, lang }) => {
  const t = getTranslation(lang);

  const NavItem = ({ icon: Icon, label, onClick, active }: { icon: any, label: string, onClick?: () => void, active?: boolean }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active
          ? 'bg-primary/10 text-primary border border-primary/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Logo Area - Added top padding for Mac window controls */}
      <div className="pt-14 pb-6 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Prioria</h1>
        </div>
        {/* Mobile Close Button */}
        <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-2">
        <NavItem
          icon={LayoutDashboard}
          label={t.dashboard}
          active={currentView === 'dashboard'}
          onClick={() => {
            onNavigate('dashboard');
            onClose();
          }}
        />
        <NavItem
          icon={Target}
          label={t.goals}
          active={currentView === 'goals'}
          onClick={() => {
            onNavigate('goals');
            onClose();
          }}
        />
        <NavItem
          icon={CalendarClock}
          label={t.schedule}
          active={currentView === 'schedule'}
          onClick={() => {
            onNavigate('schedule');
            onClose();
          }}
        />
        <NavItem
          icon={PieChart}
          label={t.analytics}
          active={currentView === 'analytics'}
          onClick={() => {
            onNavigate('analytics');
            onClose();
          }}
        />
        <NavItem
          icon={ListTodo}
          label={t.allTasks}
          active={false}
          onClick={() => {
            onNavigate('dashboard');
            // Wait for state update then scroll
            setTimeout(() => {
              const el = document.getElementById('task-list-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            onClose();
          }}
        />
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-800">
        <NavItem
          icon={Settings}
          label={t.settings}
          onClick={() => {
            onOpenSettings();
            onClose();
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Static) */}
      <aside className="hidden md:flex w-64 h-full flex-col fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
          ></div>

          {/* Sidebar Panel */}
          <div className="relative w-64 h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};