import { createRouter, createWebHistory } from "vue-router";
import routes from "@/router/routes";
import RouteMeta from "@/router/RouteMeta";
import store from "@/state/store";

/**
 * @param route
 * @return {Object|null} Redirect object or null if no redirect is needed
 */
const authRedirectCheck = (route) => {
  const routeMeta = route.meta;

  const auth = routeMeta.auth;

  if (auth === RouteMeta.AUTH_ANY) {
    return null;
  }

  if (store.getters["Auth/isLoggedIn"]) {
    if (auth === RouteMeta.AUTH_ONLY_NON_AUTHORIZED) {
      return { name: "Home" };
    }

    if (
      route.name !== "Create project" &&
      !store.getters["Project/getProject"]
    ) {
      return { name: "Create project" };
    }
  } else {
    if (auth === RouteMeta.AUTH_ONLY_AUTHORIZED) {
      return { name: "Login", query: { from: route.fullPath } };
    }
  }
  return null;
};

const router = new createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (!savedPosition) {
      return { x: 0, y: 0 };
    }

    return savedPosition;
  },
});

router.beforeEach(async (toRoute, fromRoute, next) => {
  // await store.dispatch("Auth/checkLocalStorageForSession");

  const redirect = authRedirectCheck(toRoute);

  if (redirect !== null) {
    next(redirect);

    return;
  }

  next();
});

router.afterEach((to) => {
  setTimeout(() => {
    document.title = to.meta?.title
      ? to.meta.title + " | BonusBlock Network"
      : "BonusBlock Network";
  }, 0);
});

export default router;
