import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, ChevronUp, ExternalLink, Copy,
    AlertTriangle, CheckCircle, Info, XCircle, HelpCircle, Dna
} from 'lucide-react';
import { DrugRisk, RISK_COLORS, RISK_LABELS, SEVERITY_COLORS } from '../utils/mockData';

interface DrugCardProps {
    drug: DrugRisk;
    index: number;
    onViewJSON: (drug: DrugRisk) => void;
}

const RISK_ICONS: Record<string, React.ReactNode> = {
    safe: <CheckCircle size={16} />,
    adjust: <AlertTriangle size={16} />,
    toxic: <XCircle size={16} />,
    ineffective: <Info size={16} />,
    unknown: <HelpCircle size={16} />,
};

const DrugCard: React.FC<DrugCardProps> = ({ drug, index, onViewJSON }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const riskColor = RISK_COLORS[drug.riskLevel] || '#6b7280';
    const severityColor = SEVERITY_COLORS[drug.severity] || '#6b7280';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="rounded-2xl overflow-hidden"
            style={{
                background: 'white',
                border: `1px solid ${isHovered ? riskColor + '40' : '#E5E7EB'}`,
                boxShadow: isHovered
                    ? `0 8px 25px ${riskColor}10, 0 1px 3px rgba(0,0,0,0.05)`
                    : '0 1px 3px rgba(0,0,0,0.05)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* Card header - always visible */}
            <div className="p-5">
                {/* Top row: drug name + risk label */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold mb-0.5" style={{ color: '#1F2937' }}>{drug.drug}</h3>
                        <div className="flex items-center gap-2">
                            <span
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    background: `${riskColor}12`,
                                    border: `1px solid ${riskColor}30`,
                                    color: riskColor,
                                }}
                            >
                                {RISK_ICONS[drug.riskLevel]}
                                {RISK_LABELS[drug.riskLevel]}
                            </span>
                            <span
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{
                                    background: `${severityColor}12`,
                                    color: severityColor,
                                    border: `1px solid ${severityColor}25`,
                                }}
                            >
                                {drug.severity.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Confidence score ring */}
                    <div className="relative w-14 h-14 flex-shrink-0">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="22" fill="none" stroke="#F3F4F6" strokeWidth="4" />
                            <motion.circle
                                cx="28" cy="28" r="22" fill="none"
                                stroke={riskColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 22}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - drug.confidence / 100) }}
                                transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeOut' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold" style={{ color: riskColor }}>{drug.confidence}%</span>
                        </div>
                    </div>
                </div>

                {/* Confidence progress bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#9CA3AF' }}>AI Confidence</span>
                        <span style={{ color: riskColor }}>{drug.confidence}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                        <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${drug.confidence}%` }}
                            transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                            style={{ background: riskColor }}
                        />
                    </div>
                </div>

                {/* Gene pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {drug.variants.map((v) => (
                        <span
                            key={v.gene}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono"
                            style={{
                                background: '#E6F5F5',
                                border: '1px solid #CCE9EA',
                                color: '#0D7377',
                            }}
                        >
                            <Dna size={10} />
                            {v.gene}
                        </span>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                        style={{
                            background: '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            color: '#6B7280',
                        }}
                    >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {isExpanded ? 'Collapse' : 'Clinical Details'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onViewJSON(drug)}
                        className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                        style={{
                            background: `${riskColor}08`,
                            border: `1px solid ${riskColor}20`,
                            color: riskColor,
                        }}
                    >
                        <ExternalLink size={12} />
                        JSON
                    </motion.button>
                </div>
            </div>

            {/* Expandable clinical section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div
                            className="mx-4 mb-4 p-4 rounded-xl space-y-4"
                            style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}
                        >
                            {/* Detected variants table */}
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                                    style={{ color: '#9CA3AF' }}>
                                    <Dna size={11} />
                                    Detected Variants
                                </h4>
                                <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid #E5E7EB' }}>
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr style={{ background: '#E6F5F5' }}>
                                                {['Gene', 'rsID', 'Diplotype', 'Phenotype'].map(h => (
                                                    <th key={h} className="px-3 py-2 text-left font-medium" style={{ color: '#0D7377' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {drug.variants.map((v, i) => (
                                                <tr key={i} style={{ borderTop: i > 0 ? '1px solid #F3F4F6' : 'none', background: 'white' }}>
                                                    <td className="px-3 py-2 font-mono font-medium" style={{ color: '#0D7377' }}>{v.gene}</td>
                                                    <td className="px-3 py-2 font-mono" style={{ color: '#6B7280' }}>{v.rsId}</td>
                                                    <td className="px-3 py-2 font-mono" style={{ color: '#059669' }}>{v.diplotype}</td>
                                                    <td className="px-3 py-2" style={{ color: '#4B5563' }}>{v.phenotype}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Clinical summary */}
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Clinical Summary</h4>
                                <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>{drug.clinicalSummary}</p>
                            </div>

                            {/* Mechanism */}
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Biological Mechanism</h4>
                                <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>{drug.mechanism}</p>
                            </div>

                            {/* CPIC guideline */}
                            <div
                                className="p-3 rounded-lg"
                                style={{ background: '#E6F5F5', border: '1px solid #CCE9EA' }}
                            >
                                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#0D7377' }}>
                                    CPIC Guideline Recommendation
                                </h4>
                                <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>{drug.cpicGuideline}</p>
                            </div>

                            {/* Recommendation */}
                            <div
                                className="p-3 rounded-lg"
                                style={{
                                    background: `${riskColor}08`,
                                    border: `1px solid ${riskColor}20`,
                                }}
                            >
                                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: riskColor }}>
                                    Clinical Action
                                </h4>
                                <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>{drug.recommendation}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DrugCard;
