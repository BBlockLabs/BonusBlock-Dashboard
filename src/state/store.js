import Activity from "@/state/modules/Activity.js";
import Announcement from "@/state/modules/Announcement.js";
import Auth from "@/state/modules/Auth";
import Campaign from "@/state/modules/Campaign.js";
import Category from "@/state/modules/Category.js";
import Contract from "@/state/modules/Contract.js";
import Fee from "@/state/modules/Fee.js";
import Network from "@/state/modules/Network.js";
import Payment from "@/state/modules/Payment.js";
import PaymentPreview from "@/state/modules/PaymentPreview.js";
import Product from "@/state/modules/Product.js";
import Project from "@/state/modules/Project";
import RewardedActivity from "@/state/modules/RewardedActivity.js";
import Vuex from "vuex";

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
    Contract,
    Fee,
    Network,
    Payment,
    PaymentPreview,
    Product,
    Project,
    RewardedActivity,
  },
});
