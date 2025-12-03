import React, { useState } from 'react';
import type { PDFMetadata } from '../utils/pdfUtils';
import { TemplateSelector } from './TemplateSelector';
import type { MetadataTemplate } from '../utils/templates';
import { Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetadataEditorProps {
    initialMetadata: PDFMetadata;
    onSave: (newMetadata: PDFMetadata) => void;
    onCancel: () => void;
}

export const MetadataEditor: React.FC<MetadataEditorProps> = ({ initialMetadata, onSave, onCancel }) => {
    const [formData, setFormData] = useState<PDFMetadata>(initialMetadata);

    const handleChange = (field: keyof PDFMetadata, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTemplateSelect = (template: MetadataTemplate) => {
        setFormData(prev => ({
            ...prev,
            ...template.fields,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Edit Metadata</h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            <TemplateSelector onSelect={handleTemplateSelect} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Title"
                    value={formData.title || ''}
                    onChange={v => handleChange('title', v)}
                />
                <InputField
                    label="Author"
                    value={formData.author || ''}
                    onChange={v => handleChange('author', v)}
                />
                <InputField
                    label="Subject"
                    value={formData.subject || ''}
                    onChange={v => handleChange('subject', v)}
                />
                <InputField
                    label="Keywords"
                    value={formData.keywords || ''}
                    onChange={v => handleChange('keywords', v)}
                />
                <InputField
                    label="Creator"
                    value={formData.creator || ''}
                    onChange={v => handleChange('creator', v)}
                />
                <InputField
                    label="Producer"
                    value={formData.producer || ''}
                    onChange={v => handleChange('producer', v)}
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </motion.form>
    );
};

const InputField: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-slate-400">{label}</label>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            placeholder={`Enter ${label.toLowerCase()}...`}
        />
    </div>
);
