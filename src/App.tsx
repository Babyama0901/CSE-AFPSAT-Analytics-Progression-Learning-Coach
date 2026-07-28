import React, { useState, useMemo, useEffect } from 'react';
import { BrainCircuit, Activity, Sparkles, LayoutDashboard, TrendingUp, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { ScoreLog, ExamType, CSE_SUBJECTS, AFPSAT_SUBJECTS } from './types';
import { calculateAnalytics, generateCoachingPlan } from './utils/analytics';
import { ScoreEntryForm } from './components/ScoreEntryForm';
import { StatCard } from './components/StatCard';
import { MasteryChart } from './components/MasteryChart';
import { CoachingPanel } from './components/CoachingPanel';
import { ProgressionChart } from './components/ProgressionChart';
import { ExportModal } from './components/ExportModal';
import { generateAnalyticsReport } from './utils/pdfGenerator';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function App() {
  const [logs, setLogs] = useState<ScoreLog[]>([]);
  const [activeTab, setActiveTab] = useState<ExamType>('CSE');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('analytics-engine-logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('analytics-engine-logs', JSON.stringify(logs));
  }, [logs]);

  const handleAddLog = (logData: Omit<ScoreLog, 'id' | 'timestamp'>) => {
    const newLog: ScoreLog = {
      ...logData,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setLogs(prev => [...prev, newLog]);
  };

  const cseLogs = logs.filter(log => log.exam === 'CSE' || !log.exam); // Default older logs to CSE
  const afpsatLogs = logs.filter(log => log.exam === 'AFPSAT');

  const cseAnalytics = useMemo(() => calculateAnalytics(cseLogs, CSE_SUBJECTS), [cseLogs]);
  const afpsatAnalytics = useMemo(() => calculateAnalytics(afpsatLogs, AFPSAT_SUBJECTS), [afpsatLogs]);

  const activeAnalytics = activeTab === 'CSE' ? cseAnalytics : afpsatAnalytics;
  const activeLogs = activeTab === 'CSE' ? cseLogs : afpsatLogs;
  const latestLog = useMemo(() => activeLogs[activeLogs.length - 1], [activeLogs]);
  
  const coachingPlan = useMemo(() => {
    return generateCoachingPlan(activeAnalytics.weakestSubject, latestLog);
  }, [activeAnalytics.weakestSubject, latestLog]);

  const handleExport = () => {
    generateAnalyticsReport(cseAnalytics, afpsatAnalytics, logs);
  };

  return (
    <div className="min-h-screen text-slate-200">
      
      {/* Top Navigation / Header */}
      <header className="glass-panel sticky top-0 z-50 border-b-0 border-white/5 bg-slate-950/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 shadow-xl">
                <BrainCircuit className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Engine</span>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </h1>
              <p className="text-xs font-medium text-slate-400 tracking-wide">Performance Tracking & Optimization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-slate-200 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>

            <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-semibold tracking-wider text-slate-300">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Exam View Toggle */}
        <div className="flex justify-center mb-10">
          <div className="glass-panel p-1.5 rounded-2xl inline-flex gap-2">
            <button
              onClick={() => setActiveTab('CSE')}
              className={`px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'CSE' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> CSE View
            </button>
            <button
              onClick={() => setActiveTab('AFPSAT')}
              className={`px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'AFPSAT' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> AFPSAT View
            </button>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeTab} // re-trigger animation on tab change
          className="space-y-8"
        >
          {/* Top Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title={`${activeTab} Readiness`}
              value={`${activeAnalytics.readinessScore.toFixed(1)}%`}
              subtitle="Target: 80.0%"
              status={activeAnalytics.readinessScore >= 80 ? 'optimal' : (activeAnalytics.readinessScore > 0 ? 'warning' : 'neutral')}
              icon="readiness"
            />
            <StatCard 
              title="Critical Deficit" 
              value={activeAnalytics.weakestSubject ? activeAnalytics.weakestSubject.subject : 'N/A'}
              subtitle={activeAnalytics.weakestSubject ? `Mastery: ${activeAnalytics.weakestSubject.latestPercentage.toFixed(1)}%` : 'Awaiting Data'}
              status={activeAnalytics.weakestSubject ? 'critical' : 'neutral'}
              icon="deficit"
            />
            <StatCard 
              title="Engine Inputs" 
              value={activeLogs.length}
              subtitle="Diagnostic Logs Analyzed"
              icon="inputs"
            />
          </motion.div>

          {/* Input & Coaching Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col">
              <ScoreEntryForm onAddLog={handleAddLog} />
            </motion.div>
            <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col">
              <CoachingPanel plan={coachingPlan} />
            </motion.div>
          </div>

          {/* Visualization Row (Progression & Mastery) */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
            <ProgressionChart stats={activeAnalytics.subjectStats} exam={activeTab} />
            <MasteryChart stats={activeAnalytics.subjectStats} />
          </motion.div>
          
        </motion.div>
      </main>

      {/* Export Modal Overlay */}
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        cseAnalytics={cseAnalytics}
        afpsatAnalytics={afpsatAnalytics}
        logs={logs}
      />

    </div>
  );
}
