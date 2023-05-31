import Home from "@/views/HomePage.vue";
import RouteMeta from "@/router/RouteMeta";

const CreateProject = () => import("@/views/CreateProject.vue");
const CampaignIndex = () => import("@/views/CampaignIndex.vue");
const CampaignAdd = () => import("@/views/CampaignAdd.vue");
const ProjectSettings = () => import("@/views/ProjectSettings.vue");
const CampaignAnalytics = () => import("@/views/CampaignAnalytics.vue");
const Login = () => import("@/views/LoginPage.vue");
const Page404 = () => import("@/views/utility/404Page.vue");
const Register = () => import("@/views/RegisterPage.vue");
const Dashboard = () => import("@/views/DashboardPage.vue");

export default [
  {
    path: "/",
    component: Home,
    name: "Home",
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ONLY_AUTHORIZED,
      pagePadding: "0",
    }),
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ONLY_NON_AUTHORIZED,
    }),
  },
  {
    path: "/register",
    component: Register,
    name: "Register",
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ONLY_NON_AUTHORIZED,
    }),
  },
  {
    path: "/campaign",
    component: CampaignIndex,
    name: "Campaigns",
    meta: new RouteMeta({
      pagePadding: "0",
    }),
  },
  {
    path: "/settings",
    component: ProjectSettings,
    name: "Settings",
    meta: new RouteMeta({
      pagePadding: "0",
    }),
  },
  {
    path: "/campaign/add",
    component: CampaignAdd,
    name: "Campaign add",
    meta: new RouteMeta({
      pagePadding: "0",
    }),
  },
  {
    path: "/campaign/:id/edit",
    component: CampaignAdd,
    name: "Campaign edit",
    meta: new RouteMeta({
      pagePadding: "0",
    }),
  },
  {
    path: "/campaign/:id/analytics",
    component: CampaignAnalytics,
    name: "Campaign analytics",
    meta: new RouteMeta({
      pagePadding: "0",
    }),
  },
  {
    path: "/create-project",
    component: CreateProject,
    name: "Create project",
    meta: new RouteMeta(),
  },
  {
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ONLY_AUTHORIZED,
    }),
  },
  {
    path: "/404",
    component: Page404,
    name: "Page Not Found",
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ANY,
    }),
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ANY,
    }),
  },
];
