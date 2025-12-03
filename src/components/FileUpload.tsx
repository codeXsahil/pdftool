import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface FileUploadProps {
    onFileSelect: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);

        const files = Array.from(e.dataTransfer.files);
        const pdfFiles = files.filter(file => file.type === 'application/pdf');

        if (pdfFiles.length > 0) {
            onFileSelect(pdfFiles);
        } else {
            setError('Please upload valid PDF files.');
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const pdfFiles = files.filter(file => file.type === 'application/pdf');

            if (pdfFiles.length > 0) {
                onFileSelect(pdfFiles);
                setError(null);
            } else {
                setError('Please upload valid PDF files.');
            }
        }
    }, [onFileSelect]);

    return (
        <div className="w-full max-w-xl mx-auto">
            <motion.div
                className={clsx(
                    "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden",
                    isDragging ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-slate-500 bg-slate-800/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    multiple
                    onChange={handleFileInput}
                />

                <div className="flex flex-col items-center gap-4">
                    <div className={clsx(
                        "p-4 rounded-full transition-colors duration-300",
                        isDragging ? "bg-blue-500/20 text-blue-400" : "bg-slate-700/50 text-slate-400"
                    )}>
                        <Upload size={32} />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Upload Resume PDF
                        </h3>
                        <p className="text-slate-400">
                            Drag & drop or click to browse
                        </p>
                    </div>
                </div>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400"
                >
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                </motion.div>
            )}
        </div>
    );
};
