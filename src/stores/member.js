import { defineStore } from 'pinia';
import {
  COURSES,
  LESSONS,
  ACHIEVEMENTS,
  DAILY_QUESTS,
  getLevelInfo,
} from '../data/learning';
import {
  resolveJourneyId,
  getJourney,
  JOURNEY_IDS,
} from '../data/learnerJourneys';

const STORAGE_KEY = 'nma_member_profile';

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p?.registered && !p.journeyId && p.profileType) {
      p.journeyId = resolveJourneyId(p.profileType);
    }
    return p;
  } catch {
    return null;
  }
}

function defaultProfile() {
  return {
    registered: false,
    fullName: '',
    email: '',
    country: 'NG',
    profileType: '',
    journeyId: JOURNEY_IDS.EXPLORE,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    lastActiveDate: null,
    completedLessons: [],
    courseProgress: {},
    quests: DAILY_QUESTS.map((q) => ({ ...q })),
    achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
    certificates: [],
  };
}

export const useMemberStore = defineStore('member', {
  state: () => ({
    profile: loadProfile() || defaultProfile(),
  }),

  getters: {
    isRegistered: (state) => state.profile.registered,
    displayName: (state) => state.profile.fullName || 'Learner',
    journeyId: (state) =>
      state.profile.journeyId || resolveJourneyId(state.profile.profileType),
    journey(state) {
      return getJourney(this.journeyId);
    },
    canFeature: (state) => (feature) => {
      const j = getJourney(
        state.profile.journeyId || resolveJourneyId(state.profile.profileType)
      );
      return Boolean(j.features[feature]);
    },
    xp: (state) => state.profile.xp,
    streak: (state) => state.profile.streak,
    levelInfo: (state) => getLevelInfo(state.profile.xp),
    level: (state) => getLevelInfo(state.profile.xp).current.level,
    levelTitle: (state) => getLevelInfo(state.profile.xp).current.title,
    courses: () => COURSES,
    continueCourse(state) {
      const allowed = this.filteredCourses;
      const inProgress = allowed.find((c) => {
        const progress = state.profile.courseProgress[c.id];
        return progress > 0 && progress < 100;
      });
      return inProgress || allowed[0] || COURSES[0];
    },
    filteredCourses(state) {
      const id = state.profile.journeyId || resolveJourneyId(state.profile.profileType);
      if (id === JOURNEY_IDS.BUILD) return COURSES;
      if (id === JOURNEY_IDS.LEARN) {
        return COURSES.filter((c) =>
          ['Beginner', 'Mindset', 'Skills'].includes(c.category)
        );
      }
      return [];
    },
    continueProgress(state) {
      const course = this.continueCourse;
      if (!course) return 0;
      return state.profile.courseProgress[course.id] || 0;
    },
  },

  actions: {
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    },

    registerFromLead({ fullName, email, country, profileType }) {
      const journeyId = resolveJourneyId(profileType);
      this.profile.registered = true;
      this.profile.fullName = fullName;
      this.profile.email = email;
      this.profile.country = country;
      this.profile.profileType = profileType;
      this.profile.journeyId = journeyId;
      this.profile.xp = journeyId === JOURNEY_IDS.EXPLORE ? 0 : 50;
      this.profile.streak = journeyId === JOURNEY_IDS.EXPLORE ? 0 : 1;
      this.profile.lastActiveDate = new Date().toISOString().slice(0, 10);
      if (journeyId !== JOURNEY_IDS.EXPLORE) {
        this.checkDailyStreak();
      }
      this.persist();
      return getJourney(journeyId);
    },

    checkDailyStreak() {
      if (!this.canFeature('gamification')) return;

      const today = new Date().toISOString().slice(0, 10);
      const last = this.profile.lastActiveDate;
      if (last === today) return;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (last === yesterdayStr) {
        this.profile.streak += 1;
        if (this.profile.streak > this.profile.bestStreak) {
          this.profile.bestStreak = this.profile.streak;
        }
        this.addXp(10);
      } else if (last !== today) {
        this.profile.streak = 1;
      }
      this.profile.lastActiveDate = today;
      this.persist();
    },

    addXp(amount) {
      if (!this.canFeature('gamification')) return;
      this.profile.xp += amount;
      this.persist();
    },

    completeLesson(courseId, lessonId) {
      if (!this.canFeature('courses')) return;

      const key = `${courseId}:${lessonId}`;
      if (this.profile.completedLessons.includes(key)) return;

      this.profile.completedLessons.push(key);
      this.addXp(25);

      const lessons = LESSONS[courseId] || [];
      const completed = lessons.filter((l) =>
        this.profile.completedLessons.includes(`${courseId}:${l.id}`)
      ).length;
      const progress = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
      this.profile.courseProgress[courseId] = progress;

      if (progress === 100) {
        const course = COURSES.find((c) => c.id === courseId);
        if (course) this.addXp(course.xp);
        const cert = this.profile.achievements.find((a) => a.id === 'course-complete');
        if (cert) cert.unlocked = true;
        if (this.canFeature('certificates')) {
          this.issueCertificate(courseId);
        }
      }

      const first = this.profile.achievements.find((a) => a.id === 'first-lesson');
      if (first) first.unlocked = true;

      this.persist();
    },

    isLessonComplete(courseId, lessonId) {
      return this.profile.completedLessons.includes(`${courseId}:${lessonId}`);
    },

    getCourseProgress(courseId) {
      return this.profile.courseProgress[courseId] || 0;
    },

    completeQuest(questId) {
      if (!this.canFeature('gamification')) return;
      const quest = this.profile.quests.find((q) => q.id === questId);
      if (quest && !quest.done) {
        quest.done = true;
        this.addXp(quest.xp);
        this.persist();
      }
    },

    issueCertificate(courseId) {
      if (!this.canFeature('certificates')) return null;

      const course = COURSES.find((c) => c.id === courseId);
      if (!course || this.getCourseProgress(courseId) < 100) return null;
      const exists = this.profile.certificates.find((c) => c.courseId === courseId);
      if (exists) return exists;

      const cert = {
        id: `NMA-${Date.now()}`,
        courseId,
        courseTitle: course.title,
        recipient: this.profile.fullName,
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      };
      this.profile.certificates.push(cert);
      this.persist();
      return cert;
    },
  },
});
