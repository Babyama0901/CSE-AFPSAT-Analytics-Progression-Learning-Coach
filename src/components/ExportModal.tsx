import React from 'react';
import { Download, X, FileText, Activity } from 'lucide-react';
import { AnalyticsData, ScoreLog } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  cseAnalytics: AnalyticsData;
  afpsatAnalytics: AnalyticsData;
  logs: ScoreLog[];
}

export function ExportModal({ isOpen, onClose, onExport, cseAnalytics, afpsatAnalytics, logs }: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-slate-950/90"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Export Analytics Report</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <p className="text-slate-300 text-sm leading-relaxed">
              You are about to generate a comprehensive, AI-friendly PDF report of your performance. This report is structured specifically to be easily parsed by AI models (like ChatGPT or Gemini) for advanced coaching.
            </p>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4" /> Report Payload Summary
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <span className="block text-xs text-slate-400 font-semibold mb-1">Total Logs</span>
                  <span className="text-2xl font-bold text-white">{logs.length}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <span className="block text-xs text-slate-400 font-semibold mb-1">Target Threshold</span>
                  <span className="text-2xl font-bold text-emerald-400">80.0%</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <span className="block text-xs text-slate-400 font-semibold mb-1">CSE Readiness</span>
                  <span className="text-2xl font-bold text-cyan-400">{cseAnalytics.readinessScore.toFixed(1)}%</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <span className="block text-xs text-slate-400 font-semibold mb-1">AFPSAT Readiness</span>
                  <span className="text-2xl font-bold text-purple-400">{afpsatAnalytics.readinessScore.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-slate-300 bg-slate-800 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onExport();
                onClose();
              }}
              className="flex-[2] py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PDF Report
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
