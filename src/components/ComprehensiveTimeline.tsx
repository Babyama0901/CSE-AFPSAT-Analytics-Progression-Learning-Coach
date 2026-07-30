import React from 'react';
import { ScoreLog } from '../types';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';

interface ComprehensiveTimelineProps {
  logs: ScoreLog[];
}

export function ComprehensiveTimeline({ logs }: ComprehensiveTimelineProps) {
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col h-[600px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Comprehensive Testing Timeline</h2>
          <p className="text-slate-400 text-sm mt-1">Complete chronological record of all cognitive assessments</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {sortedLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 font-semibold text-sm uppercase tracking-widest">
            No diagnostic data available
          </div>
        ) : (
          <div className="relative border-l border-white/10 ml-4 space-y-8 pb-4">
            {sortedLogs.map((log) => {
              const percentage = (log.score / log.total) * 100;
              const isPassing = percentage >= 80;
              
              return (
                <div key={log.id} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-2 top-1 w-4 h-4 rounded-full border-4 border-slate-950 ${isPassing ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  
                  {/* Content Card */}
                  <div className="bg-slate-900/50 border border-white/5 p-5 rounded-xl hover:bg-slate-800/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                            log.exam === 'AFPSAT' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            {log.exam || 'CSE'}
                          </span>
                          <span className="text-slate-400 text-xs font-medium">
                            {format(log.timestamp, 'MMM d, yyyy • h:mm a')}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-lg">{log.subject}</h3>
                      </div>
                      
                      <div className="flex flex-col md:items-end">
                        <div className="flex items-center gap-2 mb-1">
                          {isPassing ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span className={`font-mono text-xl font-bold ${isPassing ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <span className="text-slate-400 text-sm font-medium tracking-wide">
                          Score: {log.score} / {log.total}
                        </span>
                      </div>
                      
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
