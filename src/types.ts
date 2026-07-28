export type Subject = 
  | 'Numerical Ability'
  | 'Verbal Reasoning'
  | 'Abstract Reasoning'
  | 'General Information'
  | 'Philippine Constitution'
  | 'R.A. 6713';

export const SUBJECTS: Subject[] = [
  'Numerical Ability',
  'Verbal Reasoning',
  'Abstract Reasoning',
  'General Information',
  'Philippine Constitution',
  'R.A. 6713'
];

export interface ScoreLog {
  id: string;
  timestamp: number;
  subject: Subject;
  score: number;
  total: number;
  subtopicsMissed?: string;
}

export interface SubjectStats {
  subject: Subject;
  baselinePercentage: number;
  latestPercentage: number;
  averagePercentage: number;
  logsCount: number;
}

export interface AnalyticsData {
  overallAverage: number;
  readinessScore: number;
  subjectStats: SubjectStats[];
  weakestSubject: SubjectStats | null;
  strongestSubject: SubjectStats | null;
}
