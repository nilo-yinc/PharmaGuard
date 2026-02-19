import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import { FloatingBadges } from '../pages/InnovativeFeatures';

const MainLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
            <Navbar />
            <FloatingBadges />

            <main className="flex-1">
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
