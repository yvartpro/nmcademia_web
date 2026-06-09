import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/LandingPage.vue';
import PresentationPage from '../views/PresentationPage.vue';
import FunnelPage from '../views/FunnelPage.vue';
import AdminLogin from '../views/admin/AdminLogin.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import TrainingPage from '../views/member/TrainingPage.vue';
import CoursePage from '../views/member/CoursePage.vue';
import LessonPage from '../views/member/LessonPage.vue';
import ProgressPage from '../views/member/ProgressPage.vue';
import CertificatesPage from '../views/member/CertificatesPage.vue';
import SettingsPage from '../views/member/SettingsPage.vue';
import { useMemberStore } from '../stores/member';
import { isRouteAllowed, getJourney } from '../data/learnerJourneys';

const routes = [
  { path: '/', name: 'landing', component: LandingPage },
  { path: '/funnel/:funnelId', name: 'funnel', component: FunnelPage },
  { path: '/presentation', name: 'presentation', component: PresentationPage },
  { path: '/app/training', name: 'training', component: TrainingPage, meta: { requiresLearner: true } },
  { path: '/app/learn/:courseId', name: 'member-course', component: CoursePage, meta: { requiresLearner: true } },
  { path: '/app/learn/:courseId/:lessonId', name: 'member-lesson', component: LessonPage, meta: { requiresLearner: true } },
  { path: '/app/progress', name: 'member-progress', component: ProgressPage, meta: { requiresLearner: true } },
  { path: '/app/certificates', name: 'member-certificates', component: CertificatesPage, meta: { requiresLearner: true } },
  { path: '/app/settings', name: 'member-settings', component: SettingsPage, meta: { requiresLearner: true } },
  // Legacy routes → journey-aware redirects
  { path: '/app/home', redirect: () => redirectForJourney() },
  { path: '/app/learn', redirect: () => redirectForJourney() },
  { path: '/app/community', redirect: () => redirectForJourney() },
  { path: '/app/mentors', redirect: () => redirectForJourney() },
  { path: '/app/mentors/:id', redirect: () => redirectForJourney() },
  { path: '/admin/login', name: 'admin-login', component: AdminLogin },
  { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboard, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

function redirectForJourney() {
  const memberStore = useMemberStore();
  if (!memberStore.isRegistered) return '/';
  return memberStore.journey.defaultRoute;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token');

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) return next({ name: 'admin-login' });
    return next();
  }

  if (to.name === 'admin-login' && token) {
    return next({ name: 'admin-dashboard' });
  }

  const memberStore = useMemberStore();

  if (to.meta.requiresLearner) {
    if (!memberStore.isRegistered) {
      return next({ name: 'landing' });
    }
    const journeyId = memberStore.journeyId;
    if (!isRouteAllowed(journeyId, to.path)) {
      const journey = getJourney(journeyId);
      return next(journey.defaultRoute);
    }
  }

  if (memberStore.isRegistered && to.path.startsWith('/app')) {
    const journeyId = memberStore.journeyId;
    if (!isRouteAllowed(journeyId, to.path)) {
      return next(getJourney(journeyId).defaultRoute);
    }
  }

  next();
});

export default router;
