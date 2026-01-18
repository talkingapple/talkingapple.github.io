import React, { useState } from 'react';
import { BrainState, Language } from '../types';
import { BatteryCharging, Trophy, Coffee, X } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface BrainGaugeProps {
    state: BrainState;
    onChange: (newState: BrainState) => void;
    lang: Language;
}

export const BrainGauge: React.FC<BrainGaugeProps> = ({ state, onChange, lang }) => {
    const t = getTranslation(lang);
    const [showBreak, setShowBreak] = useState(false);

    const handleEnergyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // UI is Energy (1-10), State is Fatigue (1-10)
        // Energy 10 = Fatigue 1
        // Energy 1 = Fatigue 10
        const energyVal = parseInt(e.target.value);
        const newFatigue = 11 - energyVal;
        onChange({ ...state, fatigue: newFatigue, lastUpdated: Date.now() });
    };

    const handleMotivationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...state, motivation: parseInt(e.target.value), lastUpdated: Date.now() });
    };

    const getEnergyColor = (fatigueVal: number) => {
        // High Energy (Low Fatigue) = Green
        if (fatigueVal < 4) return 'text-success'; // Fresh
        if (fatigueVal < 8) return 'text-warning'; // Tired 
        return 'text-danger'; // Exhausted
    };

    const getEnergyText = (fatigueVal: number) => {
        if (fatigueVal < 4) return t.fresh;
        if (fatigueVal < 8) return t.tired;
        return t.exhausted;
    };

    // Gamification Logic
    // XP required for next level = 100 * level
    const xpForNextLevel = 100 * state.level;
    const progressPercent = Math.min(100, (state.xp / xpForNextLevel) * 100);

    const breaks = [
        { en: "4-7-8 Breathing (2 min)", ja: "4-7-8呼吸法 (2分)" },
        { en: "Drink Water & Stretch", ja: "水分補給＆背伸び" },
        { en: "Close Eyes (1 min)", ja: "目を閉じて深呼吸 (1分)" },
        { en: "Walk around room", ja: "部屋を少し歩く" }
    ];

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden">

            {/* Gamification Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[10px] font-bold px-1.5 rounded-full border border-slate-700">
                            {state.level}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.level} {state.level}</div>
                        <div className="flex items-center gap-1 text-white font-bold text-lg">
                            <span className="text-yellow-500">{state.xp}</span>
                            <span className="text-xs text-slate-500">/ {xpForNextLevel} {t.xp}</span>
                        </div>
                    </div>
                </div>
                <div className="w-24">
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-right text-slate-500 mt-1">{t.nextLevel} {xpForNextLevel - state.xp} {t.xp}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <BatteryCharging className="w-4 h-4 text-primary" />
                    {lang === 'ja' ? '現在の脳状態' : 'Current Brain State'}
                </h2>

                {/* Break Button */}
                <button
                    onClick={() => setShowBreak(!showBreak)}
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${showBreak ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <Coffee className="w-3 h-3" />
                    {t.takeBreak}
                </button>
            </div>

            {showBreak ? (
                <div className="bg-slate-800/50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{t.breakSuggestion}</span>
                        <button onClick={() => setShowBreak(false)}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
                    </div>
                    <ul className="space-y-2">
                        {breaks.map((b, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {lang === 'ja' ? b.ja : b.en}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Energy Slider (Inverted Fatigue) */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300">{t.energy}</label>
                            <span className={`font-bold ${getEnergyColor(state.fatigue)}`}>
                                {getEnergyText(state.fatigue)} ({11 - state.fatigue}/10)
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={11 - state.fatigue}
                            onChange={handleEnergyChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>{t.burntOut}</span>
                            <span>{t.fresh}</span>
                        </div>
                    </div>

                    {/* Motivation Slider */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300">{t.motivation}</label>
                            <span className="text-primary font-bold">{state.motivation}/10</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={state.motivation}
                            onChange={handleMotivationChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>{t.meh}</span>
                            <span>{t.letsGo}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};