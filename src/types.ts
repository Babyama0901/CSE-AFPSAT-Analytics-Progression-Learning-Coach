export type ExamType = 'CSE' | 'AFPSAT';

export type Subject = 
  // Old CSE subjects (kept for backward compatibility)
  | 'Numerical Ability'
  | 'Verbal Ability'
  | 'General Information'
  | 'Analytic Ability'
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
  | 'Pattern Recognition 3'
  // New CSE subjects
  | 'Spelling'
  | 'Idiomatic Expressions'
  | 'Identifying Errors (English Grammar)'
  | 'Talasitaan'
  | 'Kawikaang Filipino'
  | 'Pagkilala sa Mali'
  | 'Logic';

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

export const CSE_GROUPS = {
  'VERBAL REASONING': [
    ...AFPSAT_GROUPS['VERBAL REASONING'],
    'Spelling',
    'Idiomatic Expressions',
    'Identifying Errors (English Grammar)',
    'Talasitaan',
    'Kawikaang Filipino',
    'Pagkilala sa Mali'
  ] as Subject[],
  'NUMERICAL REASONING': [
    ...AFPSAT_GROUPS['NUMERICAL REASONING'],
    'Numerical Ability'
  ] as Subject[],
  'ABSTRACT REASONING & LOGIC': [
    ...AFPSAT_GROUPS['ABSTRACT REASONING'],
    'Logic',
    'Seeing Patterns, Diagrams, Figures'
  ] as Subject[],
  'GENERAL INFORMATION': [
    'General Information'
  ] as Subject[]
};

export const CSE_SUBJECTS: Subject[] = [
  ...CSE_GROUPS['VERBAL REASONING'],
  ...CSE_GROUPS['NUMERICAL REASONING'],
  ...CSE_GROUPS['ABSTRACT REASONING & LOGIC'],
  ...CSE_GROUPS['GENERAL INFORMATION']
];

export const SUBJECTS: Subject[] = [
  'Numerical Ability',
  'Verbal Ability',
  'General Information',
  'Analytic Ability',
  ...CSE_SUBJECTS
];

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
  groupId?: string; // Groups multiple logs together (e.g. from one mock exam)
  isMockExam?: boolean;
  mockExamTitle?: string;
  timeElapsed?: number; // Total time spent in seconds
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

export interface Question {
  id: string;
  text: string;
  passage?: string; // For reading comprehension
  options: string[];
  correctAnswer: string; // The exact string of the correct option
  subject: Subject;
  explanation?: string; // Explanation for the answer
  pdfUrl?: string;
}

export interface ExamSection {
  title: string;
  instructions: string;
  questions: Question[];
}

export interface MockExam {
  id: string;
  title: string;
  examType: ExamType;
  totalItems: number;
  timeLimitMinutes: number;
  sections: ExamSection[];
}

export interface MockExamTemplate {
  id: string;
  title: string;
  examType: ExamType;
  totalItems: number;
  timeLimitMinutes: number;
  subjectDistribution: Partial<Record<Subject, number>>;
}
