import React from 'react';
import { X, Shield, FileText, Mail, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'privacy' | 'terms' | 'about' | 'contact' | null;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
    if (!isOpen || !type) return null;

    const content = {
        privacy: {
            title: 'Privacy Policy',
            icon: <Shield className="text-blue-400" size={24} />,
            text: (
                <div className="space-y-4 text-slate-300">
                    <p><strong>Last Updated: December 2025</strong></p>
                    <p>At PDF Metadata Guardian, we take your privacy seriously. In fact, we designed this tool so that we cannot access your data even if we wanted to.</p>
                    <h4 className="text-white font-semibold mt-4">1. Client-Side Processing</h4>
                    <p>All PDF processing happens entirely within your web browser. Your files are <strong>never</strong> uploaded to any server. They remain on your device at all times.</p>
                    <h4 className="text-white font-semibold mt-4">2. No Data Collection</h4>
                    <p>We do not collect, store, or share any personal information, document metadata, or usage analytics. We do not use cookies for tracking.</p>
                    <h4 className="text-white font-semibold mt-4">3. Local Storage</h4>
                    <p>We may use your browser's local storage solely to save your preferences (like dark mode settings) if applicable. No sensitive data is stored.</p>
                </div>
            )
        },
        terms: {
            title: 'Terms of Service',
            icon: <FileText className="text-purple-400" size={24} />,
            text: (
                <div className="space-y-4 text-slate-300">
                    <p>By using PDF Metadata Guardian, you agree to the following terms:</p>
                    <h4 className="text-white font-semibold mt-4">1. Usage</h4>
                    <p>This tool is provided "as is" for free. You are responsible for any changes made to your documents.</p>
                    <h4 className="text-white font-semibold mt-4">2. Liability</h4>
                    <p>We are not liable for any data loss, corruption, or legal issues arising from the modification of your PDF files.</p>
                    <h4 className="text-white font-semibold mt-4">3. License</h4>
                    <p>You are free to use this tool for personal and commercial purposes.</p>
                </div>
            )
        },
        about: {
            title: 'About Us',
            icon: <Info className="text-green-400" size={24} />,
            text: (
                <div className="space-y-4 text-slate-300">
                    <p>PDF Metadata Guardian was built with a single mission: to make PDF security and privacy accessible to everyone.</p>
                    <p>Many online PDF tools require you to upload your sensitive documents to their servers, creating a potential security risk. We wanted to build a powerful alternative that runs 100% in the browser.</p>
                    <p>Powered by modern web technologies like WebAssembly and PDF.js, we bring desktop-class performance to the web.</p>
                    <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-sm text-slate-400">Developed by <a href="https://www.linkedin.com/in/31sahilgupta/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium">Sahil Gupta</a></p>
                    </div>
                </div>
            )
        },
        contact: {
            title: 'Contact',
            icon: <Mail className="text-pink-400" size={24} />,
            text: (
                <div className="space-y-4 text-slate-300">
                    <p>Have questions, feedback, or found a bug?</p>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mt-4">
                        <p className="text-sm text-slate-400 mb-1">Email us at:</p>
                        <a href="mailto:support@pdfguardian.com" className="text-blue-400 hover:text-blue-300 font-medium">support@pdfguardian.com</a>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400 mb-1">Follow us on Twitter:</p>
                        <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">@PDFGuardian</a>
                    </div>
                </div>
            )
        }
    };

    const activeContent = content[type];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {activeContent.icon}
                            <h3 className="text-xl font-bold text-white">{activeContent.title}</h3>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {activeContent.text}
                    </div>
                    <div className="p-6 border-t border-slate-800 bg-slate-800/30 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
