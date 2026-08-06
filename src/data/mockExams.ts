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
  },
  {
    id: 'practice-talasalitaan',
    title: 'Filipino - Talasalitaan Practice Test',
    examType: 'CSE',
    totalItems: 50,
    timeLimitMinutes: 50,
    subjectDistribution: {
      'Talasitaan': 50
    }
  },
  {
    id: 'practice-kawikaan',
    title: 'Filipino - Kawikaan Practice Test',
    examType: 'CSE',
    totalItems: 50,
    timeLimitMinutes: 50,
    subjectDistribution: {
      'Kawikaang Filipino': 50
    }
  },
  {
    id: 'practice-pagtukoy',
    title: 'Filipino - Pagtukoy ng Mali Practice Test',
    examType: 'CSE',
    totalItems: 25,
    timeLimitMinutes: 25,
    subjectDistribution: {
      'Pagkilala sa Mali': 25
    }
  },
  {
    id: 'practice-numerical',
    title: 'Numerical Ability Practice Test',
    examType: 'CSE',
    totalItems: 50,
    timeLimitMinutes: 50,
    subjectDistribution: {
      'Numerical Ability': 50
    }
  },
  {
    id: 'practice-logic',
    title: 'Logic Practice Test',
    examType: 'CSE',
    totalItems: 15,
    timeLimitMinutes: 20,
    subjectDistribution: {
      'Logic': 15
    }
  }
];
