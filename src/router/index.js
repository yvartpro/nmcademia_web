import { createRouter, createWebHistory } from 'vue-router';
import { useMemberStore } from '../stores/member';
import { isRouteAllowed, getJourney } from '../data/learnerJourneys';

const routes = [
  { path: '/', name: 'landing', component: () => import('../views/LandingPage.vue') },
  { path: '/funnel/:funnelId', name: 'funnel', component: () => import('../views/FunnelPage.vue') },
  { path: '/presentation', name: 'presentation', component: () => import('../views/PresentationPage.vue') },
  { path: '/package-details/:slug', name: 'package-details', component: () => import('../views/PackageDetails.vue') },
  { path: '/app/training', name: 'training', component: () => import('../views/member/TrainingPage.vue'), meta: { requiresLearner: true } },
  { path: '/app/learn/:courseId', name: 'member-course', component: () => import('../views/member/CoursePage.vue'), meta: { requiresLearner: true } },
  { path: '/app/learn/:courseId/:lessonId', name: 'member-lesson', component: () => import('../views/member/LessonPage.vue'), meta: { requiresLearner: true } },
  { path: '/app/progress', name: 'member-progress', component: () => import('../views/member/ProgressPage.vue'), meta: { requiresLearner: true } },
  { path: '/app/certificates', name: 'member-certificates', component: () => import('../views/member/CertificatesPage.vue'), meta: { requiresLearner: true } },
  { path: '/app/settings', name: 'member-settings', component: () => import('../views/member/SettingsPage.vue'), meta: { requiresLearner: true } },
  // Legacy routes → journey-aware redirects
  { path: '/app/home', redirect: () => redirectForJourney() },
  { path: '/app/learn', redirect: () => redirectForJourney() },
  { path: '/app/community', redirect: () => redirectForJourney() },
  { path: '/app/mentors', redirect: () => redirectForJourney() },
  { path: '/app/mentors/:id', redirect: () => redirectForJourney() },
  { path: '/admin/login', name: 'admin-login', component: () => import('../views/admin/AdminLogin.vue') },
  { path: '/admin/dashboard', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboard.vue'), meta: { requiresAuth: true } },
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

router.beforeEach((to, from) => {
  const token = localStorage.getItem('admin_token');

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) return { name: 'admin-login' };
    return true;
  }

  if (to.name === 'admin-login' && token) {
    return { name: 'admin-dashboard' };
  }

  const memberStore = useMemberStore();

  if (to.meta.requiresLearner) {
    if (!memberStore.isRegistered) {
      return { name: 'landing' };
    }
    const journeyId = memberStore.journeyId;
    if (!isRouteAllowed(journeyId, to.path)) {
      const journey = getJourney(journeyId);
      return journey.defaultRoute;
    }
  }

  if (memberStore.isRegistered && to.path.startsWith('/app')) {
    const journeyId = memberStore.journeyId;
    if (!isRouteAllowed(journeyId, to.path)) {
      return getJourney(journeyId).defaultRoute;
    }
  }

  return true;
});

export default router;
