import React from 'react';
import { Shield, Search, FileText, CheckCircle, Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeatureBrief: React.FC = () => {
    const features = [
        {
            icon: <Search className="text-blue-400" size={32} />,
            title: "Deep Metadata Analysis",
            description: "View and edit hidden metadata fields including Author, Creator, and modification dates."
        },
        {
            icon: <Shield className="text-green-400" size={32} />,
            title: "Security & Privacy",
            description: "100% client-side processing. Your files never leave your device. Detect risks and sanitize data."
        },
        {
            icon: <CheckCircle className="text-purple-400" size={32} />,
            title: "Quality & ATS Check",
            description: "Scan for ATS keywords, check accessibility compliance (WCAG), and verify print margins."
        },
        {
            icon: <Zap className="text-yellow-400" size={32} />,
            title: "Power Tools",
            description: "Convert to PDF/A, compress files, watermark pages, and analyze font usage."
        },
        {
            icon: <Lock className="text-red-400" size={32} />,
            title: "Forensic Inspection",
            description: "Analyze timezone offsets, modification history, and geo-tags to verify authenticity."
        },
        {
            icon: <FileText className="text-cyan-400" size={32} />,
            title: "JSON Export",
            description: "Export comprehensive analysis reports for documentation and further review."
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-6xl mx-auto mt-16 px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Why use PDF Metadata Guardian?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    A complete suite of tools to inspect, secure, and optimize your PDF documents directly in your browser.
                </p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        <div className="mb-4 bg-slate-900/50 w-16 h-16 rounded-lg flex items-center justify-center border border-slate-700/50">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};
