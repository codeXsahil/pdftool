import React from 'react';
import { METADATA_TEMPLATES, type MetadataTemplate } from '../utils/templates';
import { LayoutTemplate, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface TemplateSelectorProps {
    onSelect: (template: MetadataTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
    return (
        <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <LayoutTemplate size={16} />
                Quick Templates
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {METADATA_TEMPLATES.map((template) => (
                    <button
                        key={template.id}
                        type="button"
                        onClick={() => onSelect(template)}
                        className={clsx(
                            "text-left p-3 rounded-xl border transition-all duration-200 group relative",
                            template.category === 'job-seeker' && "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40",
                            template.category === 'hr' && "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40",
                            template.category === 'creative' && "bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/20 hover:border-pink-500/40",
                            template.category === 'academic' && "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40",
                            template.category === 'legal' && "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40",
                        )}
                        title={getTemplateHelp(template.id)}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className={clsx(
                                "font-medium text-sm",
                                template.category === 'job-seeker' && "text-blue-400",
                                template.category === 'hr' && "text-purple-400",
                                template.category === 'creative' && "text-pink-400",
                                template.category === 'academic' && "text-emerald-400",
                                template.category === 'legal' && "text-amber-400",
                            )}>
                                {template.name}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                                <Check size={14} />
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                            {template.description}
                        </p>
                    </button>
                ))}
            </div>

            <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-xs text-slate-400 space-y-2">
                <p className="font-medium text-slate-300">💡 Quick Guide:</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li><strong>ATS Optimized:</strong> Best for online job portals (Workday, Greenhouse).</li>
                    <li><strong>Standard Resume:</strong> Best for emailing recruiters directly.</li>
                    <li><strong>Creative Portfolio:</strong> For designers (signals Adobe InDesign use).</li>
                    <li><strong>Academic CV:</strong> For research/university roles (signals LaTeX use).</li>
                </ul>
            </div>
        </div>
    );
};

function getTemplateHelp(id: string): string {
    switch (id) {
        case 'ats-optimized': return 'Use for online applications. Sets producer to Microsoft Word for best parsing.';
        case 'standard-resume': return 'Use for direct emails. Sets producer to Adobe Acrobat Pro.';
        case 'creative-portfolio': return 'Use for design roles. Sets producer to Adobe InDesign.';
        case 'academic-cv': return 'Use for research roles. Sets producer to LaTeX.';
        case 'federal-resume': return 'Use for government jobs (USAJOBS).';
        default: return '';
    }
}
