import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import { FloatingBadges } from '../pages/InnovativeFeatures';
import { useTheme } from '../contexts/ThemeContext';
import dnaDarkBg from '../assets/image copy.png';  // Black bg + blue glowing DNA — dark mode
import dnaLightBg from '../assets/image.png';      // Vivid blue DNA — light mode

const MainLayout: React.FC = () => {
    const location = useLocation();
    const { isDark } = useTheme();

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">

            {/* ── Layer 1: Solid base color ─────────────────────────────────── */}
            <div className="fixed inset-0 z-[-3]" style={{ background: 'var(--bg-main)' }} />

            {/* ── Layer 2: DNA image ────────────────────────────────────────── */}
            <div
                className="dna-bg-img fixed inset-0 z-[-2] pointer-events-none"
                style={{
                    backgroundImage: `url(${isDark ? dnaDarkBg : dnaLightBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    opacity: isDark ? 0.64 : 0.60,
                    filter: isDark ? 'blur(1.5px)' : 'none',
                    transition: 'opacity 0.6s ease, filter 0.6s ease',
                }}
            />

            {/* ── Layer 3: Readability overlay (dark tint / light wash) ─────── */}
            <div
                className="fixed inset-0 z-[-1] pointer-events-none"
                style={{
                    background: isDark
                        ? 'linear-gradient(135deg, rgba(0,0,0,0.42) 0%, rgba(0,4,10,0.36) 50%, rgba(0,0,0,0.42) 100%)'
                        : 'linear-gradient(135deg, rgba(245,250,255,0.34) 0%, rgba(230,244,255,0.28) 50%, rgba(245,250,255,0.34) 100%)',
                    transition: 'background 0.6s ease',
                }}
            />

            {/* ── Layer 4: Radial vignette for depth ───────────────────────── */}
            <div
                className="fixed inset-0 z-[-1] pointer-events-none"
                style={{
                    background: isDark
                        ? 'radial-gradient(ellipse at 50% 0%, rgba(13,115,119,0.08) 0%, transparent 60%)'
                        : 'radial-gradient(ellipse at 50% 0%, rgba(13,115,119,0.06) 0%, transparent 60%)',
                }}
            />

            <Navbar />
            <FloatingBadges />

            <main className="flex-1 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
