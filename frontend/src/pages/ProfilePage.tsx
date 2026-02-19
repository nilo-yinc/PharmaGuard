import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Lock, Eye, EyeOff, Shield,
    Trash2, BarChart3, Clock, FileText, AlertTriangle,
    Save, Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { changePassword, deleteAccount, getUserStats, getUserAnalyses } from '../services/storageService';

const ProfilePage: React.FC = () => {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const stats = user ? getUserStats(user.id) : { totalAnalyses: 0, highRiskDrugs: 0, avgConfidence: 0 };
    const analyses = user ? getUserAnalyses(user.id) : [];

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileSaved, setProfileSaved] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const [privacyMode, setPrivacyMode] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSaveProfile = () => {
        updateProfile({ name, email });
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
    };

    const handleChangePassword = () => {
        setPasswordError('');
        setPasswordSuccess(false);

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setPasswordError('Please fill in all password fields.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        if (!user) return;

        const result = changePassword(user.id, oldPassword, newPassword);
        if (result.success) {
            setPasswordSuccess(true);
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setTimeout(() => setPasswordSuccess(false), 3000);
        } else {
            setPasswordError(result.error || 'Failed to change password.');
        }
    };

    const handleDeleteAccount = () => {
        if (!user) return;
        deleteAccount(user.id);
        logout();
        navigate('/', { replace: true });
    };

    const inputStyle = { background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-primary)' };
    const focusHandlers = {
        onFocus: (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(13,115,119,0.1)'; },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; },
    };

    return (
        <div className="min-h-[calc(100vh-64px)] pt-6 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>Profile Settings</h1>
                    <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Manage your account and preferences</p>
                </motion.div>

                {/* API Usage Stats */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <BarChart3 size={14} style={{ color: 'var(--primary)' }} />
                        Usage Statistics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Analyses', value: stats.totalAnalyses, color: '#0D7377' },
                            { label: 'High Risk Flagged', value: stats.highRiskDrugs, color: '#DC2626' },
                            { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, color: '#D97706' },
                            { label: 'VCF Files', value: analyses.length, color: '#7C3AED' },
                        ].map(s => (
                            <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-muted)' }}>
                                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Profile Info */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <User size={14} style={{ color: 'var(--primary)' }} />
                        Personal Information
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all" style={inputStyle} {...focusHandlers} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all" style={inputStyle} {...focusHandlers} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <p className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                                <Clock size={10} /> Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleSaveProfile}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white"
                            style={{ background: profileSaved ? '#059669' : '#0D7377' }}>
                            {profileSaved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Change Password */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Lock size={14} style={{ color: 'var(--primary)' }} />
                        Change Password
                    </h3>

                    {passwordError && (
                        <div className="px-4 py-3 rounded-xl text-xs mb-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                            {passwordError}
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="px-4 py-3 rounded-xl text-xs mb-4" style={{ background: '#ECFDF5', border: '1px solid #D1FAE5', color: '#059669' }}>
                            Password changed successfully!
                        </div>
                    )}

                    <div className="space-y-4">
                        {[
                            { label: 'Current Password', value: oldPassword, setValue: setOldPassword },
                            { label: 'New Password', value: newPassword, setValue: setNewPassword },
                            { label: 'Confirm New Password', value: confirmNewPassword, setValue: setConfirmNewPassword },
                        ].map((field) => (
                            <div key={field.label}>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{field.label}</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                                    <input type={showPasswords ? 'text' : 'password'} value={field.value} onChange={(e) => field.setValue(e.target.value)}
                                        className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all" style={inputStyle} {...focusHandlers} />
                                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                                        {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleChangePassword}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: 'var(--primary)' }}>
                            <Lock size={14} /> Update Password
                        </motion.button>
                    </div>
                </motion.div>

                {/* Privacy Mode */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-muted)' }}>
                                <Shield size={18} style={{ color: 'var(--primary)' }} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Privacy Mode</h3>
                                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Mask all rsIDs and patient identifiers in reports</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPrivacyMode(!privacyMode)}
                            className="relative w-11 h-6 rounded-full transition-all duration-200"
                            style={{ background: privacyMode ? 'var(--primary)' : 'var(--text-muted)' }}
                        >
                            <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                                style={{ transform: privacyMode ? 'translateX(22px)' : 'translateX(2px)' }} />
                        </button>
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid #FECACA', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#DC2626' }}>
                        <AlertTriangle size={14} />
                        Danger Zone
                    </h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>

                    {!showDeleteConfirm ? (
                        <button onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors hover:bg-red-50"
                            style={{ color: '#DC2626', border: '1px solid #FECACA' }}>
                            <Trash2 size={14} /> Delete Account
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button onClick={handleDeleteAccount}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#DC2626' }}>
                                <Trash2 size={14} /> Confirm Delete
                            </button>
                            <button onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-xl text-xs font-medium" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                                Cancel
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
