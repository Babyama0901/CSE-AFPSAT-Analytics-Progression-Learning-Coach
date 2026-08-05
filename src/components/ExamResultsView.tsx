import React, { useMemo, useState } from 'react';
import { MockExam, ScoreLog, ExamType, Subject } from '../types';
import { Trophy, ArrowLeft, Send, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface ExamResultsViewProps {
  exam: MockExam;
  answers: Record<string, string>;
  onComplete: (logs: Omit<ScoreLog, 'id' | 'timestamp'>[]) => void;
  onRetry: () => void;
}

export function ExamResultsView({ exam, answers, onComplete, onRetry }: ExamResultsViewProps) {
  const [hasInjected, setHasInjected] = useState(false);

  // Group questions by subject and calculate scores
  const resultsBySubject = useMemo(() => {
    const stats: Record<Subject, { correct: number; total: number; questions: any[] }> = {} as any;
    
    exam.sections.forEach(sec => {
      sec.questions.forEach(q => {
        if (!stats[q.subject]) {
          stats[q.subject] = { correct: 0, total: 0, questions: [] };
        }
        
        const isCorrect = answers[q.id] === q.correctAnswer;
        stats[q.subject].total++;
        if (isCorrect) stats[q.subject].correct++;
        
        stats[q.subject].questions.push({
          q,
          isCorrect,
          userAnswer: answers[q.id]
        });
      });
    });
    
    return stats;
  }, [exam, answers]);

  const totalCorrect = Object.values(resultsBySubject).reduce((acc, curr) => acc + curr.correct, 0);
  const totalQuestions = Object.values(resultsBySubject).reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100) || 0;

  const handleInjectToAnalytics = () => {
    if (hasInjected) return;
    
    const logs: Omit<ScoreLog, 'id' | 'timestamp'>[] = [];
    Object.entries(resultsBySubject).forEach(([subjectStr, stat]) => {
      if (stat.total > 0) {
        logs.push({
          exam: exam.examType,
          subject: subjectStr as Subject,
          score: stat.correct,
          total: stat.total
        });
      }
    });
    
    onComplete(logs);
    setHasInjected(true);
  };

  return (
    <div className="h-full flex flex-col items-center p-6 md:p-10 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl w-full">
        
        {/* Header summary */}
        <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400"></div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <Trophy className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2">Exam Completed!</h1>
          <p className="text-slate-400 mb-8">{exam.title}</p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-slate-900/80 px-8 py-4 rounded-xl border border-white/5">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p>
              <p className="text-3xl font-black text-white">
                {totalCorrect} <span className="text-xl text-slate-500">/ {totalQuestions}</span>
              </p>
            </div>
            <div className="bg-slate-900/80 px-8 py-4 rounded-xl border border-white/5">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Accuracy</p>
              <p className={`text-3xl font-black ${overallPercentage >= 80 ? 'text-emerald-400' : overallPercentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {overallPercentage}%
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Injection Card */}
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-indigo-300 mb-1">Sync with Analytics Engine</h3>
            <p className="text-sm text-slate-300">
              Inject these results into your dashboard to update your Coaching Plan and Progression Tracking.
            </p>
          </div>
          <button 
            onClick={handleInjectToAnalytics}
            disabled={hasInjected}
            className={`shrink-0 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
              hasInjected 
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'
            }`}
          >
            {hasInjected ? (
              <><CheckCircle2 className="w-5 h-5" /> Saved to History!</>
            ) : (
              <><Send className="w-5 h-5" /> Inject Results</>
            )}
          </button>
        </div>

        {/* Breakdown by Subject */}
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
           Subject Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Object.entries(resultsBySubject).map(([subject, stat]) => {
            const perc = Math.round((stat.correct / stat.total) * 100);
            return (
              <div key={subject} className="bg-slate-900/60 border border-white/5 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">{subject}</h4>
                  <p className="text-sm text-slate-500">{stat.correct} out of {stat.total}</p>
                </div>
                <div className={`text-lg font-black ${perc >= 80 ? 'text-emerald-400' : perc >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {perc}%
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-12 mb-8">
          <button 
            onClick={onRetry}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Exams
          </button>
        </div>

      </div>
    </div>
  );
}
