import ActionResponse from "@/common/ActionResponse";
import Campaign from "@/state/models/Campaign.js";
import RewardedActivity from "@/state/models/RewardedActivity.js";
import Model from "@/state/models/Model.js";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

export class CampaignState {
  /**
   * @type {Map<string, Campaign>}
   */
  campaigns = new Map();
}

export default {
  namespaced: true,
  state: new CampaignState(),
  getters: {
    /**
     * @param state
     * @returns {function(string): Campaign | null}
     */
    getCampaign: (state) => (campaignId) => {
      if (!state.campaigns.has(campaignId)) {
        return null;
      }

      return state.campaigns.get(campaignId);
    },
  },
  mutations: {
    /**
     * @param {CampaignState} state
     * @param {Campaign} campaign
     */
    setCampaign(state, campaign) {
      state.campaigns.set(campaign.id, campaign);
    },
    /**
     * @param {CampaignState} state
     * @param {string} campaignId
     */
    removeCampaign(state, campaignId) {
      if (!state.campaigns.has(campaignId)) {
        return;
      }

      state.campaigns.delete(campaignId);
    },
  },
  actions: {
    /**
     * @param getters
     * @param rootGetters
     * @param commit
     * @param {string} campaignId
     * @returns {Promise<ActionResponse>}
     */
    async storeCampaign({ getters, rootGetters, commit }, campaignId) {
      const campaignDto = getters["getCampaign"](campaignId)?.toDto() || null;

      if (campaignDto === null) {
        return new ActionResponse(false, null, ["CAMPAIGN_NOT_FOUND"]);
      }

      const rewardedActivities =
        rootGetters["RewardedActivity/getByCampaign"](campaignId);

      campaignDto.rewardedActivities = rewardedActivities.map(
        (rewardedActivity) => rewardedActivity.toDto()
      );

      // simulate request
      await sleep(500);

      if (!campaignDto.id) {
        campaignDto.id = crypto.randomUUID();
        campaignDto.status = "draft";
      }

      campaignDto.rewardedActivities.forEach((rewardedActivityDto) => {
        if (rewardedActivityDto.id === null) {
          rewardedActivityDto.id = crypto.randomUUID();
        }
      });

      if (campaignDto.name === "fail") {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      //////////////////////

      if (campaignDto.id === null) {
        commit("removeCampaign", campaignId);
      }

      rewardedActivities.forEach(({ id }) => {
        if (id.includes(Model.TEMPORARY_PREFIX)) {
          commit("RewardedActivity/removeRewardedActivity", id, { root: true });
        }
      });

      commit("setCampaign", Campaign.fromDto(campaignDto));

      campaignDto.rewardedActivities
        .map(RewardedActivity.fromDto)
        .forEach((rewardedActivity) => {
          rewardedActivity.campaign = campaignDto.id;
          commit("RewardedActivity/setRewardedActivity", rewardedActivity, {
            root: true,
          });
        });

      return new ActionResponse(true, campaignDto.id);
    },
  },
};
