import React, { useRef, useState, useEffect } from 'react';
import { X, Languages, Database, Download, Upload, Loader2, Clipboard, FileJson, CheckCircle, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, language, setLanguage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showPasteInput, setShowPasteInput] = useState(false);

    // State for Paste Import
    const [pastedJson, setPastedJson] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);

    const t = getTranslation(language);

    // --- Core Import Logic ---

    /**
     * Tries to parse the JSON string, handling Markdown code blocks.
     */
    const parseInput = (input: string): any => {
        let cleaned = input.trim();
        cleaned = cleaned.replace(/^```[a-z]*\s*/i, "");
        cleaned = cleaned.replace(/\s*```$/, "");
        return JSON.parse(cleaned);
    };

    /**
     * Validates if the object has the minimum required structure for Prioria.
     */
    const validateStructure = (data: any): boolean => {
        if (!data) return false;

        // Case 1: Full Backup Object
        if (typeof data === 'object' && Array.isArray(data.tasks)) {
            return true;
        }

        // Case 2: Simple Task Array (Legacy or partial export)
        if (Array.isArray(data)) {
            return true;
        }

        return false;
    };

    // Effect to validate pasted text in real-time
    useEffect(() => {
        if (!pastedJson.trim()) {
            setIsValid(false);
            setParsedData(null);
            return;
        }

        try {
            const data = parseInput(pastedJson);
            if (validateStructure(data)) {
                setIsValid(true);
                setParsedData(data);
            } else {
                setIsValid(false);
                setParsedData(null);
            }
        } catch (e) {
            setIsValid(false);
            setParsedData(null);
        }
    }, [pastedJson]);

    const executeBackupRestore = (data: any) => {
        try {
            let tasksToImport = [];
            let brainStateToImport = null;
            let goalsToImport = [];

            if (Array.isArray(data)) {
                // Legacy: Just an array of tasks
                tasksToImport = data;
            } else {
                // Standard Backup Object
                tasksToImport = data.tasks || [];
                brainStateToImport = data.brainState;
                goalsToImport = data.goals || [];
            }

            // Write to LocalStorage
            localStorage.setItem('prioria-tasks', JSON.stringify(tasksToImport));

            if (brainStateToImport) {
                localStorage.setItem('prioria-brainState', JSON.stringify(brainStateToImport));
            }

            if (goalsToImport.length > 0 || !Array.isArray(data)) {
                localStorage.setItem('prioria-goals', JSON.stringify(goalsToImport));
            }

            alert(t.dataSaved || "Import successful!");
            window.location.reload();

        } catch (error) {
            console.error("Backup restore failed:", error);
            alert(language === 'ja' ? "データの復元中にエラーが発生しました。" : "Error restoring data.");
        }
    };

    const handleExport = () => {
        try {
            const tasksStr = localStorage.getItem('prioria-tasks');
            const brainStateStr = localStorage.getItem('prioria-brainState');
            const goalsStr = localStorage.getItem('prioria-goals');

            const data = {
                tasks: tasksStr ? JSON.parse(tasksStr) : [],
                brainState: brainStateStr ? JSON.parse(brainStateStr) : {},
                goals: goalsStr ? JSON.parse(goalsStr) : [],
                version: 1,
                exportedAt: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `prioria-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert(language === 'ja' ? "バックアップの作成に失敗しました。" : "Failed to create backup file.");
        }
    };

    const handleFileImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!window.confirm(t.importWarning || "Overwrite current data?")) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                if (!content) throw new Error("File empty");

                const data = parseInput(content);
                if (!validateStructure(data)) throw new Error("Invalid structure");

                executeBackupRestore(data);
            } catch (err: any) {
                console.error(err);
                alert((language === 'ja' ? "ファイル読み込みエラー: " : "File Error: ") + err.message);
            }
        };

        reader.onerror = () => {
            alert("Failed to read file");
        };

        reader.readAsText(file);
    };

    const handlePasteImportSubmit = () => {
        if (!isValid) return;
        if (!window.confirm(t.importWarning)) return;
        executeBackupRestore(parsedData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Languages className="text-primary" />
                        {t.settings}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto">
                    {/* Language Settings */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
                            {t.language}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`py-3 px-4 rounded-xl border flex items-center justify-center font-bold transition-all ${language === 'en'
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLanguage('ja')}
                                className={`py-3 px-4 rounded-xl border flex items-center justify-center font-bold transition-all ${language === 'ja'
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                            >
                                日本語
                            </button>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            {t.dataManagement}
                        </label>

                        <div className="space-y-3">
                            <button
                                onClick={handleExport}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Download className="w-5 h-5 text-emerald-400" />
                                    <span className="text-slate-200 font-medium">{t.exportData}</span>
                                </div>
                                <span className="text-xs text-slate-500 group-hover:text-slate-300">.json</span>
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleFileImportClick}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors group"
                                >
                                    <FileJson className="w-5 h-5 text-blue-400" />
                                    <span className="text-slate-200 font-medium text-sm">{t.importData}</span>
                                </button>

                                <button
                                    onClick={() => setShowPasteInput(!showPasteInput)}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-all ${showPasteInput
                                            ? 'bg-primary/20 border-primary text-primary'
                                            : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                                        }`}
                                >
                                    <Clipboard className="w-5 h-5" />
                                    <span className="font-medium text-sm">{t.pasteImport}</span>
                                </button>
                            </div>

                            {/* Paste Input Area */}
                            {showPasteInput && (
                                <div className="bg-slate-900 rounded-xl p-3 border border-slate-700 animate-in fade-in slide-in-from-top-2">
                                    <textarea
                                        value={pastedJson}
                                        onChange={(e) => setPastedJson(e.target.value)}
                                        placeholder={t.pastePlaceholder}
                                        spellCheck={false}
                                        className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary resize-none mb-2"
                                    />

                                    {/* Validation Status */}
                                    {pastedJson && (
                                        <div className={`text-xs px-1 mb-2 flex items-center gap-1.5 font-medium ${isValid ? 'text-emerald-400' : 'text-slate-400'}`}>
                                            {isValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                            <span className="truncate">{isValid ? (t.validBackup || "Valid Backup") : (t.invalidData || "Invalid JSON")}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePasteImportSubmit}
                                        disabled={!isValid}
                                        className="w-full py-2 rounded-lg text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500"
                                    >
                                        {t.importButton}
                                    </button>
                                </div>
                            )}

                            {/* Hidden Input for File */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".json"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};