import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, CheckCircle, Code2 } from 'lucide-react';
import { DrugRisk, AnalysisResult } from '../utils/mockData';

interface JSONPanelProps {
    isOpen: boolean;
    onClose: () => void;
    data: DrugRisk | AnalysisResult | null;
    title?: string;
}

const JSONPanel: React.FC<JSONPanelProps> = ({ isOpen, onClose, data, title = 'Structured JSON Output' }) => {
    const [copied, setCopied] = useState(false);

    const jsonString = data ? JSON.stringify(data, null, 2) : '{}';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pharmaguard-${data && 'drug' in data ? data.drug.toLowerCase() : 'analysis'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Syntax highlight JSON (light theme)
    const highlightJSON = (json: string) => {
        return json
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(
                /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                (match) => {
                    let cls = 'color: #D97706'; // number — amber
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'color: #0D7377'; // key — teal
                        } else {
                            cls = 'color: #059669'; // string — green
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'color: #7C3AED'; // boolean — purple
                    } else if (/null/.test(match)) {
                        cls = 'color: #DC2626'; // null — red
                    }
                    return `<span style="${cls}">${match}</span>`;
                }
            );
    };

    const lineCount = jsonString.split('\n').length;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
                    />

                    {/* Side Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl flex flex-col"
                        style={{
                            background: '#FAFBFC',
                            borderLeft: '1px solid #E5E7EB',
                            boxShadow: '-8px 0 30px rgba(0,0,0,0.08)',
                        }}
                    >
                        {/* Panel header */}
                        <div
                            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                            style={{ background: 'white', borderBottom: '1px solid #F3F4F6' }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: '#E6F5F5', border: '1px solid #CCE9EA' }}
                                >
                                    <Code2 size={16} style={{ color: '#0D7377' }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm" style={{ color: '#1F2937' }}>{title}</h3>
                                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{lineCount} lines • application/json</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Schema validation badge */}
                                <div
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                    style={{ background: '#ECFDF5', border: '1px solid #D1FAE5', color: '#059669' }}
                                >
                                    <CheckCircle size={10} />
                                    Valid Schema
                                </div>

                                {/* Copy button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                                    style={{
                                        background: copied ? '#ECFDF5' : '#E6F5F5',
                                        border: copied ? '1px solid #D1FAE5' : '1px solid #CCE9EA',
                                        color: copied ? '#059669' : '#0D7377',
                                    }}
                                >
                                    {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </motion.button>

                                {/* Download button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDownload}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                                    style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#D97706' }}
                                >
                                    <Download size={12} />
                                    Download
                                </motion.button>

                                {/* Close */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                    style={{ color: '#9CA3AF', background: '#F9FAFB', border: '1px solid #E5E7EB' }}
                                >
                                    <X size={16} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Compliance badges */}
                        <div
                            className="flex gap-2 px-5 py-2.5 flex-shrink-0"
                            style={{ background: 'white', borderBottom: '1px solid #F3F4F6' }}
                        >
                            {[
                                { label: 'CPIC Guideline Aligned', color: '#059669' },
                                { label: 'Explainable AI', color: '#7C3AED' },
                                { label: 'VCF v4.2 Compatible', color: '#0D7377' },
                                { label: 'HIPAA Safe', color: '#D97706' },
                            ].map(badge => (
                                <span
                                    key={badge.label}
                                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                                    style={{
                                        background: `${badge.color}08`,
                                        border: `1px solid ${badge.color}18`,
                                        color: badge.color,
                                    }}
                                >
                                    ✓ {badge.label}
                                </span>
                            ))}
                        </div>

                        {/* JSON Editor area */}
                        <div className="flex-1 overflow-hidden flex" style={{ background: 'white' }}>
                            {/* Line numbers */}
                            <div
                                className="flex-shrink-0 w-10 pt-4 pb-4 select-none"
                                style={{ background: '#F9FAFB', borderRight: '1px solid #F3F4F6' }}
                            >
                                {jsonString.split('\n').map((_, i) => (
                                    <div key={i} className="text-right pr-2 text-[10px] leading-5 font-mono" style={{ color: '#D1D5DB' }}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Code area */}
                            <pre
                                className="flex-1 overflow-auto p-4 text-xs font-mono leading-5"
                                style={{ background: 'white', color: '#1F2937' }}
                                dangerouslySetInnerHTML={{ __html: highlightJSON(jsonString) }}
                            />
                        </div>

                        {/* Footer */}
                        <div
                            className="px-5 py-3 flex-shrink-0 flex items-center justify-between"
                            style={{ background: 'white', borderTop: '1px solid #F3F4F6' }}
                        >
                            <span className="text-xs font-mono" style={{ color: '#9CA3AF' }}>
                                PharmaGuard API Schema v2.4
                            </span>
                            <span className="text-xs" style={{ color: '#9CA3AF' }}>
                                {new Blob([jsonString]).size} bytes
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default JSONPanel;
