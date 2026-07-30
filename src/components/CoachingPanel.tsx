import React from 'react';
import { Bot, CheckCircle2, AlertCircle, TrendingUp, Target, Activity, Zap } from 'lucide-react';
import { cn } from './StatCard';

interface CoachingPanelProps {
  plan: string[];
}

export function CoachingPanel({ plan }: CoachingPanelProps) {
  
  // Group the insights into categories based on their prefixes
  const categorizedPlan = plan.reduce((acc, line) => {
    let type = 'neutral';
    if (line.match(/^(DIAGNOSTIC ALERT|DEFICIT ANALYSIS|ERROR YIELD)/)) {
      type = 'warning';
    } else if (line.match(/^(ALL SYSTEMS OPTIMAL|MAINTENANCE PROTOCOL)/)) {
      type = 'success';
    } else if (line.match(/^(PRIORITY OVERRIDE)/)) {
      type = 'critical';
    } else if (line.match(/^(STRATEGIC DIRECTIVE|FAST-TRACK TECHNIQUE)/)) {
      type = 'info';
    }

    const cleanLine = line.replace(/^(DIAGNOSTIC ALERT|DEFICIT ANALYSIS|ERROR YIELD|ALL SYSTEMS OPTIMAL|MAINTENANCE PROTOCOL|PRIORITY OVERRIDE|STRATEGIC DIRECTIVE|FAST-TRACK TECHNIQUE|SYSTEM STANDBY|ACTION REQUIRED):\s*/, '');
    const item = { text: cleanLine, type };

    if (line.match(/^(PRIORITY OVERRIDE|STRATEGIC DIRECTIVE|FAST-TRACK TECHNIQUE|ACTION REQUIRED)/)) {
      acc.actions.push(item);
    } else {
      acc.diagnostics.push(item);
    }
    
    return acc;
  }, { diagnostics: [] as {text: string, type: string}[], actions: [] as {text: string, type: string}[] });

  const icons = {
    warning: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    critical: <Target className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    info: <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
    neutral: <Bot className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
  };

  const bgs = {
    warning: 'bg-rose-500/5 border-rose-500/10',
    success: 'bg-emerald-500/5 border-emerald-500/10',
    critical: 'bg-amber-500/10 border-amber-500/20',
    info: 'bg-cyan-500/5 border-cyan-500/10',
    neutral: 'bg-slate-500/5 border-slate-500/10'
  };

  return (
    <div className="glass-panel p-8 rounded-2xl h-full flex flex-col relative overflow-hidden group">
      
      <div className="relative flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <Bot className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">CSE & AFPSAT Learning Coach</h2>
          <p className="text-sm text-slate-400">Personalized strategic directives based on your performance data.</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10 flex-1">
        
        {/* Performance Diagnostics Category */}
        {categorizedPlan.diagnostics.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-slate-500" /> Performance Diagnostics
            </h3>
            {categorizedPlan.diagnostics.map((item, i) => (
              <div 
                key={`diag-${i}`} 
                className={cn("flex gap-4 p-4 rounded-xl border", bgs[item.type as keyof typeof bgs])}
              >
                {icons[item.type as keyof typeof icons]}
                <p className="text-slate-200 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Strategic Action Plan Category */}
        {categorizedPlan.actions.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-500" /> Strategic Action Plan
            </h3>
            {categorizedPlan.actions.map((item, i) => (
              <div 
                key={`action-${i}`} 
                className={cn("flex gap-4 p-4 rounded-xl border", bgs[item.type as keyof typeof bgs])}
              >
                {icons[item.type as keyof typeof icons]}
                <p className="text-slate-200 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
