import React from 'react';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Activity } from 'lucide-react';
import { SubjectStats } from '../types';

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
  'Philippine Constitution': 'Ph Const',
  'Numerical Ability': 'Numerical',
  'Verbal Reasoning': 'Verbal',
  'General Information': 'Gen Info',
  'R.A. 6713': 'RA 6713'
};

interface DashboardMasteryRadarProps {
  title: string;
  stats: SubjectStats[];
  strokeColor: string;
  fillColor: string;
}

export function DashboardMasteryRadar({ title, stats, strokeColor, fillColor }: DashboardMasteryRadarProps) {
  const chartData = stats.map(s => ({
    subject: SHORT_NAMES[s.subject] || s.subject.replace(' Reasoning', '').replace(' Information', ''),
    fullSubject: s.subject,
    score: Number(s.latestPercentage.toFixed(1))
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-slate-200 font-bold mb-1">{data.fullSubject}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor, boxShadow: `0 0 8px ${strokeColor}` }} />
            <p className="text-slate-300 text-sm font-medium">
              Mastery: <span className="font-mono font-bold text-white ml-1">{data.score}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const hasData = stats.some(s => s.latestPercentage > 0);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-[350px]">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-400" /> {title}
        </h2>
      </div>
      
      <div className="flex-1 w-full relative">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#94a3b8', fontSize: 9 }}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar 
                name="Mastery" 
                dataKey="score" 
                stroke={strokeColor} 
                fill={fillColor} 
                fillOpacity={0.3} 
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" /> Awaiting Data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
