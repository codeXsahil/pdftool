import React, { useState } from 'react';
import {
    BarChart2, SpellCheck, Globe, LayoutTemplate, Accessibility, Palette,
    AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import type { QualityAnalysis } from '../utils/pdfUtils';

interface QualityToolsProps {
    analysis?: QualityAnalysis | null;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

export const QualityTools: React.FC<QualityToolsProps> = ({
    analysis,
    onAnalyze,
    isAnalyzing
}) => {
    const [activeTab, setActiveTab] = useState<'heatmap' | 'grammar' | 'margins' | 'accessibility'>('heatmap');

    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
                <div className="bg-slate-700/50 p-4 rounded-full mb-4">
                    <Accessibility size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Quality & Accessibility Check</h3>
                <p className="text-slate-400 mb-6 max-w-md">
                    Analyze your PDF for keyword density, spelling errors, language mismatches, print margins, and WCAG accessibility compliance.
                </p>
                <button
                    onClick={onAnalyze}
                    disabled={isAnalyzing}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center gap-2"
                >
                    {isAnalyzing ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <BarChart2 size={18} />
                            Run Full Analysis
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('heatmap')}
                    className={`flex-1 min-w-[100px] py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'heatmap' ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        }`}
                >
                    <BarChart2 size={16} />
                    Keywords
                </button>
                <button
                    onClick={() => setActiveTab('grammar')}
                    className={`flex-1 min-w-[100px] py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'grammar' ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        }`}
                >
                    <SpellCheck size={16} />
                    Grammar
                </button>
                <button
                    onClick={() => setActiveTab('margins')}
                    className={`flex-1 min-w-[100px] py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'margins' ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        }`}
                >
                    <LayoutTemplate size={16} />
                    Margins
                </button>
                <button
                    onClick={() => setActiveTab('accessibility')}
                    className={`flex-1 min-w-[100px] py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'accessibility' ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        }`}
                >
                    <Accessibility size={16} />
                    WCAG Audit
                </button>
            </div>

            <div className="p-6">
                {activeTab === 'heatmap' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BarChart2 className="text-blue-400" />
                            Keyword Heatmap
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {analysis.heatmap.map((item, i) => (
                                <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                                    <span className="text-slate-300 font-medium truncate" title={item.word}>{item.word}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-12 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${Math.min(100, item.density * 1000)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {analysis.heatmap.length === 0 && (
                            <p className="text-slate-500 italic text-center">No significant keywords found.</p>
                        )}
                    </div>
                )}

                {activeTab === 'grammar' && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Language Check */}
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                    <Globe size={16} className="text-purple-400" />
                                    Language Detection
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Declared Metadata:</span>
                                        <span className="text-white font-mono">{analysis.languageMismatch.declared}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Detected Content:</span>
                                        <span className="text-white font-mono uppercase">{analysis.languageMismatch.detected}</span>
                                    </div>
                                    {analysis.languageMismatch.isMismatch ? (
                                        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300 flex items-center gap-2">
                                            <AlertTriangle size={12} />
                                            Mismatch detected! This may confuse screen readers.
                                        </div>
                                    ) : (
                                        <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-300 flex items-center gap-2">
                                            <CheckCircle size={12} />
                                            Language metadata matches content.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Spell Check */}
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                    <SpellCheck size={16} className="text-red-400" />
                                    Potential Typos
                                </h4>
                                {analysis.spellingErrors.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.spellingErrors.map((word, i) => (
                                            <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-300 rounded text-xs">
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No common typos detected.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'margins' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <LayoutTemplate className="text-orange-400" />
                            Print & Layout Check
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <h4 className="font-semibold text-white mb-2">Margins & Bleed</h4>
                                {analysis.marginIssues.length > 0 ? (
                                    <ul className="space-y-2">
                                        {analysis.marginIssues.map((issue, i) => (
                                            <li key={i} className="text-sm text-orange-300 flex items-start gap-2">
                                                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                                <span>Page {issue.page}: {issue.issue}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-400 text-sm">
                                        <CheckCircle size={16} />
                                        No critical margin issues detected.
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <h4 className="font-semibold text-white mb-2">Contrast Analysis</h4>
                                {analysis.contrastIssues.length > 0 ? (
                                    <ul className="space-y-2">
                                        {analysis.contrastIssues.map((issue, i) => (
                                            <li key={i} className="text-sm text-yellow-300 flex items-start gap-2">
                                                <Palette size={14} className="mt-0.5 shrink-0" />
                                                <span>{issue.text} (Ratio: {issue.contrastRatio})</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-400 text-sm">
                                        <CheckCircle size={16} />
                                        Text contrast appears adequate.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'accessibility' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Accessibility className="text-green-400" />
                                WCAG Accessibility Audit
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400">Score:</span>
                                <span className={`text-xl font-bold ${analysis.accessibility.score >= 90 ? 'text-green-400' :
                                    analysis.accessibility.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {analysis.accessibility.score}/100
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <div className={`p-3 rounded-lg border flex items-center justify-between ${analysis.accessibility.hasTitle ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                                }`}>
                                <span className="text-slate-200 text-sm">Document Title</span>
                                {analysis.accessibility.hasTitle ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
                            </div>

                            <div className={`p-3 rounded-lg border flex items-center justify-between ${analysis.accessibility.hasLanguage ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                                }`}>
                                <span className="text-slate-200 text-sm">Language Definition</span>
                                {analysis.accessibility.hasLanguage ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
                            </div>

                            <div className={`p-3 rounded-lg border flex flex-col gap-1 ${analysis.accessibility.isTagged ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                                }`}>
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-slate-200 text-sm font-medium">Tagged PDF (Accessibility)</span>
                                    {analysis.accessibility.isTagged ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
                                </div>
                                {!analysis.accessibility.isTagged && (
                                    <p className="text-xs text-slate-400">
                                        This document lacks a hidden tag structure (like HTML). It will be difficult for screen readers to read.
                                        <br /><span className="opacity-75 italic">Note: This does not affect printing or visual layout.</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {analysis.accessibility.issues.length > 0 && (
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <h4 className="font-semibold text-white mb-2 text-sm">Remediation Steps</h4>
                                <ul className="space-y-1 list-disc list-inside text-sm text-slate-400">
                                    {analysis.accessibility.issues.map((issue, i) => (
                                        <li key={i}>{issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
