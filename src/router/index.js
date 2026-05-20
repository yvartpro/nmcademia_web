import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/LandingPage.vue';
import PresentationPage from '../views/PresentationPage.vue';
import AdminLogin from '../views/admin/AdminLogin.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage
  },
  {
    path: '/presentation',
    name: 'presentation',
    component: PresentationPage
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  // Redirect fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Auth Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'admin-login' });
    } else {
      next();
    }
  } else {
    // If authenticated and visiting login, go directly to dashboard
    if (to.name === 'admin-login' && token) {
      next({ name: 'admin-dashboard' });
    } else {
      next();
    }
  }
});

export default router;
