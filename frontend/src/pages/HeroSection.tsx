import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Dna, Shield, Zap, Brain } from 'lucide-react';

interface HeroSectionProps {
    onAnalyze: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onAnalyze }) => {
    const stats = [
        { label: 'Genes Analyzed', value: '450+', icon: <Dna size={18} /> },
        { label: 'Drug Interactions', value: '12,000+', icon: <Zap size={18} /> },
        { label: 'CPIC Guidelines', value: 'v24.2', icon: <Shield size={18} /> },
        { label: 'AI Accuracy', value: '97.3%', icon: <Brain size={18} /> },
    ];

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #FAFBFC 0%, #F3F4F6 100%)' }}
        >
            {/* Subtle decorative circles */}
            <div
                className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #E6F5F5, transparent 70%)' }}
            />
            <div
                className="absolute bottom-20 left-10 w-72 h-72 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #FEF0EF, transparent 70%)' }}
            />

            {/* Main content */}
            <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
                {/* Status badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
                    style={{
                        background: '#ECFDF5',
                        border: '1px solid #D1FAE5',
                        color: '#059669',
                    }}
                >
                    <div className="w-2 h-2 rounded-full" style={{ background: '#059669' }} />
                    Genomic Analysis Engine Active
                </motion.div>

                {/* Main title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-4"
                >
                    <span style={{ color: '#1F2937' }}>
                        Personalized
                    </span>
                    <br />
                    <span style={{ color: '#0D7377' }}>
                        Precision Medicine
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="mb-6"
                >
                    <p className="text-lg mb-3" style={{ color: '#6B7280' }}>
                        Upload your genomic VCF file and receive real-time pharmacogenomic drug safety insights
                    </p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {['VCF File', '→', 'Genotype Call', '→', 'Risk Prediction', '→', 'Clinical Insight'].map((item, i) => (
                            <span
                                key={i}
                                className={`text-sm font-medium px-2 py-0.5 rounded ${item === '→'
                                    ? ''
                                    : ''
                                    }`}
                                style={{
                                    color: item === '→' ? '#D1D5DB' : '#0D7377',
                                    background: item === '→' ? 'transparent' : '#E6F5F5',
                                    border: item === '→' ? 'none' : '1px solid #CCE9EA',
                                }}
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onAnalyze}
                        className="relative px-8 py-4 rounded-xl font-semibold text-white text-base overflow-hidden group transition-all duration-200"
                        style={{
                            background: '#E8645A',
                            boxShadow: '0 4px 14px rgba(232,100,90,0.25)',
                        }}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Dna size={20} />
                            Analyze Genetic Profile
                        </span>
                    </motion.button>

                    <motion.a
                        href="#about"
                        whileHover={{ scale: 1.03 }}
                        className="px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200"
                        style={{
                            border: '1px solid #E5E7EB',
                            color: '#6B7280',
                            background: 'white',
                        }}
                    >
                        Learn About CPIC Guidelines →
                    </motion.a>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.55 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ y: -2 }}
                            className="p-4 text-center rounded-xl transition-all duration-200"
                            style={{
                                background: 'white',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div className="flex justify-center mb-2" style={{ color: '#0D7377' }}>{stat.icon}</div>
                            <div className="text-xl font-black" style={{ color: '#1F2937' }}>{stat.value}</div>
                            <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                style={{ color: '#D1D5DB' }}
            >
                <ChevronDown size={24} />
            </motion.div>
        </section>
    );
};

export default HeroSection;
