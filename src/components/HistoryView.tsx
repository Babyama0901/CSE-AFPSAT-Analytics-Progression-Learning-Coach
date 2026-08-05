import React, { useState } from 'react';
import { ScoreLog } from '../types';
import { format } from 'date-fns';
import { Edit2, Trash2, Check, X, Database } from 'lucide-react';

interface HistoryViewProps {
  logs: ScoreLog[];
  onUpdateLog: (log: ScoreLog) => void;
  onDeleteLog: (id: string) => void;
}

export function HistoryView({ logs, onUpdateLog, onDeleteLog }: HistoryViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number | ''>('');
  const [editTotal, setEditTotal] = useState<number | ''>('');
  const [editMissed, setEditMissed] = useState<string>('');

  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  const startEdit = (log: ScoreLog) => {
    setEditingId(log.id);
    setEditScore(log.score);
    setEditTotal(log.total);
    setEditMissed(log.subtopicsMissed || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditScore('');
    setEditTotal('');
    setEditMissed('');
  };

  const saveEdit = (log: ScoreLog) => {
    if (editScore === '' || editTotal === '') return;
    
    onUpdateLog({
      ...log,
      score: Number(editScore),
      total: Number(editTotal),
      subtopicsMissed: editMissed.trim() || undefined
    });
    setEditingId(null);
  };

  if (logs.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
        <Database className="w-12 h-12 text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No History Available</h2>
        <p className="text-slate-400">Inject diagnostic data first to see your chronological history.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-slate-900/50">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" /> Data Log History
        </h2>
        <p className="text-slate-400 text-sm mt-1">Review, modify, or delete your past diagnostic inputs.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-white/10 text-xs uppercase tracking-widest text-slate-400 font-bold">
              <th className="px-6 py-4">Date / Time</th>
              <th className="px-6 py-4">Exam / Subject</th>
              <th className="px-6 py-4 text-right">Score</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-right">Percentage</th>
              <th className="px-6 py-4">Missed Topics</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedLogs.map(log => {
              const isEditing = editingId === log.id;
              const percentage = (log.score / log.total) * 100;
              const isPassing = percentage >= 80;

              return (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {format(log.timestamp, 'MMM d, yyyy')}
                    <div className="text-xs text-slate-500 mt-1">{format(log.timestamp, 'h:mm a')}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                        log.exam === 'AFPSAT' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {log.exam || 'CSE'}
                      </span>
                      {log.isMockExam && (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                          Practice Exam
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-slate-200">
                      {log.subject}
                    </div>
                    {log.isMockExam && log.mockExamTitle && (
                      <div className="text-xs text-slate-500 mt-0.5">from {log.mockExamTitle}</div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <input 
                        type="number" 
                        value={editScore}
                        onChange={(e) => setEditScore(e.target.value ? Number(e.target.value) : '')}
                        className="w-16 bg-slate-950 border border-white/20 rounded px-2 py-1 text-right text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    ) : (
                      <span className="font-mono text-slate-300 text-sm">{log.score}</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <input 
                        type="number" 
                        value={editTotal}
                        onChange={(e) => setEditTotal(e.target.value ? Number(e.target.value) : '')}
                        className="w-16 bg-slate-950 border border-white/20 rounded px-2 py-1 text-right text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    ) : (
                      <span className="font-mono text-slate-400 text-sm">{log.total}</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {!isEditing && (
                      <span className={`font-mono font-bold text-sm ${isPassing ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editMissed}
                        onChange={(e) => setEditMissed(e.target.value)}
                        className="w-full min-w-[150px] bg-slate-950 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-cyan-500"
                        placeholder="N/A"
                      />
                    ) : (
                      <span className="text-sm text-slate-400 truncate max-w-[200px] block">
                        {log.subtopicsMissed || '-'}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {isEditing ? (
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => saveEdit(log)} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors" title="Save">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEdit} className="p-1.5 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 transition-colors" title="Cancel">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => startEdit(log)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this log?')) {
                              onDeleteLog(log.id);
                            }
                          }}
                          className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
