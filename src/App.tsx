import React, { useState, useMemo, useEffect } from 'react';
import { BrainCircuit, Activity, Sparkles, LayoutDashboard, TrendingUp, Download, Home } from 'lucide-react';
import { ScoreLog, ExamType, CSE_SUBJECTS, AFPSAT_SUBJECTS } from './types';
import { calculateAnalytics, generateCoachingPlan } from './utils/analytics';
import { ScoreEntryForm } from './components/ScoreEntryForm';
import { StatCard } from './components/StatCard';
import { MasteryChart } from './components/MasteryChart';
import { CoachingPanel } from './components/CoachingPanel';
import { ProgressionChart } from './components/ProgressionChart';
import { ExportModal } from './components/ExportModal';
import { DashboardView } from './components/DashboardView';
import { generateAnalyticsReport } from './utils/pdfGenerator';

export default function App() {
  const [logs, setLogs] = useState<ScoreLog[]>([]);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | ExamType>('DASHBOARD');
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

  // For the exam view
  const currentExamAnalytics = activeTab === 'AFPSAT' ? afpsatAnalytics : cseAnalytics;
  const currentExamLogs = activeTab === 'AFPSAT' ? afpsatLogs : cseLogs;
  const latestLog = useMemo(() => currentExamLogs[currentExamLogs.length - 1], [currentExamLogs]);
  
  const coachingPlan = useMemo(() => {
    return generateCoachingPlan(currentExamAnalytics.weakestSubject, latestLog);
  }, [currentExamAnalytics.weakestSubject, latestLog]);

  const handleExport = () => {
    generateAnalyticsReport(cseAnalytics, afpsatAnalytics, logs);
  };

  // Calculate macro-level historical readiness for the Dashboard
  const historicalReadinessData = useMemo(() => {
    return logs.map((_, index) => {
      const currentLogs = logs.slice(0, index + 1);
      const cseCurrent = currentLogs.filter(l => l.exam === 'CSE' || !l.exam);
      const afpsatCurrent = currentLogs.filter(l => l.exam === 'AFPSAT');
      
      const cseAn = calculateAnalytics(cseCurrent, CSE_SUBJECTS);
      const afpsatAn = calculateAnalytics(afpsatCurrent, AFPSAT_SUBJECTS);
      
      return {
        attempt: `Log ${index + 1}`,
        CSE: cseAn.readinessScore > 0 ? Number(cseAn.readinessScore.toFixed(1)) : null,
        AFPSAT: afpsatAn.readinessScore > 0 ? Number(afpsatAn.readinessScore.toFixed(1)) : null
      };
    });
  }, [logs]);

  return (
    <div className="min-h-screen text-slate-200 bg-slate-950">
      
      {/* Top Navigation / Header (Removed backdrop-blur) */}
      <header className="glass-panel sticky top-0 z-50 border-b-0 border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 shadow-xl">
              <BrainCircuit className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                Analytics <span className="text-cyan-400">Engine</span>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </h1>
              <p className="text-xs font-medium text-slate-400 tracking-wide">Performance Tracking & Optimization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if(window.confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
                  setLogs([]);
                  localStorage.removeItem('analytics-engine-logs');
                }
              }}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-rose-400 transition-none flex items-center gap-2"
            >
              Reset Data
            </button>
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-slate-200 transition-none flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>

            <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
              <div className="relative flex h-3 w-3">
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
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase flex items-center gap-2 ${
                activeTab === 'DASHBOARD' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('CSE')}
              className={`px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase flex items-center gap-2 ${
                activeTab === 'CSE' 
                ? 'bg-cyan-600 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> CSE View
            </button>
            <button
              onClick={() => setActiveTab('AFPSAT')}
              className={`px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase flex items-center gap-2 ${
                activeTab === 'AFPSAT' 
                ? 'bg-purple-600 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> AFPSAT View
            </button>
          </div>
        </div>

        {activeTab === 'DASHBOARD' ? (
          <DashboardView 
            logs={logs}
            cseAnalytics={cseAnalytics}
            afpsatAnalytics={afpsatAnalytics}
            historicalReadinessData={historicalReadinessData}
          />
        ) : (
          <div key={activeTab} className="space-y-8">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title={`${activeTab} Readiness`}
                value={`${currentExamAnalytics.readinessScore.toFixed(1)}%`}
                subtitle="Target: 80.0%"
                status={currentExamAnalytics.readinessScore >= 80 ? 'optimal' : (currentExamAnalytics.readinessScore > 0 ? 'warning' : 'neutral')}
                icon="readiness"
              />
              <StatCard 
                title="Critical Deficit" 
                value={currentExamAnalytics.weakestSubject ? currentExamAnalytics.weakestSubject.subject : 'N/A'}
                subtitle={currentExamAnalytics.weakestSubject ? `Mastery: ${currentExamAnalytics.weakestSubject.latestPercentage.toFixed(1)}%` : 'Awaiting Data'}
                status={currentExamAnalytics.weakestSubject ? 'critical' : 'neutral'}
                icon="deficit"
              />
              <StatCard 
                title="Engine Inputs" 
                value={currentExamLogs.length}
                subtitle="Diagnostic Logs Analyzed"
                icon="inputs"
              />
            </div>

            {/* Input & Coaching Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 flex flex-col">
                <ScoreEntryForm onAddLog={handleAddLog} />
              </div>
              <div className="lg:col-span-8 flex flex-col">
                <CoachingPanel plan={coachingPlan} />
              </div>
            </div>

            {/* Visualization Row (Progression & Mastery) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
              <ProgressionChart stats={currentExamAnalytics.subjectStats} exam={activeTab} />
              <MasteryChart stats={currentExamAnalytics.subjectStats} />
            </div>
            
          </div>
        )}
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
