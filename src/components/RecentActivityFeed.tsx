import React from 'react';
import { Clock, Activity } from 'lucide-react';
import { ScoreLog } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityFeedProps {
  logs: ScoreLog[];
}

export function RecentActivityFeed({ logs }: RecentActivityFeedProps) {
  const recentLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  return (
    <div className="glass-panel p-8 rounded-2xl h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Clock className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
      </div>

      {recentLogs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4" /> No logs recorded yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentLogs.map((log) => {
            const percentage = (log.score / log.total) * 100;
            const isPassing = percentage >= 80;
            
            return (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${isPassing ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <p className="text-slate-200 font-bold text-sm">{log.subject}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{log.exam || 'CSE'} • {formatDistanceToNow(log.timestamp, { addSuffix: true })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono font-bold">{percentage.toFixed(1)}%</p>
                  <p className="text-slate-400 text-xs mt-0.5">{log.score} / {log.total}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
