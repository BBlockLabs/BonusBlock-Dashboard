import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AuthNavigationGuard from "@/router/AuthNavigationGuard";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/DashboardView.vue"),
    },
    {
      path: "/campaign",
      name: "Campaign",
      component: () => import("@/views/Campaign/IndexView.vue"),
    },
    {
      path: "/campaign/add",
      name: "Campaign Add",
      component: () => import("@/views/Campaign/AddView.vue"),
    },
  ],
});

router.beforeEach(AuthNavigationGuard);

export default router;
