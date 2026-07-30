import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { SubjectStats, ExamType } from '../types';
import { PASSING_THRESHOLD } from '../utils/analytics';
import { Activity } from 'lucide-react';

interface ProgressionChartProps {
  stats: SubjectStats[];
  exam: ExamType;
}

export function ProgressionChart({ stats, exam }: ProgressionChartProps) {
  const maxAttempts = Math.max(0, ...stats.map(s => s.history.length));

  if (maxAttempts === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-[400px] flex items-center justify-center">
        <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" />
          Awaiting {exam} Progression Data...
        </p>
      </div>
    );
  }

  const chartData = Array.from({ length: maxAttempts }).map((_, index) => {
    const dataPoint: any = { attempt: `Attempt ${index + 1}` };
    
    stats.forEach(stat => {
      if (index < stat.history.length) {
        dataPoint[stat.subject] = stat.history[index].percentage;
      } else if (stat.history.length > 0) {
         dataPoint[stat.subject] = stat.history[stat.history.length - 1].percentage;
      }
    });
    return dataPoint;
  });

  const colors = [
    '#0ea5e9', // cyan-500
    '#8b5cf6', // violet-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ec4899', // pink-500
    '#6366f1', // indigo-500
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-slate-300 font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-slate-200 text-sm">
                {entry.name}: <span className="font-mono font-bold">{entry.value}%</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col h-full min-h-[450px]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{exam} Progression Tracking</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time performance growth across {exam} subjects</p>
        </div>
      </div>
      
      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="attempt" 
              stroke="#94a3b8" 
              fontSize={12}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              dy={15}
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
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: '#cbd5e1' }}
            />
            <ReferenceLine 
              y={PASSING_THRESHOLD} 
              stroke="#f43f5e" 
              strokeDasharray="4 4" 
              label={{ position: 'right', value: 'TARGET 80%', fill: '#f43f5e', fontSize: 11, fontWeight: 'bold' }} 
            />
            
            {stats.map((stat, index) => (
              <Line 
                key={stat.subject}
                type="monotone" 
                dataKey={stat.subject} 
                stroke={colors[index % colors.length]} 
                strokeWidth={3}
                dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: colors[index % colors.length] }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
