export type ExamType = 'CSE' | 'AFPSAT';

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

export const CSE_SUBJECTS: Subject[] = [
  'Numerical Ability',
  'Verbal Reasoning',
  'General Information',
  'Philippine Constitution',
  'R.A. 6713'
];

export const AFPSAT_SUBJECTS: Subject[] = [
  'Verbal Reasoning',
  'Numerical Ability',
  'Abstract Reasoning'
];

export interface ScoreLog {
  id: string;
  timestamp: number;
  exam?: ExamType; // Optional for backward compatibility with old local storage data
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
  history: { timestamp: number; percentage: number }[]; // Added for line chart
}

export interface AnalyticsData {
  overallAverage: number;
  readinessScore: number;
  subjectStats: SubjectStats[];
  weakestSubject: SubjectStats | null;
  strongestSubject: SubjectStats | null;
}
