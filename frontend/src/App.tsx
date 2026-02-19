import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import LoadingScreen from './pages/LoadingScreen';
import Navbar from './pages/Navbar';
import HeroSection from './pages/HeroSection';
import VCFUpload from './pages/VCFUpload';
import DrugInput from './pages/DrugInput';
import Dashboard from './pages/Dashboard';
import { FloatingBadges } from './pages/InnovativeFeatures';
import { SupportedDrug } from './utils/mockData';

type AppState = 'loading' | 'home' | 'dashboard';

function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<SupportedDrug[]>([]);

  const handleLoadingComplete = () => {
    setAppState('home');
  };

  const handleFileAccepted = (file: File) => {
    setUploadedFile(file);
  };

  const handleAnalyze = (drugs: SupportedDrug[]) => {
    setSelectedDrugs(drugs);
    setAppState('dashboard');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handleNavigateHome = () => {
    setAppState('home');
    setUploadedFile(null);
    setSelectedDrugs([]);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  return (
    <ThemeProvider>
      <div
        className="min-h-screen relative"
        style={{ background: '#FAFBFC' }}
      >
        {/* Loading Screen */}
        <AnimatePresence>
          {appState === 'loading' && (
            <LoadingScreen onComplete={handleLoadingComplete} />
          )}
        </AnimatePresence>

        {/* Main App */}
        <AnimatePresence mode="wait">
          {appState !== 'loading' && (
            <motion.div
              key="main-app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Navbar />

              {/* Fixed floating compliance badges overlay */}
              <FloatingBadges />

              {appState === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <HeroSection
                    onAnalyze={() => {
                      document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />

                  {/* VCF Upload section */}
                  <div className="relative" style={{ background: '#FAFBFC' }}>
                    <VCFUpload onFileAccepted={handleFileAccepted} />
                  </div>

                  {/* Drug Input section */}
                  <div className="relative" style={{ background: '#F9FAFB' }}>
                    <DrugInput
                      onDrugsSelected={setSelectedDrugs}
                      onAnalyze={handleAnalyze}
                      hasFile={!!uploadedFile}
                    />
                  </div>

                  {/* About / Info section */}
                  <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="text-center mb-12"
                    >
                      <h2 className="text-4xl font-black mb-3" style={{ color: '#1F2937' }}>How PharmaGuard Works</h2>
                      <p style={{ color: '#6B7280' }} className="max-w-2xl mx-auto">
                        Leveraging CPIC guidelines and AI to deliver personalized drug safety insights based on your unique genetic profile.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          step: '01',
                          title: 'Upload VCF',
                          desc: 'Upload your Variant Call Format file from whole-genome or targeted pharmacogene sequencing.',
                          icon: '🧬',
                          color: '#0D7377',
                        },
                        {
                          step: '02',
                          title: 'Genotype Analysis',
                          desc: 'Our AI engine calls diplotypes for 450+ pharmacogenes using CPIC star allele nomenclature.',
                          icon: '⚗️',
                          color: '#E8645A',
                        },
                        {
                          step: '03',
                          title: 'Clinical Report',
                          desc: 'Receive CPIC-aligned drug risk predictions with clinical recommendations for each medication.',
                          icon: '📋',
                          color: '#059669',
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={item.step}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.15 }}
                          whileHover={{ y: -4 }}
                          className="p-6 rounded-2xl text-center transition-all duration-200"
                          style={{
                            background: 'white',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                        >
                          <div className="text-4xl mb-4">{item.icon}</div>
                          <div
                            className="text-xs font-mono mb-2 font-bold"
                            style={{ color: item.color }}
                          >
                            STEP {item.step}
                          </div>
                          <h3 className="text-lg font-bold mb-2" style={{ color: '#1F2937' }}>{item.title}</h3>
                          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Error handling section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-10"
                    >
                      <h3 className="text-lg font-bold mb-4 text-center" style={{ color: '#1F2937' }}>Error Handling</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          {
                            type: 'Invalid VCF Format',
                            desc: 'File doesn\'t conform to VCF 4.1/4.2 standard header format.',
                            solution: 'The system validates the ##fileformat header and CHROM column structure.',
                            color: '#DC2626',
                            bg: '#FEF2F2',
                            border: '#FECACA',
                          },
                          {
                            type: 'Missing Gene Annotations',
                            desc: 'VCF lacks required pharmacogene variant annotations.',
                            solution: 'System flags missing genes and provides partial analysis with confidence degradation.',
                            color: '#D97706',
                            bg: '#FFFBEB',
                            border: '#FDE68A',
                          },
                          {
                            type: 'Unsupported Drug',
                            desc: 'Requested drug not in CPIC database.',
                            solution: 'Returns "Unknown" risk label with link to PharmGKB for manual lookup.',
                            color: '#2563EB',
                            bg: '#EFF6FF',
                            border: '#BFDBFE',
                          },
                          {
                            type: 'Network/API Error',
                            desc: 'Analysis service temporarily unavailable.',
                            solution: 'Graceful fallback to cached CPIC guidelines with offline mode indicator.',
                            color: '#6B7280',
                            bg: '#F9FAFB',
                            border: '#E5E7EB',
                          },
                        ].map((err) => (
                          <div
                            key={err.type}
                            className="p-4 rounded-xl text-xs"
                            style={{
                              background: err.bg,
                              border: `1px solid ${err.border}`,
                            }}
                          >
                            <p className="font-semibold mb-1" style={{ color: err.color }}>{err.type}</p>
                            <p className="mb-2 leading-relaxed" style={{ color: '#6B7280' }}>{err.desc}</p>
                            <p className="leading-relaxed" style={{ color: '#4B5563' }}>{err.solution}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </section>

                  {/* Footer */}
                  <footer style={{ borderTop: '1px solid #E5E7EB' }} className="mt-10 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-sm" style={{ color: '#1F2937' }}>PharmaGuard</p>
                        <p className="text-xs" style={{ color: '#9CA3AF' }}>Pharmacogenomic Risk Prediction System • For Educational/Research Use</p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs" style={{ color: '#9CA3AF' }}>
                        {['CPIC v24.2', 'PharmGKB', 'VCF 4.2', 'FHIR R4', 'HL7'].map(badge => (
                          <span key={badge} className="px-2 py-0.5 rounded" style={{ border: '1px solid #E5E7EB', background: '#F9FAFB' }}>{badge}</span>
                        ))}
                      </div>
                    </div>
                  </footer>
                </motion.div>
              )}

              {appState === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pt-20"
                >
                  {/* Back to home */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 mb-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNavigateHome}
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{ color: '#6B7280' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#0D7377'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
                    >
                      ← Back to Analysis Setup
                    </motion.button>
                  </div>
                  <Dashboard selectedDrugs={selectedDrugs} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}

export default App;
