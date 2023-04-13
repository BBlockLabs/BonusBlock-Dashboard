import Vuex from "vuex";
import Auth from "@/state/modules/Auth";
import Campaign from "@/state/modules/Campaign.js";
import Category from "@/state/modules/Category.js";
import DeploymentModule from "@/state/modules/Deployment";
import DeploymentTemplateModule from "@/state/modules/DeploymentTemplate";
import Network from "@/state/modules/Network.js";
import OrganizationModule from "@/state/modules/Organization";
import PackageModule from "@/state/modules/Package";
import Product from "@/state/modules/Product.js";
import ServerModule from "@/state/modules/Server";
import Token from "@/state/modules/Token.js";
import UserModule from "@/state/modules/User";
import WalletModule from "@/state/modules/Wallet";
import WorkspaceModule from "@/state/modules/Workspace";

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
    DeploymentModule,
    DeploymentTemplateModule,
    Network,
    OrganizationModule,
    PackageModule,
    Product,
    ServerModule,
    Token,
    UserModule,
    WalletModule,
    WorkspaceModule,
  },
});
