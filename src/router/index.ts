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
      path: "/mail",
      name: "mail",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/MailView.vue"),
    },
    {
      path: "/mail-fitness/:thread_id",
      name: 'mail-fitness',
      component: () => import("../views/MailFitnessView.vue"),
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
  ],
});

export default router;
