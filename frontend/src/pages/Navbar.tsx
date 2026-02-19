import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    Menu, X, Sun, Moon, LogIn, LogOut, User,
    Upload, Pill, LayoutDashboard, Info, FileText,
    ChevronDown, Settings, History, Shield
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const navLinks = [
        { to: '/analyze', label: 'Upload VCF', icon: <Upload size={14} /> },
        { to: '/analyze', label: 'Drug Input', icon: <Pill size={14} /> },
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
        { to: '/#about', label: 'About', icon: <Info size={14} /> },
        { to: '#', label: 'Docs', icon: <FileText size={14} /> },
    ];

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/');
    };

    const navLinkStyle = (isActive: boolean) => ({
        color: isActive ? '#0D7377' : '#6B7280',
        fontWeight: isActive ? 600 : 500,
    });

    return (
        <nav
            className="sticky top-0 z-50 backdrop-blur-md"
            style={{
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left — Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm transition-transform group-hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #0D7377, #0A5C5F)' }}
                        >
                            PG
                        </div>
                        <div>
                            <p className="font-bold text-sm leading-none" style={{ color: 'var(--text-primary)' }}>PharmaGuard</p>
                            <p className="text-[9px] leading-tight" style={{ color: 'var(--text-secondary)' }}>Pharmacogenomics AI</p>
                        </div>
                    </Link>

                    {/* Center — Nav Links (desktop) */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.to}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 hover:opacity-80"
                                style={({ isActive }) => ({
                                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                    fontWeight: isActive ? 600 : 500,
                                    background: isActive ? 'var(--bg-muted)' : 'transparent'
                                })}
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right — Actions */}
                    <div className="flex items-center gap-2">
                        {/* CPIC Badge */}
                        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
                            style={{ background: '#ECFDF5', border: '1px solid #D1FAE5', color: '#059669' }}>
                            <Shield size={10} />
                            CPIC Aligned
                        </div>

                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
                        >
                            {isDark ? <Sun size={15} /> : <Moon size={15} />}
                        </motion.button>

                        {/* Auth section */}
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200"
                                    style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                        style={{ background: '#0D7377' }}>
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden sm:block text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {user?.name?.split(' ')[0] || 'User'}
                                    </span>
                                    <ChevronDown size={12} style={{ color: 'var(--text-secondary)' }} />
                                </motion.button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden"
                                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
                                        >
                                            {/* User info */}
                                            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                                                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                                                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1">
                                                {[
                                                    { label: 'Profile', icon: <User size={13} />, to: '/profile' },
                                                    { label: 'Analysis History', icon: <History size={13} />, to: '/dashboard' },
                                                    { label: 'Settings', icon: <Settings size={13} />, to: '/profile' },
                                                ].map((item) => (
                                                    <Link
                                                        key={item.label}
                                                        to={item.to}
                                                        onClick={() => setDropdownOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors hover:opacity-80"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                    >
                                                        {item.icon}
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Logout */}
                                            <div style={{ borderTop: '1px solid #F3F4F6' }}>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs transition-colors hover:bg-red-50"
                                                    style={{ color: '#DC2626' }}
                                                >
                                                    <LogOut size={13} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                                    style={{ background: '#0D7377' }}
                                >
                                    <LogIn size={14} />
                                    Sign In
                                </motion.button>
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ color: '#6B7280' }}
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden"
                        style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.label}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors"
                                    style={({ isActive }) => navLinkStyle(isActive)}
                                >
                                    {link.icon}
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
