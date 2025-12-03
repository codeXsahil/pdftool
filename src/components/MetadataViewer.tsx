import React, { useState } from 'react';
import type { PDFMetadata, RiskAnalysis, ATSAnalysis } from '../utils/pdfUtils';
import { AlertTriangle, CheckCircle, Calendar, User, FileText, Tag, Layers, Clock, ShieldAlert, Bug, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface MetadataViewerProps {
    metadata: PDFMetadata;
    riskAnalysis: RiskAnalysis;
    onScanATS?: (jobDescription: string) => void;
    atsAnalysis?: ATSAnalysis | null;
}

export const MetadataViewer: React.FC<MetadataViewerProps> = ({ metadata, riskAnalysis, onScanATS, atsAnalysis }) => {
    const [jobDescription, setJobDescription] = useState('');

    const formatDate = (date?: Date) => {
        if (!date) return 'Not specified';
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    };

    const getRiskColor = (score: number) => {
        if (score < 30) return 'text-green-400';
        if (score < 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getRiskBg = (score: number) => {
        if (score < 30) return 'bg-green-500/10 border-green-500/20';
        if (score < 70) return 'bg-yellow-500/10 border-yellow-500/20';
        return 'bg-red-500/10 border-red-500/20';
    };

    return (
        <div className="space-y-6">
            {/* Risk Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                    "p-6 rounded-2xl border backdrop-blur-sm",
                    getRiskBg(riskAnalysis.score)
                )}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ShieldAlert className={getRiskColor(riskAnalysis.score)} />
                        Risk Analysis
                    </h3>
                    <span className={clsx("text-2xl font-bold", getRiskColor(riskAnalysis.score))}>
                        {riskAnalysis.score}/100
                    </span>
                </div>

                {riskAnalysis.flags.length > 0 ? (
                    <ul className="space-y-2">
                        {riskAnalysis.flags.map((flag, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                                <AlertTriangle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                                {flag}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle size={16} />
                        No obvious risk factors detected.
                    </div>
                )}

                {/* Threat Analysis (Deep Scan) */}
                {riskAnalysis.threats && riskAnalysis.threats.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-red-500/20">
                        <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                            <Bug size={16} />
                            Hidden Threats Detected
                        </h4>
                        <ul className="space-y-2">
                            {riskAnalysis.threats.map((threat, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-red-300 font-medium bg-red-500/10 p-2 rounded">
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    {threat}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </motion.div>

            {/* ATS Scanner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"
            >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Search className="text-blue-400" />
                    ATS Keyword Scanner
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Paste Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here to check if your resume matches the keywords..."
                            className="w-full h-24 bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>
                    <button
                        onClick={() => onScanATS && onScanATS(jobDescription)}
                        disabled={!jobDescription.trim()}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Search size={16} />
                        Scan Keywords
                    </button>

                    {atsAnalysis && (
                        <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-slate-300">Match Score</span>
                                <span className={clsx(
                                    "text-lg font-bold",
                                    atsAnalysis.score > 70 ? "text-green-400" : atsAnalysis.score > 40 ? "text-yellow-400" : "text-red-400"
                                )}>
                                    {atsAnalysis.score}%
                                </span>
                            </div>

                            {atsAnalysis.missingKeywords.length > 0 && (
                                <div>
                                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Missing Keywords</p>
                                    <div className="flex flex-wrap gap-2">
                                        {atsAnalysis.missingKeywords.map((keyword, i) => (
                                            <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetadataItem
                    icon={<FileText size={18} />}
                    label="Title"
                    value={metadata.title}
                />
                <MetadataItem
                    icon={<User size={18} />}
                    label="Author"
                    value={metadata.author}
                    highlight={!metadata.author}
                />
                <MetadataItem
                    icon={<Layers size={18} />}
                    label="Producer"
                    value={metadata.producer}
                />
                <MetadataItem
                    icon={<Tag size={18} />}
                    label="Creator"
                    value={metadata.creator}
                />
                <MetadataItem
                    icon={<Calendar size={18} />}
                    label="Created"
                    value={formatDate(metadata.creationDate)}
                />
                <MetadataItem
                    icon={<Calendar size={18} />}
                    label="Modified"
                    value={formatDate(metadata.modificationDate)}
                />
                {metadata.timezoneOffset && (
                    <MetadataItem
                        icon={<Clock size={18} />}
                        label="Original Timezone"
                        value={metadata.timezoneOffset}
                        className="text-blue-400"
                    />
                )}
            </div>
        </div>
    );
};

const MetadataItem = ({ icon, label, value, highlight, className }: { icon: React.ReactNode, label: string, value?: string, highlight?: boolean, className?: string }) => (
    <div className={clsx(
        "bg-slate-800/50 p-4 rounded-xl border border-slate-700 transition-colors hover:border-slate-600",
        highlight && "border-red-500/50 bg-red-500/5"
    )}>
        <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm">
            {icon}
            <span>{label}</span>
        </div>
        <div className={clsx("font-medium truncate", className || "text-slate-200")}>
            {value || <span className="text-slate-600 italic">Not set</span>}
        </div>
    </div>
);
