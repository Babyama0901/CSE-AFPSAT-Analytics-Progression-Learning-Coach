import React, { useMemo, useEffect, useState } from 'react';
import { MockExam, ScoreLog, ExamType, Subject, Question } from '../types';
import { Trophy, ArrowLeft, Send, CheckCircle2, XCircle, AlertTriangle, Clock, Timer, Check, X } from 'lucide-react';

interface ExamResultsViewProps {
  exam: MockExam;
  answers: Record<string, string>;
  timeElapsed: number; // in seconds
  onComplete: (logs: Omit<ScoreLog, 'id' | 'timestamp'>[]) => void;
  onRetry: () => void;
}

export function ExamResultsView({ exam, answers, timeElapsed, onComplete, onRetry }: ExamResultsViewProps) {
  const [hasInjected, setHasInjected] = useState(false);

  // Group questions by subject and calculate scores
  const resultsBySubject = useMemo(() => {
    const stats: Record<Subject, { correct: number; total: number; questions: { q: Question; isCorrect: boolean; userAnswer: string }[] }> = {} as any;
    
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
  const avgTimePerQuestion = totalQuestions > 0 ? Math.round(timeElapsed / totalQuestions) : 0;

  // Auto-inject on mount
  useEffect(() => {
    if (!hasInjected) {
      const logs: Omit<ScoreLog, 'id' | 'timestamp'>[] = [];
      const groupId = exam.id; // use exam ID to group them
      
      Object.entries(resultsBySubject).forEach(([subjectStr, stat]) => {
        if (stat.total > 0) {
          logs.push({
            exam: exam.examType,
            subject: subjectStr as Subject,
            score: stat.correct,
            total: stat.total,
            groupId,
            isMockExam: true,
            mockExamTitle: exam.title,
            timeElapsed
          });
        }
      });
      
      if (logs.length > 0) {
        onComplete(logs);
      }
      setHasInjected(true);
    }
  }, [hasInjected, exam, resultsBySubject, onComplete, timeElapsed]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // Flatten all questions for Answer Key
  const allQuestionsWithStatus = useMemo(() => {
    let list: { q: Question; isCorrect: boolean; userAnswer: string }[] = [];
    Object.values(resultsBySubject).forEach(stat => {
      list.push(...stat.questions);
    });
    return list;
  }, [resultsBySubject]);

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
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p>
              <p className="text-2xl font-black text-white">
                {totalCorrect} <span className="text-sm text-slate-500">/ {totalQuestions}</span>
              </p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Accuracy</p>
              <p className={`text-2xl font-black ${overallPercentage >= 80 ? 'text-emerald-400' : overallPercentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {overallPercentage}%
              </p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex justify-center items-center gap-1"><Clock className="w-3 h-3"/> Elapsed</p>
              <p className="text-2xl font-black text-indigo-400">
                {formatTime(timeElapsed)}
              </p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex justify-center items-center gap-1"><Timer className="w-3 h-3"/> Avg Time</p>
              <p className="text-2xl font-black text-cyan-400">
                {avgTimePerQuestion}s
              </p>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" /> Results automatically synced to Analytics Engine
          </div>
        </div>

        {/* Breakdown by Subject */}
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
           Subject Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
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
        
        {/* Answer Key */}
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
           Answer Key & Explanations
        </h3>
        <div className="space-y-4 mb-10">
          {allQuestionsWithStatus.map((item, index) => (
            <div key={item.q.id} className={`glass-panel p-5 rounded-xl border ${item.isCorrect ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
              <div className="flex gap-4">
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${item.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">{item.q.subject}</div>
                  <p className="text-slate-200 font-medium mb-4">{item.q.text}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                      <div className="text-xs text-slate-500 font-bold uppercase mb-1">Your Answer</div>
                      <div className={`font-medium flex items-start gap-2 ${item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.isCorrect ? <Check className="w-4 h-4 mt-0.5 shrink-0"/> : <X className="w-4 h-4 mt-0.5 shrink-0"/>}
                        {item.userAnswer || <span className="italic opacity-50">No Answer</span>}
                      </div>
                    </div>
                    {!item.isCorrect && (
                      <div className="bg-emerald-900/10 p-3 rounded-lg border border-emerald-500/10">
                        <div className="text-xs text-emerald-500/70 font-bold uppercase mb-1">Correct Answer</div>
                        <div className="font-medium text-emerald-400 flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 shrink-0"/>
                          {item.q.correctAnswer}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-indigo-900/10 border border-indigo-500/10 p-4 rounded-lg">
                    <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Explanation
                    </div>
                    <p className="text-sm text-indigo-200/80">
                      {item.q.explanation || "Explanation not provided in source material. Please review standard conventions for this rule."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 mb-12">
          <button 
            onClick={onRetry}
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest uppercase transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2"
          >
             Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
