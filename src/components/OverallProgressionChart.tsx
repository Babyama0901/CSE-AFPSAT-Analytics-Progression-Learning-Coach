import React from 'react';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity } from 'lucide-react';

interface OverallProgressionChartProps {
  data: { attempt: string; CSE: number | null; AFPSAT: number | null }[];
}

export function OverallProgressionChart({ data }: OverallProgressionChartProps) {
  if (data.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-[300px] flex items-center justify-center">
        <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" />
          Awaiting Data...
        </p>
      </div>
    );
  }

  // To make the radar chart look like a polygon when there's only 1 or 2 logs,
  // it's best to pad it to at least 3 points. But Recharts handles it by drawing a line/dot.
  // We keep the original data directly since Radar charts intrinsically handle the shape.
  const chartData = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl min-w-[200px]">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b border-white/10">{data.attempt || label}</p>
          
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <p className="text-slate-200 text-sm font-medium">CSE Readiness</p>
            </div>
            <span className={`font-mono font-bold text-sm ${data.CSE ? 'text-white' : 'text-slate-500'}`}>
              {data.CSE ? `${data.CSE}%` : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
              <p className="text-slate-200 text-sm font-medium">AFPSAT Readiness</p>
            </div>
            <span className={`font-mono font-bold text-sm ${data.AFPSAT ? 'text-white' : 'text-slate-500'}`}>
              {data.AFPSAT ? `${data.AFPSAT}%` : 'N/A'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Overall Readiness Progression
          </h2>
          <p className="text-slate-400 text-sm mt-1">Macro-level historical performance across both exams</p>
        </div>
      </div>
      
      {/* Fixed height ensures ResponsiveContainer doesn't collapse to 0 in flex layouts */}
      <div className="w-full mt-2 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis 
              dataKey="attempt" 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#cbd5e1' }}
            />
            
            <Radar 
              name="CSE Readiness" 
              dataKey="CSE" 
              stroke="#0ea5e9" 
              fill="#0ea5e9" 
              fillOpacity={0.3} 
              isAnimationActive={false}
            />
            <Radar 
              name="AFPSAT Readiness" 
              dataKey="AFPSAT" 
              stroke="#d946ef" 
              fill="#d946ef" 
              fillOpacity={0.3} 
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
