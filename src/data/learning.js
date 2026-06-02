export const LEVELS = [
  { level: 1, title: 'Curious Explorer', xpRequired: 0 },
  { level: 2, title: 'Active Learner', xpRequired: 500 },
  { level: 3, title: 'Team Builder', xpRequired: 1500 },
  { level: 4, title: 'Network Leader', xpRequired: 3500 },
  { level: 5, title: 'Global Ambassador', xpRequired: 7000 },
];

export const COURSES = [
  {
    id: 'leadership-foundations',
    title: 'Leadership Multiplied',
    subtitle: 'Build people who build people',
    category: 'Leadership',
    lessons: 12,
    duration: '4h',
    xp: 200,
    rating: 4.9,
    gradient: 'from-brand to-indigo-700',
    description: 'Master the art of duplication, team building, and leadership in network marketing.',
  },
  {
    id: 'mindset-mastery',
    title: 'Mindset Mastery',
    subtitle: 'Overcome rejection and build confidence',
    category: 'Mindset',
    lessons: 8,
    duration: '2.5h',
    xp: 150,
    rating: 4.8,
    gradient: 'from-accent-dark to-orange-600',
    description: 'Transform your mindset from employee to entrepreneur.',
  },
  {
    id: 'network-marketing-101',
    title: 'Network Marketing 101',
    subtitle: 'Understanding the science of human connection',
    category: 'Beginner',
    lessons: 10,
    duration: '3h',
    xp: 180,
    rating: 4.9,
    gradient: 'from-emerald-600 to-teal-700',
    description: 'Everything you need to know before building your organization.',
  },
  {
    id: 'digital-prospecting',
    title: 'Digital Prospecting',
    subtitle: 'Connect beyond your personal circle',
    category: 'Skills',
    lessons: 6,
    duration: '1.5h',
    xp: 120,
    rating: 4.7,
    gradient: 'from-violet-600 to-purple-700',
    description: 'Use social media and digital tools to expand your reach.',
  },
];

export const LESSONS = {
  'leadership-foundations': [
    { id: 'intro', title: 'Introduction to Leadership', duration: 8, xp: 25 },
    { id: 'duplication', title: 'The Power of Duplication', duration: 12, xp: 25 },
    { id: 'first-team', title: 'Building Your First Team', duration: 15, xp: 25 },
    { id: 'communication', title: 'Communication That Inspires', duration: 10, xp: 25 },
    { id: 'accountability', title: 'Creating Accountability Systems', duration: 14, xp: 25 },
    { id: 'emotional-intelligence', title: 'Emotional Intelligence for Leaders', duration: 11, xp: 25 },
  ],
  'mindset-mastery': [
    { id: 'intro', title: 'The Employee Mindset Trap', duration: 7, xp: 25 },
    { id: 'rejection', title: 'Handling Rejection Professionally', duration: 10, xp: 25 },
    { id: 'consistency', title: 'Building Daily Consistency', duration: 9, xp: 25 },
  ],
  'network-marketing-101': [
    { id: 'intro', title: 'What is Network Marketing?', duration: 8, xp: 25 },
    { id: 'compensation', title: 'Understanding Compensation Plans', duration: 14, xp: 25 },
    { id: 'products', title: 'Products & Value Creation', duration: 10, xp: 25 },
  ],
  'digital-prospecting': [
    { id: 'intro', title: 'Digital vs Traditional Prospecting', duration: 6, xp: 25 },
    { id: 'social-media', title: 'Social Media Strategies', duration: 12, xp: 25 },
  ],
};

export const MENTORS = [
  {
    id: 'ada-okonkwo',
    name: 'Coach Ada Okonkwo',
    title: 'Global Ambassador',
    rating: 4.9,
    specialties: ['Rejection', 'Duplication', 'Team Building'],
    languages: ['English', 'Igbo'],
    responseTime: '< 2 hours',
    bio: 'I help distributors build confidence and create sustainable organizations.',
    matchTags: ['rejection', 'consistency', 'upline'],
  },
  {
    id: 'james-mbeki',
    name: 'Coach James Mbeki',
    title: 'Gold Executive',
    rating: 4.8,
    specialties: ['Leadership', 'Presentation', 'Mindset'],
    languages: ['English', 'Swahili'],
    responseTime: '< 4 hours',
    bio: 'Former corporate executive turned network marketing leader. I specialize in mindset shifts.',
    matchTags: ['mindset', 'leadership', 'communication'],
  },
  {
    id: 'fatima-hassan',
    name: 'Coach Fatima Hassan',
    title: 'Silver Executive',
    rating: 4.7,
    specialties: ['Single Income', 'Flexibility', 'Growth'],
    languages: ['English', 'French', 'Arabic'],
    responseTime: '< 3 hours',
    bio: 'Single mother who built financial freedom. I understand starting from zero.',
    matchTags: ['single mother', 'income', 'flexibility'],
  },
];

export const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Sarah Johnson',
    level: 5,
    space: 'Wins',
    content: 'Just completed Leadership Foundations! The duplication module changed everything for me. 🎉',
    time: '2h ago',
    reactions: 24,
    comments: 5,
    isWin: true,
  },
  {
    id: 2,
    author: 'David Kamara',
    level: 7,
    space: 'Questions',
    content: 'How do you handle rejection from close friends and family without damaging relationships?',
    time: '4h ago',
    reactions: 8,
    comments: 12,
    isWin: false,
  },
  {
    id: 3,
    author: 'Daniel Mensah',
    level: 4,
    space: 'Mindset',
    content: 'Day 12 streak! Consistency is the secret nobody talks about enough.',
    time: '6h ago',
    reactions: 31,
    comments: 3,
    isWin: true,
  },
];

export const ACHIEVEMENTS = [
  { id: 'first-lesson', title: 'First Step', icon: '🎯', unlocked: true },
  { id: 'week-streak', title: '7-Day Streak', icon: '🔥', unlocked: true },
  { id: 'community-star', title: 'Community Star', icon: '⭐', unlocked: true },
  { id: 'course-complete', title: 'Course Graduate', icon: '🏆', unlocked: false },
  { id: 'mentor-session', title: 'Coached', icon: '🎓', unlocked: false },
  { id: 'level-5', title: 'Ambassador', icon: '👑', unlocked: false },
];

export const DAILY_QUESTS = [
  { id: 'lesson', label: 'Watch 1 lesson', xp: 50, done: false },
  { id: 'community', label: 'Post in community', xp: 15, done: false },
  { id: 'mentor', label: 'Check in with mentor', xp: 25, done: false },
];

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  const xpInLevel = xp - current.xpRequired;
  const xpForNext = next ? next.xpRequired - current.xpRequired : 0;
  const progress = next ? (xpInLevel / xpForNext) * 100 : 100;
  return { current, next, xpInLevel, xpForNext, progress };
}
