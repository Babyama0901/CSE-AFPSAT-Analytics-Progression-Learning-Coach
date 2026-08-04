import React, { useState, useEffect } from 'react';
import { Subject, ExamType, CSE_SUBJECTS, AFPSAT_SUBJECTS, AFPSAT_GROUPS, CSE_GROUPS, ScoreLog } from '../types';
import { Activity, Send } from 'lucide-react';

interface ScoreEntryFormProps {
  onAddLog: (log: Omit<ScoreLog, 'id' | 'timestamp'>) => void;
}

export function ScoreEntryForm({ onAddLog }: ScoreEntryFormProps) {
  const [exam, setExam] = useState<ExamType>('CSE');
  const [subject, setSubject] = useState<Subject>(CSE_SUBJECTS[0]);
  const [score, setScore] = useState<number | ''>('');
  const [total, setTotal] = useState<number | ''>(50);
  const [subtopicsMissed, setSubtopicsMissed] = useState<string>('');

  const currentSubjects = exam === 'CSE' ? CSE_SUBJECTS : AFPSAT_SUBJECTS;

  // Reset subject when exam changes
  useEffect(() => {
    setSubject(currentSubjects[0]);
  }, [exam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score === '' || total === '') return;
    
    onAddLog({
      exam,
      subject,
      score: Number(score),
      total: Number(total),
      subtopicsMissed: subtopicsMissed.trim() || undefined
    });
    
    setScore('');
    setSubtopicsMissed('');
  };

  return (
    <div className="glass-panel p-8 rounded-2xl h-full flex flex-col relative overflow-hidden group">
      {/* Subtle background flair */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          Diagnostic Input
        </h2>
        <p className="text-slate-400 text-sm mt-2">Log new test results to recalibrate the engine.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5 relative flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Exam</label>
            <div className="relative">
              <select 
                value={exam}
                onChange={(e) => setExam(e.target.value as ExamType)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 appearance-none transition-all font-bold"
              >
                <option value="CSE" className="bg-slate-900 font-sans">CSE</option>
                <option value="AFPSAT" className="bg-slate-900 font-sans">AFPSAT</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Subject Cluster</label>
            <div className="relative">
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 appearance-none transition-all"
              >
                {Object.entries(exam === 'CSE' ? CSE_GROUPS : AFPSAT_GROUPS).map(([group, subjects]) => (
                  <optgroup key={group} label={group} className="bg-slate-900 font-sans font-bold text-slate-400">
                    {subjects.map(s => (
                      <option key={s} value={s} className="bg-slate-900 font-sans font-normal text-slate-200">{s}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Raw Score</label>
            <input 
              type="number" 
              min="0"
              max={total || 100}
              required
              value={score}
              onChange={(e) => setScore(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-slate-600 font-mono"
              placeholder="e.g. 23"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Total Items</label>
            <input 
              type="number" 
              min="1"
              required
              value={total}
              onChange={(e) => setTotal(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Specific Sub-topics Missed</label>
          <input 
            type="text" 
            value={subtopicsMissed}
            onChange={(e) => setSubtopicsMissed(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
            placeholder="e.g. Fraction Word Problems"
          />
        </div>

        <button 
          type="submit"
          className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 rounded-xl py-3.5 text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
        >
          Inject Data <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
