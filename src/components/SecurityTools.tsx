import React, { useState } from 'react';
import { Stamp, Minimize2, FileCheck } from 'lucide-react';


interface SecurityToolsProps {
    onWatermark: (text: string) => void;
    onCompress: () => void;
    onPdfA: () => void;
}

export const SecurityTools: React.FC<SecurityToolsProps> = ({
    onWatermark,
    onCompress,
    onPdfA
}) => {
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

    return (
        <div className="space-y-6">
            {/* Watermarking */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Stamp className="text-purple-400" />
                    Watermark
                </h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Watermark text..."
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                        onClick={() => onWatermark(watermarkText)}
                        disabled={!watermarkText}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* Compression & PDF/A */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={onCompress}
                    className="p-4 bg-slate-800/50 border border-slate-700 hover:bg-slate-700 rounded-xl transition-all flex flex-col items-center gap-2 text-center text-slate-300 hover:text-white"
                >
                    <Minimize2 size={24} />
                    <span className="font-medium">Compress</span>
                    <span className="text-xs opacity-70">Shrink file size</span>
                </button>

                <button
                    onClick={onPdfA}
                    className="p-4 bg-slate-800/50 border border-slate-700 hover:bg-slate-700 rounded-xl transition-all flex flex-col items-center gap-2 text-center text-slate-300 hover:text-white"
                >
                    <FileCheck size={24} />
                    <span className="font-medium">PDF/A</span>
                    <span className="text-xs opacity-70">Convert to Archival</span>
                </button>
            </div>
        </div>
    );
};

