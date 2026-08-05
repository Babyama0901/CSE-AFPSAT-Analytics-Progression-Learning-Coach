import React, { useState, useEffect } from 'react';
import { MOCK_EXAMS } from '../data/mockExams';
import { MockExam, Question, ExamSection, Subject } from '../types';
import { Play, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ExamResultsView } from './ExamResultsView';

export function PracticeTestView({ onCompleteExam }: { onCompleteExam: (log: any) => void }) {
  const [selectedExam, setSelectedExam] = useState<MockExam | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Flattened questions for easy navigation
  const [allQuestions, setAllQuestions] = useState<{question: Question, section: ExamSection, index: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedExam) {
      let qList: any[] = [];
      let i = 0;
      selectedExam.sections.forEach(section => {
        section.questions.forEach(q => {
          qList.push({ question: q, section: section, index: i++ });
        });
      });
      setAllQuestions(qList);
      setTimeLeft(selectedExam.timeLimitMinutes * 60);
    }
  }, [selectedExam]);

  useEffect(() => {
    let timer: any;
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft]);

  const handleStart = (exam: MockExam) => {
    setSelectedExam(exam);
    setIsStarted(true);
    setIsFinished(false);
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleFinishExam = () => {
    setIsFinished(true);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    if (currentIndex < allQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isFinished && selectedExam) {
    return <ExamResultsView exam={selectedExam} answers={answers} onComplete={onCompleteExam} onRetry={() => setIsStarted(false)} />;
  }

  if (isStarted && selectedExam && allQuestions.length > 0) {
    const currentQ = allQuestions[currentIndex];
    const isLast = currentIndex === allQuestions.length - 1;
    const isFirst = currentIndex === 0;

    return (
      <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-slate-900/60">
        {/* Header */}
        <div className="bg-slate-950/80 p-4 border-b border-white/5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">{selectedExam.title}</h2>
            <p className="text-xs text-slate-400">{currentQ.section.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${timeLeft < 300 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={() => {
                if(window.confirm('Are you sure you want to finish the exam early?')) {
                  handleFinishExam();
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Exam
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-900">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Question Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col">
            <div className="max-w-3xl mx-auto w-full flex-1">
              {/* Instructions */}
              {currentQ.section.instructions && (
                <div className="bg-cyan-900/20 border border-cyan-500/20 text-cyan-200 p-4 rounded-xl mb-6 text-sm flex gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{currentQ.section.instructions}</p>
                </div>
              )}

              {/* Passage (if any) */}
              {currentQ.question.passage && (
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl mb-6 text-slate-300 prose prose-invert max-w-none">
                  {currentQ.question.passage.split('\n').map((p, i) => (
                    <p key={i} className="mb-2">{p}</p>
                  ))}
                </div>
              )}

              {/* Question Text */}
              <div className="mb-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-indigo-500/20 text-indigo-400 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/30">
                    {currentIndex + 1}
                  </div>
                  <h3 className="text-xl text-white font-medium pt-1 leading-relaxed">{currentQ.question.text}</h3>
                </div>

                {/* Options */}
                <div className="space-y-3 pl-14">
                  {currentQ.question.options.map((opt, i) => {
                    const isSelected = answers[currentQ.question.id] === opt;
                    const optionLetter = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(currentQ.question.id, opt)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                          isSelected 
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                            : 'bg-slate-800/50 border-white/5 hover:border-white/10 hover:bg-slate-800'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {optionLetter}
                        </div>
                        <span className={`text-base ${isSelected ? 'text-white' : 'text-slate-300'}`}>{opt}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="max-w-3xl mx-auto w-full flex justify-between items-center pt-6 border-t border-white/5 mt-auto">
              <button 
                onClick={() => setCurrentIndex(prev => prev - 1)}
                disabled={isFirst}
                className="px-5 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <div className="text-sm text-slate-500 font-medium">
                {currentIndex + 1} of {allQuestions.length}
              </div>

              {!isLast ? (
                <button 
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-2 shadow-lg"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => handleFinishExam()}
                  className="px-5 py-2.5 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                  Submit <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing Page
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Play className="w-8 h-8 ml-1" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-4">Mock Exam Simulator</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Test your readiness under simulated exam conditions. Select an exam below to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_EXAMS.map(exam => (
            <div key={exam.id} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{exam.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wider">{exam.examType}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>{exam.totalItems} Items Total</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span>{Math.floor(exam.timeLimitMinutes / 60)}h {exam.timeLimitMinutes % 60}m Time Limit</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleStart(exam)}
                className="mt-auto w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" /> Start Exam
              </button>
            </div>
          ))}
          {MOCK_EXAMS.length === 0 && (
             <div className="col-span-1 md:col-span-2 text-center p-12 text-slate-500 border border-dashed border-white/10 rounded-2xl">
               No mock exams available yet.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
