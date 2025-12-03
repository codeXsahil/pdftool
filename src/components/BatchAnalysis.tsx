import React from 'react';
import type { PDFMetadata, RiskAnalysis } from '../utils/pdfUtils';
import { Shield, ShieldAlert, Trash2, Edit, Zap, Clock, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface BatchItem {
    file: File;
    metadata: PDFMetadata;
    risk: RiskAnalysis;
    id: string;
}

interface BatchAnalysisProps {
    items: BatchItem[];
    onRemove: (id: string) => void;
    onEdit: (id: string) => void;
    onSanitizeAll: () => void;
}

export const BatchAnalysis: React.FC<BatchAnalysisProps> = ({ items, onRemove, onEdit, onSanitizeAll }) => {
    const getRiskColor = (score: number) => {
        if (score < 30) return 'text-green-400';
        if (score < 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(items, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "pdf_analysis_report.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div>
                    <h2 className="text-xl font-semibold text-white">Batch Analysis</h2>
                    <p className="text-slate-400 text-sm">{items.length} files loaded</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportJSON}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-colors"
                    >
                        <Download size={18} />
                        <span>Export JSON</span>
                    </button>
                    <button
                        onClick={onSanitizeAll}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors"
                    >
                        <Zap size={18} />
                        <span>Sanitize All</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors flex flex-col md:flex-row items-start md:items-center gap-4"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-white truncate" title={item.file.name}>
                                    {item.file.name}
                                </h3>
                                <span className="text-xs text-slate-500">
                                    {(item.file.size / 1024).toFixed(1)} KB
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className={getRiskColor(item.risk.score)}>
                                        {item.risk.score < 30 ? <Shield size={14} /> : <ShieldAlert size={14} />}
                                    </span>
                                    Risk: {item.risk.score}/100
                                </span>
                                {item.metadata.timezoneOffset && (
                                    <span className="flex items-center gap-1 text-blue-400" title="Original Timezone">
                                        <Clock size={14} />
                                        {item.metadata.timezoneOffset}
                                    </span>
                                )}
                                {item.metadata.producer && (
                                    <span className="truncate max-w-[200px]" title={`Producer: ${item.metadata.producer}`}>
                                        Prod: {item.metadata.producer}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button
                                onClick={() => onEdit(item.id)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors"
                            >
                                <Edit size={14} />
                                Edit
                            </button>
                            <button
                                onClick={() => onRemove(item.id)}
                                className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                title="Remove file"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
