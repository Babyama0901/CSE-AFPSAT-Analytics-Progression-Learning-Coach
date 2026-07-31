import { ScoreLog, SubjectStats, AnalyticsData, SUBJECTS, Subject } from '../types';

export const PASSING_THRESHOLD = 80;

export function calculateAnalytics(logs: ScoreLog[], allowedSubjects: Subject[] = SUBJECTS): AnalyticsData {
  if (logs.length === 0) {
    return {
      overallAverage: 0,
      readinessScore: 0,
      subjectStats: [],
      weakestSubject: null,
      strongestSubject: null,
    };
  }

  const statsMap = new Map<string, ScoreLog[]>();
  allowedSubjects.forEach(s => statsMap.set(s, []));

  logs.forEach(log => {
    // Only map if the subject is part of this exam's allowed subjects
    if (statsMap.has(log.subject)) {
      statsMap.get(log.subject)?.push(log);
    }
  });

  const subjectStats: SubjectStats[] = [];

  statsMap.forEach((subjectLogs, subjectStr) => {
    if (subjectLogs.length === 0) return;

    // Sort chronologically
    subjectLogs.sort((a, b) => a.timestamp - b.timestamp);

    const history = subjectLogs.map(log => ({
      timestamp: log.timestamp,
      percentage: Number(((log.score / log.total) * 100).toFixed(1))
    }));

    const baselinePercentage = history[0].percentage;
    const latestPercentage = history[history.length - 1].percentage;
    
    const sumPercentage = history.reduce((sum, h) => sum + h.percentage, 0);
    const averagePercentage = sumPercentage / history.length;

    subjectStats.push({
      subject: subjectStr as Subject,
      baselinePercentage,
      latestPercentage,
      averagePercentage,
      logsCount: subjectLogs.length,
      history
    });
  });

  if (subjectStats.length === 0) {
     return {
      overallAverage: 0,
      readinessScore: 0,
      subjectStats: [],
      weakestSubject: null,
      strongestSubject: null,
    };
  }

  // Calculate overall metrics based on latest percentages
  const sumLatest = subjectStats.reduce((sum, stat) => sum + stat.latestPercentage, 0);
  const overallAverage = sumLatest / subjectStats.length;
  
  // Readiness is a weighted calculation, for now just overall average, but cap at 100
  const readinessScore = Math.min(overallAverage, 100);

  const sortedStats = [...subjectStats].sort((a, b) => a.latestPercentage - b.latestPercentage);
  const weakestSubject = sortedStats[0];
  const strongestSubject = sortedStats[sortedStats.length - 1];

  return {
    overallAverage,
    readinessScore,
    subjectStats,
    weakestSubject,
    strongestSubject
  };
}

// Generate algorithmic coaching text
export function generateCoachingPlan(weakestSubject: SubjectStats | null, latestLog?: ScoreLog): string[] {
  if (!weakestSubject) {
    return [
      "SYSTEM STANDBY: Awaiting diagnostic input.",
      "ACTION REQUIRED: Take a 50-item diagnostic test to calibrate the Analytics Engine."
    ];
  }

  const { subject, latestPercentage } = weakestSubject;
  const deficit = Math.max(0, PASSING_THRESHOLD - latestPercentage).toFixed(1);
  const missedTopic = latestLog?.subtopicsMissed || "complex sub-topics";

  if (latestPercentage >= PASSING_THRESHOLD) {
    return [
      "ALL SYSTEMS OPTIMAL: Target passing thresholds met across active subjects.",
      "MAINTENANCE PROTOCOL: Maintain study velocity. Focus on speed and precision to ensure readiness."
    ];
  }

  const plan = [
    `DIAGNOSTIC ALERT: Sub-optimal performance detected in ${subject} (${latestPercentage.toFixed(1)}%).`,
    `DEFICIT ANALYSIS: You are ${deficit}% below the absolute minimum passing threshold of ${PASSING_THRESHOLD}%.`,
    `ERROR YIELD: Consistent failure patterns detected in ${missedTopic}.`,
    `PRIORITY OVERRIDE: Spend the next 45 minutes exclusively on ${missedTopic} within ${subject}.`,
    `STRATEGIC DIRECTIVE: Focus on time-saving logical eliminations. Treat slow calculations as errors.`
  ];

  if (subject === 'Numerical Ability') {
    plan.push("FAST-TRACK TECHNIQUE: Utilize estimation. If options vary significantly, round numbers before calculating.");
  } else if (subject === 'Verbal Ability') {
    plan.push("FAST-TRACK TECHNIQUE: Isolate the root word. Eliminate extreme absolutes (e.g., 'always', 'never') in conclusion questions.");
  } else if (subject === 'Abstract Reasoning') {
    plan.push("FAST-TRACK TECHNIQUE: Track one element at a time (e.g., just the black dot's rotation) to rapidly eliminate wrong choices.");
  }

  return plan;
}
