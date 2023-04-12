import ActionResponse from "@/common/ActionResponse";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

export class CampaignState {
  /**
   * @type {Campaign[]}
   */
  campaigns = [];
}

export default {
  namespaced: true,
  state: new CampaignState(),
  getters: {},
  mutations: {
    /**
     * @param {CampaignState} state
     * @param {Campaign} campaign
     */
    addCampaign(state, campaign) {
      state.campaigns.push(campaign);
    },
  },
  actions: {
    /**
     * @param commit
     * @param {Campaign} campaign
     * @returns {Promise<ActionResponse>}
     */
    async storeCampaign({ commit }, campaign) {
      await sleep(500);

      if (campaign.name === "fail") {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      campaign.id = crypto.randomUUID();
      campaign.status = "draft";

      commit("addCampaign", campaign);

      return new ActionResponse(true, campaign);
    },
  },
};
