import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFPreviewProps {
    file: File;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ file }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div className="flex flex-col h-full bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                        className="p-1 hover:bg-slate-700 rounded disabled:opacity-50"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm text-slate-400">
                        Page {pageNumber} of {numPages || '--'}
                    </span>
                    <button
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                        disabled={pageNumber >= (numPages || 1)}
                        className="p-1 hover:bg-slate-700 rounded disabled:opacity-50"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
                        className="p-1 hover:bg-slate-700 rounded"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="text-sm text-slate-400 w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(prev => Math.min(prev + 0.2, 2.0))}
                        className="p-1 hover:bg-slate-700 rounded"
                    >
                        <ZoomIn size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-900/50">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center justify-center h-64 text-slate-500">
                            Loading PDF...
                        </div>
                    }
                    error={
                        <div className="flex items-center justify-center h-64 text-red-400">
                            Failed to load PDF preview.
                        </div>
                    }
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-2xl"
                    />
                </Document>
            </div>
        </div>
    );
};
