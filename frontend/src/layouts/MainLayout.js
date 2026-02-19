import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import { FloatingBadges } from '../pages/InnovativeFeatures';
const MainLayout = () => {
    const location = useLocation();
    return (_jsxs("div", { className: "min-h-screen flex flex-col", style: { background: 'var(--bg-main)', color: 'var(--text-primary)' }, children: [_jsx(Navbar, {}), _jsx(FloatingBadges, {}), _jsx("main", { className: "flex-1", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.3 }, children: _jsx(Outlet, {}) }, location.pathname) }) }), _jsx(Footer, {})] }));
};
export default MainLayout;
