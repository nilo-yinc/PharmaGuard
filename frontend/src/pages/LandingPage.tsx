import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import VCFUpload from './VCFUpload';
import DrugInput from './DrugInput';
import { useNavigate } from 'react-router-dom';
import { SupportedDrug } from '../utils/mockData';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [selectedDrugs, setSelectedDrugs] = useState<SupportedDrug[]>([]);

    const handleAnalyze = (drugs: SupportedDrug[]) => {
        setSelectedDrugs(drugs);
        navigate('/analyze');
    };

    return (
        <>
            <HeroSection
                onAnalyze={() => {
                    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
                }}
            />

            {/* VCF Upload section */}
            <div className="relative" style={{ background: 'var(--bg-muted)' }}>
                <VCFUpload onFileAccepted={(file) => setUploadedFile(file)} />
            </div>

            {/* Drug Input section */}
            <div className="relative" style={{ background: 'var(--bg-surface)' }}>
                <DrugInput
                    onDrugsSelected={setSelectedDrugs}
                    onAnalyze={handleAnalyze}
                    hasFile={!!uploadedFile}
                />
            </div>

            {/* About / How it Works */}
            <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>How PharmaGuard Works</h2>
                    <p style={{ color: 'var(--text-secondary)' }} className="max-w-2xl mx-auto">
                        Leveraging CPIC guidelines and AI to deliver personalized drug safety insights based on your unique genetic profile.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { step: '01', title: 'Upload VCF', desc: 'Upload your Variant Call Format file from whole-genome or targeted pharmacogene sequencing.', icon: '🧬', color: '#0D7377' },
                        { step: '02', title: 'Genotype Analysis', desc: 'Our AI engine calls diplotypes for 450+ pharmacogenes using CPIC star allele nomenclature.', icon: '⚗️', color: '#E8645A' },
                        { step: '03', title: 'Clinical Report', desc: 'Receive CPIC-aligned drug risk predictions with clinical recommendations for each medication.', icon: '📋', color: '#059669' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            whileHover={{ y: -4 }}
                            className="p-6 rounded-2xl text-center transition-all duration-200"
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
                        >
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <div className="text-xs font-mono mb-2 font-bold" style={{ color: item.color }}>STEP {item.step}</div>
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Error handling */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10"
                >
                    <h3 className="text-lg font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>Error Handling</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { type: 'Invalid VCF Format', desc: 'File doesn\'t conform to VCF 4.1/4.2 standard.', solution: 'System validates ##fileformat header and CHROM structure.', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
                            { type: 'Missing Gene Annotations', desc: 'VCF lacks pharmacogene annotations.', solution: 'Provides partial analysis with confidence degradation.', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
                            { type: 'Unsupported Drug', desc: 'Drug not in CPIC database.', solution: 'Returns "Unknown" label with PharmGKB link.', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                            { type: 'Network/API Error', desc: 'Analysis service unavailable.', solution: 'Fallback to cached CPIC guidelines with offline indicator.', color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' },
                        ].map((err) => (
                            <div key={err.type} className="p-4 rounded-xl text-xs" style={{ background: err.bg, border: `1px solid ${err.border}` }}>
                                <p className="font-semibold mb-1" style={{ color: err.color }}>{err.type}</p>
                                <p className="mb-2 leading-relaxed" style={{ color: '#6B7280' }}>{err.desc}</p>
                                <p className="leading-relaxed" style={{ color: '#4B5563' }}>{err.solution}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </>
    );
};

export default LandingPage;
