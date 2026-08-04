export type ExamType = 'CSE' | 'AFPSAT';

export type Subject = 
  | 'Numerical Ability'
  | 'General Information'
  // CSE Sub-components
  | 'Spelling'
  | 'Idiomatic Expressions'
  | 'Identifying Errors'
  | 'Talasitaan'
  | 'Kawikaang Filipino'
  | 'Pagkilala sa Mali'
  | 'Logic'
  // AFPSAT Sub-components
  | 'Reading Comprehension'
  | 'Vocabulary'
  | 'Grammar and Language Usage'
  | 'Logical Verbal Reasoning'
  | 'Basic Arithmetic'
  | 'Word Problems'
  | 'Algebra Basics'
  | 'Geometry Basics'
  | 'Logical Relationships'
  | 'Series Completion'
  | 'Pattern Recognition 1'
  | 'Pattern Recognition 2'
  | 'Pattern Recognition 3';

export const CSE_GROUPS = {
  'VERBAL ABILITY (ENGLISH)': [
    'Spelling',
    'Idiomatic Expressions',
    'Identifying Errors'
  ] as Subject[],
  'VERBAL ABILITY (FILIPINO)': [
    'Talasitaan',
    'Kawikaang Filipino',
    'Pagkilala sa Mali'
  ] as Subject[],
  'ANALYTIC ABILITY': [
    'Logic'
  ] as Subject[],
  'NUMERICAL ABILITY': [
    'Numerical Ability'
  ] as Subject[],
  'GENERAL INFORMATION': [
    'General Information'
  ] as Subject[]
};

export const CSE_SUBJECTS: Subject[] = [
  ...CSE_GROUPS['VERBAL ABILITY (ENGLISH)'],
  ...CSE_GROUPS['VERBAL ABILITY (FILIPINO)'],
  ...CSE_GROUPS['ANALYTIC ABILITY'],
  ...CSE_GROUPS['NUMERICAL ABILITY'],
  ...CSE_GROUPS['GENERAL INFORMATION']
];

export const SUBJECTS: Subject[] = [
  ...CSE_SUBJECTS,
  'Reading Comprehension',
  'Vocabulary',
  'Grammar and Language Usage',
  'Logical Verbal Reasoning',
  'Basic Arithmetic',
  'Word Problems',
  'Algebra Basics',
  'Geometry Basics',
  'Logical Relationships',
  'Series Completion',
  'Pattern Recognition 1',
  'Pattern Recognition 2',
  'Pattern Recognition 3'
];

export const AFPSAT_GROUPS = {
  'VERBAL REASONING': [
    'Reading Comprehension',
    'Vocabulary',
    'Grammar and Language Usage',
    'Logical Verbal Reasoning'
  ] as Subject[],
  'NUMERICAL REASONING': [
    'Basic Arithmetic',
    'Word Problems',
    'Algebra Basics',
    'Geometry Basics'
  ] as Subject[],
  'ABSTRACT REASONING': [
    'Logical Relationships',
    'Series Completion',
    'Pattern Recognition 1',
    'Pattern Recognition 2',
    'Pattern Recognition 3'
  ] as Subject[]
};

export const AFPSAT_SUBJECTS: Subject[] = [
  ...AFPSAT_GROUPS['VERBAL REASONING'],
  ...AFPSAT_GROUPS['NUMERICAL REASONING'],
  ...AFPSAT_GROUPS['ABSTRACT REASONING']
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
