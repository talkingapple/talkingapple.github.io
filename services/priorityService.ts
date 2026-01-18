
import { Task, BrainState, TaskType, Difficulty, RecommendationResponse, Language } from "../types";

export const calculateCognitiveLoad = (type: TaskType, difficulty: Difficulty, minutes: number): number => {
    let baseLoad = 0;

    // Type Base
    switch (type) {
        case TaskType.MEMORIZATION: baseLoad = 6; break;
        case TaskType.COMPREHENSION: baseLoad = 7; break;
        case TaskType.CREATION: baseLoad = 8; break;
        case TaskType.LOGIC: baseLoad = 9; break;
        case TaskType.ROUTINE: baseLoad = 3; break;
        default: baseLoad = 5;
    }

    // Difficulty Modifier
    switch (difficulty) {
        case Difficulty.LOW: baseLoad -= 2; break;
        case Difficulty.MEDIUM: break; // +0
        case Difficulty.HIGH: baseLoad += 2; break;
    }

    // Duration Modifier (longer tasks = more draining)
    if (minutes > 60) baseLoad += 1;
    if (minutes < 15) baseLoad -= 1;

    // Clamp between 1-10
    return Math.max(1, Math.min(10, baseLoad));
};

export const getPrioritizedTask = (tasks: Task[], state: BrainState, lang: Language): RecommendationResponse | null => {
    if (tasks.length === 0) return null;

    let bestTask: Task | null = null;
    let maxScore = -Infinity;
    let reasoning = "";

    tasks.forEach(task => {
        let score = 0;

        // 1. Urgency (Deadline)
        if (task.deadline) {
            const now = Date.now();
            const due = new Date(task.deadline).getTime();
            const hoursLeft = (due - now) / (1000 * 60 * 60);

            if (hoursLeft < 0) score += 100; // Overdue!
            else if (hoursLeft < 24) score += 50; // Due today
            else if (hoursLeft < 72) score += 20; // Due within 3 days
        }

        // 2. Importance (User defined)
        score += (task.importance || 1) * 5; // Scale 1-5 -> 5-25 points

        // 3. Brain State Matching
        // Fatigue vs Load
        if (state.fatigue > 7) {
            // High Fatigue: Penalize High Load
            if (task.cognitiveLoadScore > 6) score -= 20;
            else score += 10; // Bonus for low load
        } else if (state.fatigue < 4) {
            // Fresh: Boost High Load / High Importance
            if (task.cognitiveLoadScore > 6) score += 15;
        }

        // Motivation vs Quick Wins
        if (state.motivation < 4) {
            // Low Motivation: Boost Short tasks
            if (task.estimatedMinutes <= 20) score += 15;
        }

        if (score > maxScore) {
            maxScore = score;
            bestTask = task;
        }
    });

    if (!bestTask) bestTask = tasks[0];

    // Generate Reasoning
    const t = bestTask as Task; // valid because of check above
    const isTired = state.fatigue > 7;
    const isUrgent = t.deadline && (new Date(t.deadline).getTime() - Date.now() < 24 * 60 * 60 * 1000);

    if (lang === 'ja') {
        if (isUrgent) {
            reasoning = "締め切りが迫っています。最優先で取り組みましょう。";
        } else if (isTired && t.cognitiveLoadScore < 5) {
            reasoning = "お疲れのようですので、負担の少ないこのタスクがおすすめです。";
        } else if (t.importance >= 4) {
            reasoning = "重要度が高いタスクです。集中して進めましょう。";
        } else {
            reasoning = "バランスの良いタスクです。";
        }
    } else {
        if (isUrgent) {
            reasoning = "Deadline is approaching. This is top priority.";
        } else if (isTired && t.cognitiveLoadScore < 5) {
            reasoning = "You seem tired. This low-load task is recommended.";
        } else if (t.importance >= 4) {
            reasoning = "This is a high importance task. Let's focus.";
        } else {
            reasoning = "This is a well-balanced task to start with.";
        }
    }

    const action = lang === 'ja'
        ? `${t.estimatedMinutes}分、集中しましょう。`
        : `Focus for ${t.estimatedMinutes} minutes.`;

    return {
        taskId: t.id,
        reasoning: reasoning,
        suggestedAction: action,
        voiceModeAvailable: false
    };
};

// ... existing code ...

export interface ScheduleItem {
    time: string;
    activity: string;
    type: 'task' | 'break' | 'buffer';
    duration: number;
    notes?: string;
}

export const generateDeterministicSchedule = (
    tasks: Task[],
    state: BrainState,
    availabilityInput: string,
    lang: Language
): ScheduleItem[] => {
    // 1. Parse Availability (Simple heuristics)
    let availableMinutes = 120; // Default 2 hours
    const input = availabilityInput.toLowerCase();

    // "X hours" or "X h"
    const hourMatch = input.match(/(\d+)\s*(h|hour)/);
    if (hourMatch) availableMinutes = parseInt(hourMatch[1]) * 60;

    // "X minutes" or "X min" or "X m"
    const minMatch = input.match(/(\d+)\s*(m|min)/);
    if (minMatch) availableMinutes = parseInt(minMatch[1]);

    // "Until X pm" (Simple calc assuming today)
    if (input.includes('until') || input.includes('by')) {
        const timeMatch = input.match(/(\d+)(?::(\d+))?\s*(am|pm)?/);
        if (timeMatch) {
            let hour = parseInt(timeMatch[1]);
            const minute = parseInt(timeMatch[2] || '0');
            const ampm = timeMatch[3];

            if (ampm === 'pm' && hour < 12) hour += 12;
            if (ampm === 'am' && hour === 12) hour = 0;

            const now = new Date();
            const target = new Date();
            target.setHours(hour, minute, 0, 0);

            if (target.getTime() < now.getTime()) {
                // Assume tomorrow? Or just ignore. Let's assume user means later today for now.
                // If past, maybe it's tomorrow, but safe fallback to default.
            } else {
                availableMinutes = Math.floor((target.getTime() - now.getTime()) / 60000);
            }
        }
    }

    // 2. Determine Strategy based on Brain State
    const isFatigued = state.fatigue >= 7;
    const workBlock = isFatigued ? 45 : 60; // Shorter blocks when tired
    const breakDuration = isFatigued ? 15 : 10;

    const schedule: ScheduleItem[] = [];
    let currentTime = new Date();
    // Round up to next 5 minutes
    currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 5) * 5);

    // 3. Sort Tasks by Priority (Reuse existing logic logic implicitly or explicitly)
    // We'll simplisticly re-score them here to get order
    const scoredTasks = tasks
        .filter(t => t.status === 'pending')
        .map(t => {
            let score = t.cognitiveLoadScore; // Base: lower load might be better? No, algorithm prefers high score items.
            // Let's reuse getPrioritizedTask logic roughly
            let pScore = 0;
            if (t.deadline) pScore += 20; // Urgency
            pScore += (t.importance || 1) * 5;
            // Fatigue Penalty/Bonus
            if (isFatigued && t.cognitiveLoadScore > 6) pScore -= 10;
            if (!isFatigued && t.cognitiveLoadScore > 6) pScore += 10;

            return { task: t, score: pScore };
        })
        .sort((a, b) => b.score - a.score);

    let remainingMinutes = availableMinutes;
    let timeSinceBreak = 0;

    for (const item of scoredTasks) {
        const t = item.task;
        if (remainingMinutes <= 0) break;
        if (remainingMinutes < 15) break; // Too short for anything

        // Check if we need a break first
        if (timeSinceBreak >= workBlock) {
            schedule.push({
                time: formatTime(currentTime),
                activity: lang === 'ja' ? '休憩' : 'Break',
                type: 'break',
                duration: breakDuration,
                notes: lang === 'ja' ? '脳を休めましょう' : 'Recharge your brain'
            });
            currentTime = addMinutes(currentTime, breakDuration);
            remainingMinutes -= breakDuration;
            timeSinceBreak = 0;
            if (remainingMinutes <= 0) break;
        }

        // Fit task
        // If task is longer than remaining time, should we split it? 
        // For simple MVP: Just constrain it.
        const durationToAllocate = Math.min(t.estimatedMinutes, remainingMinutes, workBlock - timeSinceBreak);

        // If task is actually huge (e.g. 120min) but we only allocate 60, ideally we note that.
        // For MVP, simply list it.

        schedule.push({
            time: formatTime(currentTime),
            activity: t.title,
            type: 'task',
            duration: durationToAllocate,
            notes: durationToAllocate < t.estimatedMinutes ? (lang === 'ja' ? '(一部実施)' : '(Partial)') : undefined
        });

        currentTime = addMinutes(currentTime, durationToAllocate);
        remainingMinutes -= durationToAllocate;
        timeSinceBreak += durationToAllocate;
    }

    // Buffer at the end if time remains
    if (remainingMinutes > 10) {
        schedule.push({
            time: formatTime(currentTime),
            activity: lang === 'ja' ? 'バッファ / 予備' : 'Buffer / Spare Time',
            type: 'buffer',
            duration: remainingMinutes,
            notes: lang === 'ja' ? '遅れを取り戻す時間' : 'Catch up on tasks'
        });
    }

    return schedule;
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const addMinutes = (date: Date, min: number): Date => {
    return new Date(date.getTime() + min * 60000);
};
