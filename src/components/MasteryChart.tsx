import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { SubjectStats } from '../types';
import { PASSING_THRESHOLD } from '../utils/analytics';
import { Activity } from 'lucide-react';

interface MasteryChartProps {
  stats: SubjectStats[];
}

const SHORT_NAMES: Record<string, string> = {
  'Reading Comprehension': 'Reading',
  'Vocabulary': 'Vocab',
  'Grammar and Language Usage': 'Grammar',
  'Logical Verbal Reasoning': 'Log Verbal',
  'Basic Arithmetic': 'Arithmetic',
  'Word Problems': 'Word Probs',
  'Algebra Basics': 'Algebra',
  'Geometry Basics': 'Geometry',
  'Logical Relationships': 'Log Rel',
  'Series Completion': 'Series',
  'Pattern Recognition 1': 'Pattern 1',
  'Pattern Recognition 2': 'Pattern 2',
  'Pattern Recognition 3': 'Pattern 3',
  'Analytic Ability': 'Analytic',
  'Spelling': 'Spelling',
  'Idiomatic Expressions': 'Idioms',
  'Identifying Errors (English Grammar)': 'Eng Errors',
  'Talasitaan': 'Talasitaan',
  'Kawikaang Filipino': 'Kawikaan',
  'Pagkilala sa Mali': 'Mali',
  'Logic': 'Logic',
  'Seeing Patterns, Diagrams, Figures': 'Patterns',
  'General Information': 'Gen Info',
  'Numerical Ability': 'Numerical'
};

export function MasteryChart({ stats }: MasteryChartProps) {
  // Sort by latest percentage descending for better visualization
  const data = [...stats].sort((a, b) => b.latestPercentage - a.latestPercentage).map(s => ({
    name: SHORT_NAMES[s.subject] || s.subject.replace(' Reasoning', '').replace(' Information', ''),
    subject: s.subject,
    score: Number(s.latestPercentage.toFixed(1))
  }));

  if (data.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-[400px] flex items-center justify-center">
        <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" />
          Awaiting System Calibration...
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const isPassing = payload[0].value >= PASSING_THRESHOLD;
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-slate-200 font-bold mb-1">{payload[0].payload.subject}</p>
          <p className={`font-mono font-bold ${isPassing ? 'text-emerald-400' : 'text-rose-400'}`}>
            Mastery: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col h-full min-h-[450px]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Mastery Overview</h2>
          <p className="text-slate-400 text-sm mt-1">Current trajectory across cognitive domains</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold uppercase text-slate-400">
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span> Deficit</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> Optimal</div>
        </div>
      </div>
      
      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={10}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              dy={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <ReferenceLine 
              y={PASSING_THRESHOLD} 
              stroke="#0ea5e9" 
              strokeDasharray="4 4" 
              label={{ position: 'right', value: 'TARGET 80%', fill: '#0ea5e9', fontSize: 11, fontWeight: 'bold' }} 
            />
            
            <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={60} isAnimationActive={false}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.score >= PASSING_THRESHOLD ? 'url(#colorEmerald)' : 'url(#colorRose)'} 
                />
              ))}
            </Bar>
            
            <defs>
              <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorRose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
