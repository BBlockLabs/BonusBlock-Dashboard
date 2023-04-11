import Home from '@/views/Home.vue';
import RouteMeta from '@/router/RouteMeta';
const AddBalance = () => import('@/views/AddBalance.vue');
const CreateWorkspace = () => import('@/views/CreateWorkspace.vue');
const Login = () => import('@/views/Login.vue');
const Packages = () => import('@/views/Packages.vue');
const Page404 = () => import('@/views/utility/404.vue');
const Register = () => import('@/views/Register.vue');
const ViewServer = () => import('@/views/ViewServer.vue');
const ServersMap = () => import('@/views/ServersMap.vue');
const Organizations = () => import('@/views/Organizations.vue');
const ViewOrganization = () => import('@/views/ViewOrganization.vue');
const AddDeployment = () => import('@/views/AddDeployment.vue');
const ViewDeploymentTemplate = () => import('@/views/ViewDeploymentTemplate.vue');
const ConfirmDeployment = () => import('@/views/ConfirmDeployment.vue');
const DeploymentTemplates = () => import('@/views/DeploymentTemplates.vue');
const Dashboard = () => import('@/views/Dashboard.vue');

export default [
  {
    path: '/',
    component: Home,
    name: 'Home',
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ANY,
    }),
  },
  {
    path: '/login',
    component: Login,
    name: 'Login',
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ONLY_NON_AUTHORIZED,
    }),
  },
  {
    path: '/register',
    component: Register,
    name: 'Register',
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ONLY_NON_AUTHORIZED,
    }),
  },
  {
    path: '/create-workspace',
    component: CreateWorkspace,
    name: 'Create workspace',
    meta: new RouteMeta(),
  },
  {
    path: '/add-deployment',
    component: AddDeployment,
    name: 'Add Deployment',
    meta: new RouteMeta(),
  },
  {
    path: '/confirm-deployment',
    component: ConfirmDeployment,
    name: 'Confirm Deployment',
    meta: new RouteMeta(),
  },
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'Dashboard',
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ONLY_AUTHORIZED,
    }),
  },
  {
    path: '/nodes',
    component: Dashboard,
    name: 'Nodes',
    meta: new RouteMeta(),
  },
  {
    path: '/overview',
    component: Dashboard,
    name: 'Overview',
    meta: new RouteMeta(),
  },
  /*    {
        path: '/config',
        component: Home,
        name: 'Config',
        meta: new RouteMeta(),
   },*/
  {
    path: '/templates',
    component: DeploymentTemplates,
    name: 'Templates',
    meta: new RouteMeta(),
  },
  {
    path: '/templates/:deploymentTemplateId',
    component: ViewDeploymentTemplate,
    name: 'Template',
    meta: new RouteMeta(),
  },
  /*  {
      path: '/providers',
      component: Home,
      name: 'Providers',
      meta: new RouteMeta(),
    },
    {
      path: '/billing',
      component: AddBalance,
      name: 'Billing',
      meta: new RouteMeta(),
    },*/
  {
    path: '/add-balance',
    component: AddBalance,
    name: 'Add balance',
    meta: new RouteMeta(),
  },
  {
    path: '/packages',
    component: Packages,
    name: 'Packages',
    meta: new RouteMeta(),
  },
  {
    path: '/server/:serverId',
    component: ViewServer,
    name: 'Server',
    meta: new RouteMeta(),
  },
  {
    path: '/organizations',
    component: Organizations,
    name: 'Organizations',
    meta: new RouteMeta(),
  },
  {
    path: '/organizations/:organizationId',
    component: ViewOrganization,
    name: 'Organization',
    meta: new RouteMeta(),
  },
  {
    path: '/map',
    component: ServersMap,
    name: 'Servers Map',
    meta: new RouteMeta(),
  },
  {
    path: '/404',
    component: Page404,
    name: 'Page Not Found',
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ANY,
    }),
  },
  {
    path: "/:catchAll(.*)",
    redirect: '/404',
    meta: new RouteMeta({
      auth: RouteMeta.AUTH_ANY,
    }),
  },
];
