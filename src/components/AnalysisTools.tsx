import React, { useState } from 'react';
import { Type, Link as LinkIcon, AlertTriangle, ExternalLink, History, MapPin } from 'lucide-react';
import type { FontColorAnalysis, LinkAnalysis, HistoryAnalysis } from '../utils/pdfUtils';

interface AnalysisToolsProps {
    fontAnalysis?: FontColorAnalysis | null;
    linkAnalysis?: LinkAnalysis | null;
    historyAnalysis?: HistoryAnalysis | null;
    geoAnalysis?: string[] | null;
    onAnalyzeFonts: () => void;
    onAnalyzeLinks: () => void;
    onAnalyzeHistory: () => void;
    onAnalyzeGeo: () => void;
}

export const AnalysisTools: React.FC<AnalysisToolsProps> = ({
    fontAnalysis,
    linkAnalysis,
    historyAnalysis,
    geoAnalysis,
    onAnalyzeFonts,
    onAnalyzeLinks,
    onAnalyzeHistory,
    onAnalyzeGeo
}) => {
    const [activeTab, setActiveTab] = useState<'fonts' | 'links' | 'history' | 'geo'>('fonts');

    return (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('fonts')}
                    className={`flex-1 min-w-[100px] py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'fonts' ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        }`}
                >
                    <Type size={16} />
                    Fonts
                </button>
                <button
                    onClick={() => setActiveTab('links')}
                    className={`flex-1 min-w-[100px] py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'links' ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        }`}
                >
                    <LinkIcon size={16} />
                    Links
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 min-w-[100px] py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'history' ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        }`}
                >
                    <History size={16} />
                    History
                </button>
                <button
                    onClick={() => setActiveTab('geo')}
                    className={`flex-1 min-w-[100px] py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'geo' ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        }`}
                >
                    <MapPin size={16} />
                    Geo
                </button>
            </div>

            <div className="p-6">
                {activeTab === 'fonts' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Font Analysis</h3>
                            <button
                                onClick={onAnalyzeFonts}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                            >
                                Scan Fonts
                            </button>
                        </div>

                        {fontAnalysis ? (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-2">Detected Fonts</h4>
                                    {fontAnalysis.fonts.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {fontAnalysis.fonts.map((font, i) => (
                                                <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-200 border border-slate-600">
                                                    {font}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">No fonts detected or standard fonts used.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">
                                Click "Scan Fonts" to analyze used fonts.
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Link Inspector</h3>
                            <button
                                onClick={onAnalyzeLinks}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                            >
                                Scan Links
                            </button>
                        </div>

                        {linkAnalysis ? (
                            <div className="space-y-4">
                                {linkAnalysis.suspiciousLinks.length > 0 && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                                            <AlertTriangle size={14} />
                                            Suspicious Links Detected
                                        </h4>
                                        <ul className="space-y-1">
                                            {linkAnalysis.suspiciousLinks.map((link, i) => (
                                                <li key={i} className="text-xs text-red-300 truncate" title={link}>
                                                    {link}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-2">All Links ({linkAnalysis.links.length})</h4>
                                    {linkAnalysis.links.length > 0 ? (
                                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                            {linkAnalysis.links.map((link, i) => (
                                                <li key={i} className="flex items-center gap-2 text-xs text-blue-400 hover:underline truncate">
                                                    <ExternalLink size={10} className="shrink-0" />
                                                    <a href={link} target="_blank" rel="noopener noreferrer" className="truncate">
                                                        {link}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">No links found.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">
                                Click "Scan Links" to inspect external URLs.
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Version History</h3>
                            <button
                                onClick={onAnalyzeHistory}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                            >
                                Check History
                            </button>
                        </div>

                        {historyAnalysis ? (
                            <div className="space-y-4">
                                {historyAnalysis.hasIncrementalUpdates ? (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                        <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                                            <History size={18} />
                                            Incremental Updates Detected
                                        </h4>
                                        <p className="text-sm text-slate-300">
                                            This file has been modified <strong>{historyAnalysis.updateCount} times</strong> since creation.
                                            Previous versions of the document (including deleted text) might still be recoverable.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                        <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                                            <History size={18} />
                                            Clean History
                                        </h4>
                                        <p className="text-sm text-slate-300">
                                            No incremental updates detected. This appears to be a clean, flattened file.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">
                                Click "Check History" to scan for hidden previous versions.
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 'geo' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Geo-Location Scanner</h3>
                            <button
                                onClick={onAnalyzeGeo}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                            >
                                Scan Metadata
                            </button>
                        </div>

                        {geoAnalysis ? (
                            <div className="space-y-4">
                                {geoAnalysis.length > 0 ? (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                                            <MapPin size={18} />
                                            Location Data Risks
                                        </h4>
                                        <ul className="space-y-2">
                                            {geoAnalysis.map((warning, i) => (
                                                <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                                                    <span className="mt-1">•</span>
                                                    {warning}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                        <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                                            <MapPin size={18} />
                                            No Geo-Tags Found
                                        </h4>
                                        <p className="text-sm text-slate-300">
                                            No obvious GPS or Camera metadata found in the file structure.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">
                                Click "Scan Metadata" to check for hidden location tags.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
