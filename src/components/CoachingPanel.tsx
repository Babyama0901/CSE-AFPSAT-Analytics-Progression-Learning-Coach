import React from 'react';
import { Bot, CheckCircle2, AlertCircle, TrendingUp, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './StatCard';

interface CoachingPanelProps {
  plan: string[];
}

export function CoachingPanel({ plan }: CoachingPanelProps) {
  return (
    <div className="glass-panel p-8 rounded-2xl h-full flex flex-col relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <Bot className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Coaching Assistant</h2>
          <p className="text-sm text-slate-400">Personalized strategic directives based on your performance data.</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10 flex-1">
        {plan.map((line, i) => {
          let type = 'neutral';
          if (line.startsWith("DIAGNOSTIC ALERT") || line.startsWith("DEFICIT ANALYSIS") || line.startsWith("ERROR YIELD")) {
            type = 'warning';
          } else if (line.startsWith("ALL SYSTEMS OPTIMAL") || line.startsWith("MAINTENANCE PROTOCOL")) {
            type = 'success';
          } else if (line.startsWith("PRIORITY OVERRIDE")) {
            type = 'critical';
          } else if (line.startsWith("STRATEGIC DIRECTIVE") || line.startsWith("FAST-TRACK TECHNIQUE")) {
            type = 'info';
          }

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

          // Remove the prefix from the text for a cleaner look
          let cleanLine = line.replace(/^(DIAGNOSTIC ALERT|DEFICIT ANALYSIS|ERROR YIELD|ALL SYSTEMS OPTIMAL|MAINTENANCE PROTOCOL|PRIORITY OVERRIDE|STRATEGIC DIRECTIVE|FAST-TRACK TECHNIQUE|SYSTEM STANDBY|ACTION REQUIRED):\s*/, '');
          
          return (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              key={i} 
              className={cn("flex gap-4 p-4 rounded-xl border", bgs[type as keyof typeof bgs])}
            >
              {icons[type as keyof typeof icons]}
              <p className="text-slate-200 text-sm leading-relaxed">{cleanLine}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
