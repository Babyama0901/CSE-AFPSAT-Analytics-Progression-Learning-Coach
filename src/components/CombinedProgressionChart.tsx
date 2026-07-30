import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { PASSING_THRESHOLD } from '../utils/analytics';
import { Activity } from 'lucide-react';

interface CombinedProgressionChartProps {
  data: { attempt: string; CSE: number | null; AFPSAT: number | null }[];
}

export function CombinedProgressionChart({ data }: CombinedProgressionChartProps) {
  if (data.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-[400px] flex items-center justify-center">
        <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" />
          Awaiting Data...
        </p>
      </div>
    );
  }

  const chartData = data.length === 1 
    ? [
        { ...data[0], attempt: 'Start' }, 
        data[0]
      ] 
    : data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl min-w-[200px]">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b border-white/10">{pointData.attempt || label}</p>
          
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <p className="text-slate-200 text-sm font-medium">CSE Readiness</p>
            </div>
            <span className={`font-mono font-bold text-sm ${pointData.CSE ? 'text-white' : 'text-slate-500'}`}>
              {pointData.CSE ? `${pointData.CSE}%` : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
              <p className="text-slate-200 text-sm font-medium">AFPSAT Readiness</p>
            </div>
            <span className={`font-mono font-bold text-sm ${pointData.AFPSAT ? 'text-white' : 'text-slate-500'}`}>
              {pointData.AFPSAT ? `${pointData.AFPSAT}%` : 'N/A'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col h-full min-h-[450px]">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Progression Tracking
          </h2>
          <p className="text-slate-400 text-sm mt-1">Macro-level historical performance across both exams</p>
        </div>
      </div>
      
      <div className="w-full mt-2 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCSE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAFPSAT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            
            <Area 
              type="monotone" 
              dataKey="CSE" 
              name="CSE Readiness"
              stroke="#0ea5e9" 
              fillOpacity={1} 
              fill="url(#colorCSE)" 
              strokeWidth={3}
              connectNulls
              activeDot={{ r: 6, fill: '#0ea5e9' }}
              isAnimationActive={false}
            />
            <Area 
              type="monotone" 
              dataKey="AFPSAT" 
              name="AFPSAT Readiness"
              stroke="#d946ef" 
              fillOpacity={1} 
              fill="url(#colorAFPSAT)" 
              strokeWidth={3}
              connectNulls
              activeDot={{ r: 6, fill: '#d946ef' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
