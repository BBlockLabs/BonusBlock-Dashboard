import Vuex from "vuex";
import Auth from "@/state/modules/Auth";
import PackageModule from "@/state/modules/Package";
import UserModule from "@/state/modules/User";
import ServerModule from "@/state/modules/Server";
import WalletModule from "@/state/modules/Wallet";
import WorkspaceModule from "@/state/modules/Workspace";
import OrganizationModule from "@/state/modules/Organization";
import DeploymentTemplateModule from "@/state/modules/DeploymentTemplate";
import DeploymentModule from "@/state/modules/Deployment";
import Campaign from "@/state/modules/Campaign.js";
import Token from "@/state/modules/Token.js";
import Category from "@/state/modules/Category.js";

export default new Vuex.Store({
  state: {
    debug: false,
  },
  mutations: {
    toggleDebug(state) {
      state.debug = !state.debug;
    },
  },
  modules: {
    Auth,
    Campaign,
    Category,
    PackageModule,
    UserModule,
    ServerModule,
    WalletModule,
    WorkspaceModule,
    OrganizationModule,
    DeploymentTemplateModule,
    DeploymentModule,
    Token,
  },
});
