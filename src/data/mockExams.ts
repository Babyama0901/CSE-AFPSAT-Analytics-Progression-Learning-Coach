import { MockExamTemplate } from '../types';

export const MOCK_EXAM_TEMPLATES: MockExamTemplate[] = [
  {
    id: 'practice-verbal-dynamic',
    title: 'Verbal Ability Practice Test',
    examType: 'CSE',
    totalItems: 50,
    timeLimitMinutes: 50,
    subjectDistribution: {
      'Grammar and Language Usage': 9,
      'Vocabulary': 9,
      'Spelling': 8,
      'Idiomatic Expressions': 8,
      'Identifying Errors (English Grammar)': 8,
      'Reading Comprehension': 8
    }
  },
  {
    id: 'practice-geninfo',
    title: 'General Information Practice Test',
    examType: 'CSE',
    totalItems: 50,
    timeLimitMinutes: 45,
    subjectDistribution: {
      'General Information': 50
    }
  }
];
