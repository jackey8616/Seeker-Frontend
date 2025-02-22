import { createRouter, createWebHashHistory } from "vue-router";

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
      path: "/mails",
      name: "mails",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/MailListView.vue"),
    },
    {
      path: "/mail-fitting/:thread_id",
      name: 'mail-fitting',
      component: () => import("../views/MailFittingView.vue"),
      props: true,
    },
    {
      path: "/user",
      name: "user",
      component: () => import("../views/UserView.vue"),
    },
    {
      path: "/conversation-logs",
      name: "conversation-logs",
      component: () => import("../views/ConversationLogListView.vue"),
    },
    {
      path: "/conversation-log/:conversation_log_id",
      name: 'conversation-log',
      component: () => import("../views/ConversationLogView.vue"),
      props: true,
    },
    {
      path: "/jobs",
      name: "jobs",
      component: () => import("../views/JobListView.vue"),
    },
  ],
});

export default router;
