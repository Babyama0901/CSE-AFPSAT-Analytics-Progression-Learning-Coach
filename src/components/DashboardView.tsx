import React from 'react';
import { StatCard } from './StatCard';
import { ComprehensiveTimeline } from './ComprehensiveTimeline';
import { DashboardMasteryRadar } from './DashboardMasteryRadar';
import { ScoreLog, AnalyticsData, SubjectStats } from '../types';

interface DashboardViewProps {
  logs: ScoreLog[];
  cseAnalytics: AnalyticsData;
  afpsatAnalytics: AnalyticsData;
}

export function DashboardView({ logs, cseAnalytics, afpsatAnalytics }: DashboardViewProps) {
  
  // Calculate combined readiness
  let combinedReadiness = 0;
  let activeExams = 0;
  if (cseAnalytics.readinessScore > 0) {
    combinedReadiness += cseAnalytics.readinessScore;
    activeExams++;
  }
  if (afpsatAnalytics.readinessScore > 0) {
    combinedReadiness += afpsatAnalytics.readinessScore;
    activeExams++;
  }
  const avgReadiness = activeExams > 0 ? combinedReadiness / activeExams : 0;

  // Find overall weakest and strongest across both exams
  const allWeak = [cseAnalytics.weakestSubject, afpsatAnalytics.weakestSubject].filter(Boolean) as SubjectStats[];
  const overallWeakest = allWeak.length > 0 
    ? allWeak.reduce((min, cur) => cur.latestPercentage < min.latestPercentage ? cur : min)
    : null;

  const allStrong = [cseAnalytics.strongestSubject, afpsatAnalytics.strongestSubject].filter(Boolean) as SubjectStats[];
  const overallStrongest = allStrong.length > 0
    ? allStrong.reduce((max, cur) => cur.latestPercentage > max.latestPercentage ? cur : max)
    : null;

  return (
    <div className="space-y-8">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Overall Readiness"
          value={`${avgReadiness.toFixed(1)}%`}
          subtitle="Combined Average"
          status={avgReadiness >= 80 ? 'optimal' : (avgReadiness > 0 ? 'warning' : 'neutral')}
          icon="readiness"
        />
        <StatCard 
          title="Critical Deficit" 
          value={overallWeakest ? overallWeakest.subject.replace(' Reasoning', '').replace(' Information', '') : 'N/A'}
          subtitle={overallWeakest ? `Mastery: ${overallWeakest.latestPercentage.toFixed(1)}%` : 'Awaiting Data'}
          status={overallWeakest ? 'critical' : 'neutral'}
          icon="deficit"
        />
        <StatCard 
          title="Strongest Domain" 
          value={overallStrongest ? overallStrongest.subject.replace(' Reasoning', '').replace(' Information', '') : 'N/A'}
          subtitle={overallStrongest ? `Mastery: ${overallStrongest.latestPercentage.toFixed(1)}%` : 'Awaiting Data'}
          status={overallStrongest ? 'optimal' : 'neutral'}
          icon="readiness"
        />
        <StatCard 
          title="Engine Inputs" 
          value={logs.length}
          subtitle="Total Logs Analyzed"
          icon="inputs"
        />
      </div>

      {/* Radar Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <DashboardMasteryRadar 
          title="CSE Mastery Overview" 
          stats={cseAnalytics.subjectStats} 
          strokeColor="#0ea5e9" // cyan-500
          fillColor="#0ea5e9" 
        />
        <DashboardMasteryRadar 
          title="AFPSAT Mastery Overview" 
          stats={afpsatAnalytics.subjectStats} 
          strokeColor="#d946ef" // fuchsia-500
          fillColor="#d946ef" 
        />
      </div>

      {/* Main Timeline */}
      <div className="w-full">
        <ComprehensiveTimeline logs={logs} />
      </div>
    </div>
  );
}
