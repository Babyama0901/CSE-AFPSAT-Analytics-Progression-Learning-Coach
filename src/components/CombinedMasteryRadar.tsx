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
import { AnalyticsData, CSE_SUBJECTS, AFPSAT_SUBJECTS, Subject } from '../types';
import { Activity } from 'lucide-react';

interface CombinedMasteryRadarProps {
  cseAnalytics: AnalyticsData;
  afpsatAnalytics: AnalyticsData;
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
  'Logic': 'Logic'
};

export function CombinedMasteryRadar({ cseAnalytics, afpsatAnalytics }: CombinedMasteryRadarProps) {
  
  const processData = (stats: any[], allSubjects: Subject[]) => {
    return allSubjects.map(subject => {
      const existingStat = stats.find(s => s.subject === subject);
      return {
        subject: SHORT_NAMES[subject] || subject.replace(' Reasoning', '').replace(' Information', ''),
        fullSubject: subject,
        score: existingStat ? Number(existingStat.latestPercentage.toFixed(1)) : 0
      };
    });
  };

  const cseData = processData(cseAnalytics.subjectStats, CSE_SUBJECTS);
  const afpsatData = processData(afpsatAnalytics.subjectStats, AFPSAT_SUBJECTS);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPassing = data.score >= 80;
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-slate-300 font-bold mb-1">{data.fullSubject}</p>
          <p className={`font-mono font-bold ${isPassing ? 'text-emerald-400' : 'text-rose-400'}`}>
            Mastery: {data.score}%
          </p>
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
            <Activity className="w-5 h-5 text-indigo-400" /> Mastery Overview
          </h2>
          <p className="text-slate-400 text-sm mt-1">Cognitive domain mapping across both exams</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-2 flex-1">
        
        {/* CSE Radar */}
        <div className="flex flex-col items-center justify-center h-[350px]">
          <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-widest mb-2">CSE Profile</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={cseData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }} 
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar 
                name="CSE Mastery" 
                dataKey="score" 
                stroke="#0ea5e9" 
                fill="#0ea5e9" 
                fillOpacity={0.4} 
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* AFPSAT Radar */}
        <div className="flex flex-col items-center justify-center h-[350px]">
          <h3 className="text-fuchsia-400 font-bold text-sm uppercase tracking-widest mb-2">AFPSAT Profile</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={afpsatData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 600 }} 
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar 
                name="AFPSAT Mastery" 
                dataKey="score" 
                stroke="#d946ef" 
                fill="#d946ef" 
                fillOpacity={0.4} 
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
