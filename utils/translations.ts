
import { Language } from "../types";

export const translations = {
  en: {
    appTitle: "Prioria",
    appSubtitle: "Cognitive Load Optimizer",
    settings: "Settings",
    language: "Language",
    close: "Close",

    // Sidebar
    dashboard: "Dashboard",
    history: "History",
    analytics: "Analytics",
    schedule: "Schedule",
    goals: "Goals",

    // Schedule
    scheduleTitle: "Daily Planner",
    scheduleDesc: "Prioria constructs the optimal flow based on your fatigue and tasks.",
    availability: "How much time do you have?",
    availabilityPlaceholder: "e.g., Until 5 PM, or 3 hours",
    generateSchedule: "Generate Schedule",
    generatingPlan: "Constructing Plan...",
    yourPlan: "Your Optimized Plan",
    planNote: "Includes brain breaks based on your fatigue level.",

    // Goals
    goalsTitle: "Long-term Goals",
    goalsDesc: "Define your big objectives. The system will help break them down.",
    addGoal: "Add New Goal",
    createGoal: "Create Goal",
    goalTitle: "Goal Title",
    goalDescription: "Description",
    goalDeadline: "Target Date",
    noGoals: "No goals set yet.",
    linkedTasks: "Linked Tasks",
    progress: "Progress",
    generateTasks: "Generate Tasks",
    generatingTasks: "Breaking down goal...",
    selectGoal: "Link to Goal (Optional)",

    // Analytics
    analyticsTitle: "Cognitive Analytics",
    totalTasks: "Active Tasks",
    avgLoad: "Avg. Load",
    totalTime: "Total Hours",
    loadDistribution: "Cognitive Load Distribution",
    typeDistribution: "Task Type Breakdown",
    weeklyTrend: "Weekly Focus Trend",
    completionRate: "Completion Rate",
    highLoad: "High Load",
    medLoad: "Med Load",
    lowLoad: "Low Load",

    // BrainGauge & Gamification
    fatigue: "Fatigue Level",
    energy: "Energy Level",
    motivation: "Motivation",
    fresh: "Fresh",
    tired: "Tired",
    exhausted: "Exhausted",
    burntOut: "Burnt Out",
    meh: "\"Meh\"",
    letsGo: "\"Let's Go!\"",
    level: "Level",
    xp: "BP",
    nextLevel: "Next",
    takeBreak: "Take a Break",
    breakSuggestion: "Recommended Recovery",

    // AddTask
    addTaskButton: "Add New Task",
    brainDump: "New Task",
    brainDumpDesc: "Enter task details.",
    quickTemplates: "Quick Templates",
    placeholder: "Task title...",
    cancel: "Cancel",
    addToBrain: "Add Task",
    analyzing: "Saving...",
    isRecurring: "Recurring Task",
    recurrence: {
      none: "One-time",
      daily: "Daily",
      weekly: "Weekly"
    },

    // Templates
    tplMath: "Math Problems",
    tplReading: "Reading",
    tplVocab: "Vocab Review",
    tplEssay: "Writing Essay",
    tplReview: "Class Review",

    // HeroTask & Focus
    consulting: "Calculating Priority...",
    consultingDesc: "Applying localized algorithm based on your state.",
    noTasks: "No active tasks",
    noTasksDesc: "Add tasks to see recommendations.",
    recommendedNow: "Top Priority",
    markComplete: "Mark Complete",
    startVoice: "Start Voice Session",
    startFocus: "Start Focus Mode",
    minutes: "min",
    why: "Why?",
    focusMode: "Deep Focus Mode",
    focusDesc: "Focus on this single task. No distractions.",
    stopTimer: "Stop Timer",
    pause: "Pause",
    resume: "Resume",
    finish: "Finish Task",
    needHint: "Need a Hint?",
    consultingAI: "Analyzing...",
    aiHint: "Hint",

    // Voice Session - Removing AI parts
    voiceActive: "Voice Session",
    generatingQuery: "Loading...",
    listening: "Listening...",
    tapToAnswer: "Tap mic to answer",

    // Reflection
    reflectionTitle: "Task Reflection",
    reflectionDesc: "How did it feel compared to your expectation?",
    refEasy: "Easier",
    refNormal: "As Expected",
    refHard: "Harder",
    refBonus: "Reflection Bonus",

    // TaskList & Filters
    allTasks: "All Tasks",
    load: "Load",
    due: "Due",
    overdue: "Overdue",
    today: "Today",
    tomorrow: "Tomorrow",
    breakDown: "Decompose",
    steps: "Steps",
    generatingSteps: "Loading...",
    filterAll: "All",
    filterQuick: "Quick (<15m)",
    filterLowLoad: "Low Energy",
    filterUrgent: "Urgent",

    // Edit Task
    editTask: "Edit Task",
    saveChanges: "Save Changes",
    title: "Title",
    description: "Description",
    estimatedMinutes: "Est. Minutes",
    deadline: "Deadline",
    manualOverride: "Manual Override",

    // Settings & Data
    dataManagement: "Data Management",
    exportData: "Export Backup",
    importData: "Import File",
    pasteImport: "Paste Backup",
    pastePlaceholder: "Paste backup JSON here...",
    importButton: "Restore Backup",
    smartImportButton: "Smart Add",
    importWarning: "This will overwrite your current data.",
    smartImportWarning: "This will append new tasks.",
    dataSaved: "Data imported successfully!",
    validBackup: "Valid Backup Data",
    validText: "Text detected",
    invalidData: "Invalid data format",

    // Enums
    difficulty: {
      Low: "Low",
      Medium: "Medium",
      High: "High"
    },
    taskType: {
      Memorization: "Memorization",
      Comprehension: "Comprehension",
      Creation: "Creation",
      Logic: "Logic",
      Routine: "Routine"
    }
  },
  ja: {
    appTitle: "Prioria",
    appSubtitle: "認知負荷最適化ツール (Local)",
    settings: "設定",
    language: "言語 / Language",
    close: "閉じる",

    // Sidebar
    dashboard: "ダッシュボード",
    history: "履歴",
    analytics: "分析",
    schedule: "スケジュール",
    goals: "長期目標",

    // Schedule
    scheduleTitle: "プランニング",
    scheduleDesc: "（現在自動スケジュール機能は無効です）",
    availability: "使える時間は？",
    availabilityPlaceholder: "例: 17時まで、あと3時間など",
    generateSchedule: "スケジュール生成",
    generatingPlan: "処理中...",
    yourPlan: "最適化されたプラン",
    planNote: "プランを確認してください。",

    // Goals
    goalsTitle: "長期目標",
    goalsDesc: "大きな目標を設定しましょう。",
    addGoal: "目標を追加",
    createGoal: "目標を作成",
    goalTitle: "目標のタイトル",
    goalDescription: "詳細・メモ",
    goalDeadline: "達成期限",
    noGoals: "目標はまだ設定されていません。",
    linkedTasks: "関連タスク",
    progress: "進捗",
    generateTasks: "タスク生成",
    generatingTasks: "処理中...",
    selectGoal: "目標に紐付ける (任意)",

    // Analytics
    analyticsTitle: "認知負荷分析",
    totalTasks: "アクティブタスク",
    avgLoad: "平均負荷スコア",
    totalTime: "合計想定時間",
    loadDistribution: "認知負荷の分布",
    typeDistribution: "タスクタイプ内訳",
    weeklyTrend: "週間集中トレンド",
    completionRate: "完了率",
    highLoad: "高負荷",
    medLoad: "中負荷",
    lowLoad: "低負荷",

    // BrainGauge & Gamification
    fatigue: "疲労度",
    energy: "元気度",
    motivation: "やる気",
    fresh: "元気",
    tired: "疲れ気味",
    exhausted: "限界",
    burntOut: "燃え尽き",
    meh: "微妙",
    letsGo: "やるぞ！",
    level: "Lv.",
    xp: "BP",
    nextLevel: "あと",
    takeBreak: "休憩する",
    breakSuggestion: "おすすめの回復アクション",

    // AddTask
    addTaskButton: "タスクを追加",
    brainDump: "新規タスク",
    brainDumpDesc: "タスクの詳細を入力してください。",
    quickTemplates: "テンプレートから入力",
    placeholder: "タスク名を入力...",
    cancel: "キャンセル",
    addToBrain: "追加する",
    analyzing: "保存中...",
    isRecurring: "繰り返し設定",
    recurrence: {
      none: "繰り返しなし",
      daily: "毎日",
      weekly: "毎週"
    },

    // Templates
    tplMath: "数学の問題集",
    tplReading: "読書・教科書",
    tplVocab: "単語暗記",
    tplEssay: "レポート作成",
    tplReview: "授業の復習",

    // HeroTask & Focus
    consulting: "優先順位を計算中...",
    consultingDesc: "現在の状態と重要度に基づいて最適なタスクを選定しています。",
    noTasks: "タスクがありません",
    noTasksDesc: "タスクを追加して優先順位を確認しましょう。",
    recommendedNow: "最優先タスク",
    markComplete: "完了にする",
    startVoice: "音声セッション開始",
    startFocus: "集中モード開始",
    minutes: "分",
    why: "選定理由",
    focusMode: "ディープフォーカス",
    focusDesc: "このタスクだけに集中しましょう。中断禁止。",
    stopTimer: "終了",
    pause: "一時停止",
    resume: "再開",
    finish: "タスク完了！",
    needHint: "ヒント",
    consultingAI: "分析中...",
    aiHint: "ヒント",

    // Voice Session
    voiceActive: "音声セッション",
    generatingQuery: "ロード中...",
    listening: "聞き取り中...",
    tapToAnswer: "マイクをタップして回答",

    // Reflection
    reflectionTitle: "振り返り",
    reflectionDesc: "予想と比べてどう感じましたか？",
    refEasy: "楽だった",
    refNormal: "予想通り",
    refHard: "キツかった",
    refBonus: "振り返りボーナス",

    // TaskList & Filters
    allTasks: "すべてのタスク",
    load: "負荷",
    due: "期限",
    overdue: "期限切れ",
    today: "今日",
    tomorrow: "明日",
    breakDown: "分解",
    steps: "ステップ",
    generatingSteps: "生成中...",
    filterAll: "すべて",
    filterQuick: "サクッと (<15分)",
    filterLowLoad: "省エネ",
    filterUrgent: "急ぎ",

    // Edit Task
    editTask: "タスク編集",
    saveChanges: "変更を保存",
    title: "タイトル",
    description: "説明・メモ",
    estimatedMinutes: "所要時間 (分)",
    deadline: "期限",
    manualOverride: "手動設定",

    // Settings & Data
    dataManagement: "データ管理",
    exportData: "バックアップを保存",
    importData: "ファイルを読み込む",
    pasteImport: "バックアップ復元(ペースト)",
    pastePlaceholder: "バックアップJSONをここに貼り付けてください...",
    importButton: "復元実行",
    smartImportButton: "スマート登録",
    importWarning: "現在のデータは上書きされます。",
    smartImportWarning: "タスクを追加します。",
    dataSaved: "データを保存しました！",
    validBackup: "有効なバックアップデータ",
    validText: "テキスト検出",
    invalidData: "データ形式が不明です",

    // Enums
    difficulty: {
      Low: "低",
      Medium: "中",
      High: "高"
    },
    taskType: {
      Memorization: "暗記",
      Comprehension: "理解",
      Creation: "創造",
      Logic: "論理",
      Routine: "ルーチン"
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];