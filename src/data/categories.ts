import type { Category } from '@/types/habit';

export const CATEGORIES: Category[] = [
  { id: 'health', name: 'Health', color: '#3D8B5C', icon: 'HeartPulse' },
  { id: 'fitness', name: 'Fitness', color: '#E8A33D', icon: 'Dumbbell' },
  { id: 'study', name: 'Study', color: '#3E8FB0', icon: 'GraduationCap' },
  { id: 'work', name: 'Work', color: '#C25F3F', icon: 'Briefcase' },
  { id: 'reading', name: 'Reading', color: '#7C6FD1', icon: 'BookOpen' },
  { id: 'meditation', name: 'Meditation', color: '#8A7CC7', icon: 'Flower2' },
  { id: 'water', name: 'Water', color: '#4A90D9', icon: 'Droplets' },
  { id: 'sleep', name: 'Sleep', color: '#5B6B8C', icon: 'Moon' },
  { id: 'custom', name: 'Custom', color: '#6B7280', icon: 'Sparkles' },
];

export const getCategory = (id: string): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

export const HABIT_COLORS: string[] = [
  '#3D8B5C',
  '#E8A33D',
  '#7C6FD1',
  '#3E8FB0',
  '#C25F3F',
  '#D65A8F',
  '#2F6B4A',
  '#8C744C',
  '#DC4E4E',
  '#4A90D9',
];

export const HABIT_ICONS: string[] = [
  'HeartPulse',
  'Dumbbell',
  'BrainCircuit',
  'BookOpen',
  'Briefcase',
  'Users',
  'PiggyBank',
  'Home',
  'Sparkles',
  'Droplets',
  'Moon',
  'Sun',
  'Salad',
  'Pencil',
  'Music',
  'Bike',
  'Coffee',
  'Smile',
];
