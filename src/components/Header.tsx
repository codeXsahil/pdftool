import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
    return (
        <header className="mb-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4"
            >
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="PDF Guardian Logo" className="w-12 h-12 object-contain" />
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
            >
                PDF Metadata Guardian
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 max-w-2xl mx-auto"
            >
                Secure, Analyze, and Optimize your PDF documents entirely in your browser.
                No file uploads, 100% private.
            </motion.p>
        </header>
    );
};
