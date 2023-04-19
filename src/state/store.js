import Activity from "@/state/modules/Activity.js";
import Announcement from "@/state/modules/Announcement.js";
import Auth from "@/state/modules/Auth";
import Campaign from "@/state/modules/Campaign.js";
import Category from "@/state/modules/Category.js";
import DeploymentModule from "@/state/modules/Deployment";
import DeploymentTemplateModule from "@/state/modules/DeploymentTemplate";
import Network from "@/state/modules/Network.js";
import OrganizationModule from "@/state/modules/Organization";
import PackageModule from "@/state/modules/Package";
import Payment from "@/state/modules/Payment.js";
import Product from "@/state/modules/Product.js";
import Project from "@/state/modules/Project";
import RewardedActivity from "@/state/modules/RewardedActivity.js";
import ServerModule from "@/state/modules/Server";
import Token from "@/state/modules/Token.js";
import UserModule from "@/state/modules/User";
import Vuex from "vuex";
import WalletModule from "@/state/modules/Wallet";
import WorkspaceModule from "@/state/modules/Workspace.js";

export default new Vuex.Store({
  state: {
    debug: false,
    hideMenus: false,
  },
  mutations: {
    toggleDebug(state) {
      state.debug = !state.debug;
    },
  },
  modules: {
    Activity,
    Announcement,
    Auth,
    Campaign,
    Category,
    DeploymentModule,
    DeploymentTemplateModule,
    Network,
    OrganizationModule,
    PackageModule,
    Payment,
    Product,
    Project,
    RewardedActivity,
    ServerModule,
    Token,
    UserModule,
    WalletModule,
    WorkspaceModule,
  },
});
