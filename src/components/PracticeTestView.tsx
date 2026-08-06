import React, { useState, useEffect } from 'react';
import { MOCK_EXAM_TEMPLATES } from '../data/mockExams';
import { QUESTION_BANK } from '../data/questionBank';
import { MockExamTemplate, MockExam, Question, ExamSection, Subject } from '../types';
import { Play, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Check, BookOpen, Calculator, BrainCircuit, Globe2, MessageSquare, Shapes, Award } from 'lucide-react';
import { ExamResultsView } from './ExamResultsView';

// Helper to highlight target words since the raw text lost its formatting
const highlightQuestionText = (text: string, subject: Subject) => {
  let highlightedText = text;

  const highlights: Record<string, string[]> = {
    'Vocabulary': [
      'Gullible', 'jettison', 'disseminate', 'feasible', 'perennial', 
      'amicable', 'abridged', 'laudable', 'lackadaisical', 'tenaciously',
      'equalitarian', 'diligence', 'abominate', 'furious', 'complacent',
      'exacerbate', 'inherent', 'affluent', 'incessant', 'exhaustive',
      'serendipity', 'appease', 'benevolent', 'litigate', 'antsy',
      'accolades', 'engender', 'fret', 'fortuitous', 'renowned', 'deprecate'
    ],
    'Idiomatic Expressions': [
      'out of hand', 'picks on', 'black sheep', 'raining cats and dogs',
      'put in for', 'wild-goose chase', 'prowled around', 'put her foot in it',
      'add up', 'clammed up', 'get into', 'knock your socks off', 'cooped up',
      'saw red', 'pig out', 'made a deal', 'talking through her hat', 'towers over',
      'pull a few strings', 'got out of bed on the wrong side', 'buries herself',
      'white elephant', 'stands to reason', 'give my right arm', 'went bananas',
      'brought her into contact', 'grass grow under your feet', 'spill the beans',
      'starving'
    ],
    'Talasitaan': [
      'abang-aba', 'antikuwaryo', 'alumanahin', 'babahan', 'badilas', 'bagansya', 'bagkus', 'bagwis', 'Bahete', 'bakang-bakang', 
      'balik-inikaw', 'balintataw', 'baluwarte', 'pagdalumat', 'Dayang-Dayang', 'diplomasya', 'disareglado', 'eskudero', 'mapagsapantaha', 'Sipnayan', 
      'kumakandili', 'kinakatigan', 'Inaaninaw', 'kabisera', 'pumapasag', 'duplikal', 'hungkag', 'pagpapalahaw', 'bantayog', 'tarangkahan', 
      'Matalinghaga', 'pumanaw', 'tarheta', 'asul', 'lagom', 'dalubhasa', 'horno', 'panukala', 'salawal', 'guryon', 
      'kanaryo', 'magkakaalyansa', 'pagal', 'salipawpaw', 'agiw', 'panaghoy', 'pantas', 'sipi', 'salumpuwit', 'payak'
    ],
    'Kawikaang Filipino': [
      'alilang-kanin', 'tulak ng bibig', 'mabigat ang kamay', 'kusang-palo', 'balik-harap', 'utak-biya', 'nagtataingang-kawali', 
      "buto't balat", 'sukat ang bulsa', 'pagbabatak ng buto', 'kidlat sa bilis', 'di makabasag-pinggan', 'hindi mahulugang karayom', 
      'daga sa dibdib', 'magbukas ng dibdib', 'mabulaklak na dila', 'maanghang ang dila', 'hindi mahapayang gatang', 'mapurol ang utak', 
      'sampa-bakod', 'nagpupusa', 'patay-gutom', 'makati ang paa', 'ningas-kugon', 'putok sa buho', 'naningalang-pugad', 'mababa ang loob', 
      'itinaga sa bato', 'krus ang dila', 'maitim ang dugo', 'kaututang dila', 'pagputi ng uwak', 'matigas ang ulo', 'bumbong na walang laman', 
      'nakakasakit ng ulo', 'hindi na makasampa sa patyo', 'hindi kakapitan ng alikabok', 'nabasagan ng pinggan', 'nagpapahaba ng alulod', 
      'mahinhin-talipandas', 'maluwag ang turnilyo', 'makabasag-kampana', 'madisgrasya', 'pambala sa kanyon', 'sinuob ng kamanyang', 
      'walang kamay', 'malalagutan ng pisi', 'bulang-gugo', 'may uwang sa puwit', 'sumugba sa ningas'
    ]
  };

  if (subject === 'Vocabulary' || subject === 'Idiomatic Expressions' || subject === 'Talasitaan' || subject === 'Kawikaang Filipino') {
    const words = highlights[subject];
    if (words) {
      words.forEach(word => {
        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, '<span class="text-cyan-400 font-bold underline decoration-cyan-500/50 underline-offset-4">$1</span>');
      });
    }
  }

  highlightedText = highlightedText.replace(/(_{2,})/g, '<span class="text-cyan-400 font-bold">$1</span>');

  if (subject === 'Identifying Errors (English Grammar)') {
    highlightedText = highlightedText.replace(/(\([A-E]\))/g, '<span class="text-indigo-400 font-bold bg-indigo-500/10 px-1 rounded mx-1">$1</span>');
  }

  return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function PracticeTestView({ onCompleteExam }: { onCompleteExam: (log: any) => void }) {
  const [selectedExam, setSelectedExam] = useState<MockExam | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  const [allQuestions, setAllQuestions] = useState<{question: Question, section: ExamSection, index: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
      setExamStartTime(Date.now());
    }
  }, [selectedExam]);

  useEffect(() => {
    let timer: any;
    if (isStarted && !isFinished && !isPaused && timeLeft > 0) {
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
  }, [isStarted, isFinished, isPaused, timeLeft]);

  const generateExamFromTemplate = (template: MockExamTemplate): MockExam => {
    const seenQuestionsStr = localStorage.getItem('seen_questions') || '[]';
    let seenQuestions: string[] = JSON.parse(seenQuestionsStr);

    const sections: ExamSection[] = [];
    const newSeenIds: string[] = [];

    // Simple mapping of subject to instructions (can be expanded if needed)
    const instructionMap: Record<string, string> = {
      'Grammar and Language Usage': 'Fill in the blanks with correct answers.',
      'Vocabulary': 'Choose the meaning of the underlined word.',
      'Spelling': 'Choose the letter of the correct answer according to the prompt.',
      'Idiomatic Expressions': 'Choose the meaning of the underlined idiomatic expression.',
      'Identifying Errors (English Grammar)': 'Identify the error in the sentence.',
      'Reading Comprehension': 'Read the passage and answer the questions.'
    };

    Object.entries(template.subjectDistribution).forEach(([subjectStr, count]) => {
      const subject = subjectStr as Subject;
      const availableQuestions = QUESTION_BANK.filter(q => q.subject === subject);
      
      // Separate into seen and unseen
      const unseen = availableQuestions.filter(q => !seenQuestions.includes(q.id));
      const seen = availableQuestions.filter(q => seenQuestions.includes(q.id));

      // Shuffle both independently
      const shuffledUnseen = shuffleArray(unseen);
      const shuffledSeen = shuffleArray(seen);

      // Prioritize unseen, then fill with seen if needed
      let selectedPool = [...shuffledUnseen, ...shuffledSeen];
      
      // If we run out of everything (shouldn't happen unless exam is huge), it just wraps
      let selectedForSection = selectedPool.slice(0, count);

      // Shuffle options for each selected question
      selectedForSection = selectedForSection.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));

      newSeenIds.push(...selectedForSection.map(q => q.id));

      sections.push({
        title: subject,
        instructions: instructionMap[subject] || 'Select the correct answer.',
        questions: selectedForSection
      });
    });

    // Update seen questions in localStorage (keep up to 1000 to avoid bloat, or just all)
    const updatedSeen = Array.from(new Set([...seenQuestions, ...newSeenIds]));
    if (updatedSeen.length > 500) updatedSeen.splice(0, updatedSeen.length - 500);
    localStorage.setItem('seen_questions', JSON.stringify(updatedSeen));

    return {
      id: template.id + '-' + Date.now(),
      title: template.title,
      examType: template.examType,
      totalItems: template.totalItems,
      timeLimitMinutes: template.timeLimitMinutes,
      sections
    };
  };

  const handleStart = (template: MockExamTemplate) => {
    const generatedExam = generateExamFromTemplate(template);
    setSelectedExam(generatedExam);
    setIsStarted(true);
    setIsFinished(false);
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleFinishExam = () => {
    const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
    setTimeElapsed(elapsed);
    setIsFinished(true);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentIndex < allQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 400);
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
    return (
      <ExamResultsView 
        exam={selectedExam} 
        answers={answers} 
        timeElapsed={timeElapsed}
        onComplete={onCompleteExam} 
        onRetry={() => setIsStarted(false)} 
      />
    );
  }

  if (isStarted && selectedExam && allQuestions.length > 0) {
    const currentQ = allQuestions[currentIndex];
    const isLast = currentIndex === allQuestions.length - 1;
    const isFirst = currentIndex === 0;
    const progressPercentage = ((currentIndex + 1) / allQuestions.length) * 100;

    return (
      <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-slate-900/60 relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800 z-50">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="bg-slate-950/80 p-4 pt-5 border-b border-white/5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">{selectedExam.title}</h2>
            <div className="text-sm text-slate-400 font-medium">Question {currentIndex + 1} of {allQuestions.length}</div>
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

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col">
            <div className="max-w-3xl mx-auto w-full flex-1">
              <div className="mb-8">
                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase tracking-widest mb-3">
                  {currentQ.section.subject}
                </h3>
                {currentQ.section.instructions && (
                  <div className="bg-slate-800/60 border border-slate-700/50 text-slate-300 p-4 rounded-xl text-sm flex gap-3 shadow-inner">
                    <AlertCircle className="w-5 h-5 shrink-0 text-cyan-400" />
                    <p className="font-medium">{currentQ.section.instructions}</p>
                  </div>
                )}
              </div>

              {currentQ.question.passage && (
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl mb-6 text-slate-300 prose prose-invert max-w-none">
                  {currentQ.question.passage.split('\n').map((p, i) => (
                    <p key={i} className="mb-2">{p}</p>
                  ))}
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-indigo-500/20 text-indigo-400 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/30">
                    {currentIndex + 1}
                  </div>
                  <h3 className="text-xl text-white font-medium pt-1 leading-relaxed">
                    {highlightQuestionText(currentQ.question.text, currentQ.question.subject)}
                  </h3>
                </div>

                {currentQ.question.pdfUrl && (
                  <div className="w-full h-[500px] mb-8 border border-white/10 rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                    <iframe 
                      src={currentQ.question.pdfUrl} 
                      className="w-full h-full bg-white"
                      title={`Reference for Question ${currentIndex + 1}`}
                    />
                  </div>
                )}

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
                            ? 'bg-indigo-600/30 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)] transform scale-[1.01]' 
                            : 'bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {optionLetter}
                        </div>
                        <span className={`text-base font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {highlightQuestionText(opt, currentQ.question.subject)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto w-full flex justify-between items-center pt-6 border-t border-white/5 mt-auto">
              <button 
                onClick={() => setCurrentIndex(prev => prev - 1)}
                disabled={isFirst}
                className="px-5 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              {!isLast ? (
                <button 
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-2 shadow-lg"
                >
                  Skip <ChevronRight className="w-4 h-4" />
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

  return (
    <div className="h-full flex flex-col items-center justify-start py-8">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Play className="w-8 h-8 ml-1" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-4">Mock Exam Simulator</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Test your readiness under simulated exam conditions. Select an exam below to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {MOCK_EXAM_TEMPLATES.map(template => {
            // Determine theme based on title keywords
            const t = template.title.toLowerCase();
            let theme = {
              color: 'from-indigo-500 to-cyan-400',
              bg: 'bg-indigo-500/10 text-indigo-400',
              border: 'group-hover:border-indigo-500/50',
              shadow: 'group-hover:shadow-indigo-500/20',
              icon: <BookOpen className="w-6 h-6" />
            };

            if (t.includes('numerical')) {
              theme = {
                color: 'from-fuchsia-500 to-purple-500',
                bg: 'bg-fuchsia-500/10 text-fuchsia-400',
                border: 'group-hover:border-fuchsia-500/50',
                shadow: 'group-hover:shadow-fuchsia-500/20',
                icon: <Calculator className="w-6 h-6" />
              };
            } else if (t.includes('logic')) {
              theme = {
                color: 'from-amber-500 to-orange-400',
                bg: 'bg-amber-500/10 text-amber-400',
                border: 'group-hover:border-amber-500/50',
                shadow: 'group-hover:shadow-amber-500/20',
                icon: <BrainCircuit className="w-6 h-6" />
              };
            } else if (t.includes('general')) {
              theme = {
                color: 'from-emerald-500 to-teal-400',
                bg: 'bg-emerald-500/10 text-emerald-400',
                border: 'group-hover:border-emerald-500/50',
                shadow: 'group-hover:shadow-emerald-500/20',
                icon: <Globe2 className="w-6 h-6" />
              };
            } else if (t.includes('filipino')) {
              theme = {
                color: 'from-rose-500 to-pink-500',
                bg: 'bg-rose-500/10 text-rose-400',
                border: 'group-hover:border-rose-500/50',
                shadow: 'group-hover:shadow-rose-500/20',
                icon: <MessageSquare className="w-6 h-6" />
              };
            } else if (t.includes('patterns')) {
              theme = {
                color: 'from-blue-500 to-indigo-400',
                bg: 'bg-blue-500/10 text-blue-400',
                border: 'group-hover:border-blue-500/50',
                shadow: 'group-hover:shadow-blue-500/20',
                icon: <Shapes className="w-6 h-6" />
              };
            } else if (t.includes('final')) {
              theme = {
                color: 'from-yellow-400 to-amber-600',
                bg: 'bg-yellow-500/10 text-yellow-400',
                border: 'group-hover:border-yellow-500/50',
                shadow: 'group-hover:shadow-yellow-500/30',
                icon: <Award className="w-6 h-6" />
              };
            }

            return (
              <div 
                key={template.id} 
                className={`group glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${theme.border} ${theme.shadow} flex flex-col h-full relative overflow-hidden`}
              >
                {/* Gradient Top Border */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                
                {/* Background glow on hover */}
                <div className={`absolute -inset-24 bg-gradient-to-br ${theme.color} opacity-0 group-hover:opacity-[0.03] blur-2xl transition-opacity duration-500 pointer-events-none`}></div>

                <div className="flex justify-between items-start mb-5 relative z-10 pt-1">
                  <div className={`p-3 rounded-xl ${theme.bg} shadow-inner`}>
                    {theme.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-bold tracking-wider uppercase border border-white/5 shadow-sm">
                    {template.examType}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-6 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all relative z-10">
                  {template.title}
                </h2>
                
                <div className="space-y-4 mb-8 mt-auto relative z-10">
                  <div className="flex items-center gap-3 text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.02]">
                    <div className="w-7 h-7 rounded-md bg-slate-800/50 flex items-center justify-center shrink-0 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="font-medium text-sm">{template.totalItems} Items Total</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.02]">
                    <div className="w-7 h-7 rounded-md bg-slate-800/50 flex items-center justify-center shrink-0 border border-white/5">
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="font-medium text-sm">{Math.floor(template.timeLimitMinutes / 60) > 0 ? `${Math.floor(template.timeLimitMinutes / 60)}h ` : ''}{template.timeLimitMinutes % 60}m Time Limit</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleStart(template)}
                  className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${theme.color} text-white font-bold transition-all shadow-lg hover:shadow-xl opacity-90 group-hover:opacity-100 flex items-center justify-center gap-2 relative z-10 transform active:scale-[0.98]`}
                >
                  <Play className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" /> 
                  <span className="tracking-wide">Start Exam</span>
                </button>
              </div>
            );
          })}
          {MOCK_EXAM_TEMPLATES.length === 0 && (
             <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-12 text-slate-500 border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
               No mock exams available yet.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
