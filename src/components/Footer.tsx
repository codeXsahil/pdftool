import React from 'react';
import { Shield, Github, Twitter, Heart } from 'lucide-react';

interface FooterProps {
    onNavigate: (tab: 'metadata' | 'security' | 'analysis' | 'quality') => void;
    onOpenLegal: (type: 'privacy' | 'terms' | 'about' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
    const currentYear = new Date().getFullYear();

    const handleNav = (e: React.MouseEvent, tab: 'metadata' | 'security' | 'analysis' | 'quality') => {
        e.preventDefault();
        onNavigate(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLegal = (e: React.MouseEvent, type: 'privacy' | 'terms' | 'about' | 'contact') => {
        e.preventDefault();
        onOpenLegal(type);
    };

    return (
        <footer className="mt-20 border-t border-slate-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="text-blue-400" size={24} />
                            <span className="text-xl font-bold text-white">PDF Metadata Guardian</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                            The most advanced client-side PDF analysis tool.
                            Detect hidden metadata, analyze security risks, check accessibility compliance,
                            and optimize your documents without them ever leaving your device.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Features</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" onClick={(e) => handleNav(e, 'metadata')} className="hover:text-blue-400 transition-colors">Metadata Editor</a></li>
                            <li><a href="#" onClick={(e) => handleNav(e, 'security')} className="hover:text-blue-400 transition-colors">Security Analysis</a></li>
                            <li><a href="#" onClick={(e) => handleNav(e, 'analysis')} className="hover:text-blue-400 transition-colors">Deep Analysis</a></li>
                            <li><a href="#" onClick={(e) => handleNav(e, 'quality')} className="hover:text-blue-400 transition-colors">Quality & Accessibility</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal & Info</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" onClick={(e) => handleLegal(e, 'privacy')} className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" onClick={(e) => handleLegal(e, 'terms')} className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" onClick={(e) => handleLegal(e, 'about')} className="hover:text-blue-400 transition-colors">About Us</a></li>
                            <li><a href="#" onClick={(e) => handleLegal(e, 'contact')} className="hover:text-blue-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} PDF Metadata Guardian. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">
                            <Github size={20} />
                        </a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">
                            <Twitter size={20} />
                        </a>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                            <span>Made with</span>
                            <Heart size={14} className="text-red-500 fill-red-500" />
                            <span>for privacy</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
