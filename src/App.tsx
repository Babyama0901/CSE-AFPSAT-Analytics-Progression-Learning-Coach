import React, { useState, useMemo, useEffect } from 'react';
import { BrainCircuit, Activity, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ScoreLog } from './types';
import { calculateAnalytics, generateCoachingPlan } from './utils/analytics';
import { ScoreEntryForm } from './components/ScoreEntryForm';
import { StatCard } from './components/StatCard';
import { MasteryChart } from './components/MasteryChart';
import { CoachingPanel } from './components/CoachingPanel';

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

  const analytics = useMemo(() => calculateAnalytics(logs), [logs]);
  const latestLog = useMemo(() => logs[logs.length - 1], [logs]);
  
  const coachingPlan = useMemo(() => {
    return generateCoachingPlan(analytics.weakestSubject, latestLog);
  }, [analytics.weakestSubject, latestLog]);

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
              <p className="text-xs font-medium text-slate-400 tracking-wide">CSE & AFPSAT Progression</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-semibold tracking-wider text-slate-300">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Top Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Overall Readiness" 
              value={`${analytics.readinessScore.toFixed(1)}%`}
              subtitle="Target: 80.0%"
              status={analytics.readinessScore >= 80 ? 'optimal' : (analytics.readinessScore > 0 ? 'warning' : 'neutral')}
              icon="readiness"
            />
            <StatCard 
              title="Critical Deficit" 
              value={analytics.weakestSubject ? analytics.weakestSubject.subject : 'N/A'}
              subtitle={analytics.weakestSubject ? `Mastery: ${analytics.weakestSubject.latestPercentage.toFixed(1)}%` : 'Awaiting Data'}
              status={analytics.weakestSubject ? 'critical' : 'neutral'}
              icon="deficit"
            />
            <StatCard 
              title="Engine Inputs" 
              value={logs.length}
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

          {/* Visualization Row */}
          <motion.div variants={itemVariants} className="pt-2">
            <MasteryChart stats={analytics.subjectStats} />
          </motion.div>
          
        </motion.div>
      </main>
    </div>
  );
}
