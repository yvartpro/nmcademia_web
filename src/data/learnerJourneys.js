/**
 * Learner journeys — what each user sees depends on onboarding (profileType).
 * Not everyone gets every format; each path is adapted to their intent.
 */

export const JOURNEY_IDS = {
  EXPLORE: 'explore',
  LEARN: 'learn',
  BUILD: 'build',
};

/** Segment strings (must match CMS / defaults in LandingPage) */
const SEGMENT_EXPLORE = [
  'I am just exploring opportunities',
];

const SEGMENT_BUILD = [
  'I am already in network marketing',
  'I am in network marketing but not satisfied and want to switch companies',
  'I want this business by all means',
];

const SEGMENT_LEARN = [
  'I am new to network marketing',
  'I am tired of depending on one source of income',
  'I am tired of being jobless',
];

/**
 * Classify user from onboarding selection → journey id
 */
export function resolveJourneyId(profileType) {
  if (!profileType || typeof profileType !== 'string') {
    return JOURNEY_IDS.EXPLORE;
  }
  const t = profileType.trim();
  const lower = t.toLowerCase();

  if (SEGMENT_EXPLORE.some((s) => s === t)) return JOURNEY_IDS.EXPLORE;
  if (SEGMENT_BUILD.some((s) => s === t)) return JOURNEY_IDS.BUILD;
  if (SEGMENT_LEARN.some((s) => s === t)) return JOURNEY_IDS.LEARN;

  // Fuzzy match when CMS option text differs slightly
  if (lower.includes('exploring opportunit')) return JOURNEY_IDS.EXPLORE;
  if (lower.includes('already in network marketing') || lower.includes('not satisfied') || lower.includes('by all means')) {
    return JOURNEY_IDS.BUILD;
  }
  if (lower.includes('new to network marketing') || lower.includes('tired of') || lower.includes('jobless')) {
    return JOURNEY_IDS.LEARN;
  }

  return JOURNEY_IDS.LEARN;
}

export const JOURNEYS = {
  [JOURNEY_IDS.EXPLORE]: {
    id: JOURNEY_IDS.EXPLORE,
    title: 'Opportunity Explorer',
    subtitle: 'Understand the opportunity at your own pace',
    welcomeLine: 'Your path is focused on the full partner presentation.',
    afterSignupRoute: '/presentation',
    defaultRoute: '/presentation',
    features: {
      presentation: true,
      courses: false,
      progress: false,
      certificates: false,
      gamification: false,
      ownerMentor: true,
    },
  },
  [JOURNEY_IDS.LEARN]: {
    id: JOURNEY_IDS.LEARN,
    title: 'Mentorship Track',
    subtitle: 'Learn with guidance from your Academia coach',
    welcomeLine: 'You go straight into mentorship training — the business presentation comes later if you need it.',
    afterSignupRoute: '/app/training',
    defaultRoute: '/app/training',
    features: {
      presentation: true,
      courses: true,
      progress: true,
      certificates: false,
      gamification: true,
      ownerMentor: true,
    },
  },
  [JOURNEY_IDS.BUILD]: {
    id: JOURNEY_IDS.BUILD,
    title: 'Leader Development',
    subtitle: 'Review the opportunity, then level up with training',
    welcomeLine: 'You start with the full partner presentation — then continue to advanced training.',
    afterSignupRoute: '/presentation',
    defaultRoute: '/presentation',
    features: {
      presentation: true,
      courses: true,
      progress: true,
      certificates: true,
      gamification: true,
      ownerMentor: true,
    },
  },
};

export function getJourney(journeyId) {
  return JOURNEYS[journeyId] || JOURNEYS[JOURNEY_IDS.EXPLORE];
}

/** Routes only valid for a journey (used in router guard) */
export function isRouteAllowed(journeyId, path) {
  const j = getJourney(journeyId);
  if (path.startsWith('/admin')) return true;
  if (path === '/' || path.startsWith('/presentation')) return j.features.presentation || path === '/';
  if (path === '/app/settings') return true;

  if (path.startsWith('/app/training') || path.startsWith('/app/learn')) {
    return j.features.courses;
  }
  if (path.startsWith('/app/progress')) return j.features.progress;
  if (path.startsWith('/app/certificates')) return j.features.certificates;

  // Retired generic app surfaces
  if (
    path.startsWith('/app/home')
    || path.startsWith('/app/community')
    || path.startsWith('/app/mentors')
  ) {
    return false;
  }

  return false;
}
