import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/privacy-policy",
      name: "privacy-policy",
      component: () => import("../views/PrivacyPolicyView.vue"),
    },
    {
      path: "/terms-and-conditions",
      name: "terms-and-conditions",
      component: () => import("../views/TermsAndConditionsView.vue"),
    },
    {
      path: "/mails",
      name: "mails",
      component: () => import("../views/MailListView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/mail-fitting/:thread_id",
      name: 'mail-fitting',
      component: () => import("../views/MailFittingView.vue"),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: "/user",
      name: "user",
      component: () => import("../views/UserView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/conversation-logs",
      name: "conversation-logs",
      component: () => import("../views/ConversationLogListView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/jobs",
      name: "jobs",
      component: () => import("../views/JobListView.vue"),
      meta: { requiresAuth: true }
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
