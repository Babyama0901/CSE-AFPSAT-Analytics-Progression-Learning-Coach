import React from 'react';
import { StatCard } from './StatCard';
import { OverallProgressionChart } from './OverallProgressionChart';
import { RecentActivityFeed } from './RecentActivityFeed';
import { ScoreLog, AnalyticsData, SubjectStats } from '../types';

interface DashboardViewProps {
  logs: ScoreLog[];
  cseAnalytics: AnalyticsData;
  afpsatAnalytics: AnalyticsData;
  historicalReadinessData: any[];
}

export function DashboardView({ logs, cseAnalytics, afpsatAnalytics, historicalReadinessData }: DashboardViewProps) {
  
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

      {/* Main Charts & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex-1">
            <OverallProgressionChart data={historicalReadinessData} />
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <RecentActivityFeed logs={logs} />
        </div>
      </div>
    </div>
  );
}
