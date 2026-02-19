import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sun, Moon, Menu, X, Shield, Activity,
    ChevronRight, Dna, FlaskConical
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
    onNavigate?: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
    const { isDark, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { label: 'Upload VCF', href: '#upload', icon: <Dna size={14} /> },
        { label: 'Drug Input', href: '#drugs', icon: <FlaskConical size={14} /> },
        { label: 'Dashboard', href: '#dashboard', icon: <Activity size={14} /> },
        { label: 'About', href: '#about', icon: <Shield size={14} /> },
    ];

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-40"
            style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #E5E7EB',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        {/* Shield Logo */}
                        <div className="relative w-8 h-8">
                            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 2L4 8v8c0 6.627 5.373 12 12 12s12-5.373 12-12V8L16 2z"
                                    fill="#E6F5F5"
                                    stroke="#0D7377"
                                    strokeWidth="1.5"
                                />
                                <path d="M12 10 Q16 13 20 10 Q16 7 12 10"
                                    stroke="#0D7377" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                <path d="M12 16 Q16 19 20 16 Q16 13 12 16"
                                    stroke="#E8645A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                <path d="M12 22 Q16 25 20 22 Q16 19 12 22"
                                    stroke="#0D7377" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                <line x1="12" y1="10" x2="12" y2="22" stroke="rgba(13,115,119,0.3)" strokeWidth="1" />
                                <line x1="20" y1="10" x2="20" y2="22" stroke="rgba(232,100,90,0.3)" strokeWidth="1" />
                            </svg>
                        </div>

                        <div>
                            <span className="text-lg font-black tracking-tight" style={{ color: '#0D7377' }}>
                                PharmaGuard
                            </span>
                            <span className="hidden sm:block text-[9px] tracking-widest uppercase -mt-1"
                                style={{ color: '#9CA3AF' }}
                            >
                                Pharmacogenomics AI
                            </span>
                        </div>
                    </motion.div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{ color: '#6B7280' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#0D7377';
                                    e.currentTarget.style.background = '#F3F4F6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#6B7280';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {link.icon}
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-3">
                        {/* CPIC Compliance badge */}
                        <div
                            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{
                                border: '1px solid #D1FAE5',
                                background: '#ECFDF5',
                                color: '#059669',
                            }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#059669' }} />
                            CPIC Aligned
                        </div>

                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                            style={{
                                background: '#F3F4F6',
                                border: '1px solid #E5E7EB',
                                color: '#6B7280',
                            }}
                            aria-label="Toggle theme"
                        >
                            <AnimatePresence mode="wait">
                                {isDark ? (
                                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Sun size={16} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Moon size={16} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Mobile menu button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{
                                background: '#F3F4F6',
                                border: '1px solid #E5E7EB',
                                color: '#6B7280',
                            }}
                        >
                            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.98)',
                            borderTop: '1px solid #E5E7EB',
                        }}
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
                                    style={{
                                        color: '#1F2937',
                                        background: '#F9FAFB',
                                        border: '1px solid #F3F4F6',
                                    }}
                                >
                                    <span className="flex items-center gap-2">
                                        {link.icon}
                                        {link.label}
                                    </span>
                                    <ChevronRight size={14} style={{ color: '#9CA3AF' }} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
