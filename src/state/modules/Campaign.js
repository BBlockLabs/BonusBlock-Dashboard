import ActionResponse from "@/common/ActionResponse";
import Campaign from "@/state/models/Campaign.js";
import { HttpRequest } from "@/common/HttpRequest.js";
import Contract from "@/state/models/Contract.js";
import Network from "@/state/models/Network.js";
import Product from "@/state/models/Product.js";
import Category from "@/state/models/Category.js";
import RewardedActivity from "@/state/models/RewardedActivity.js";
import Action from "@/state/models/Action.js";
import Payment from "@/state/models/Payment.js";
import Fee from "@/state/models/Fee.js";

const endpointStatuses = {
  CONFIRMED: "confirm",
  CANCELLED: "cancel",
  DELETED: "delete",
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
     * @param {CampaignState} state
     * @returns {Array<Campaign>}
     */
    getAllCampaigns(state) {
      const campaigns = [];

      state.campaigns.forEach((campaign) => {
        campaigns.push(campaign);
      });

      return campaigns;
    },
    /**
     * @param {CampaignState} state
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
     * @param commit
     * @param {string} campaignId
     * @param {"DRAFT"|"confirmed"|"payed"|"running"|"ended"|"CANCELLED"|"DELETED"} status
     * @returns {Promise<ActionResponse>}
     */
    async changeStatus({ getters, commit }, { campaignId, status }) {
      const endpointStatus = endpointStatuses[status] || null;

      if (endpointStatus === null) {
        return new ActionResponse(false, null, ["UNSUPPORTED_STATUS"]);
      }

      const response = await HttpRequest.makeRequest(
        `campaign/${campaignId}/${endpointStatus}`
      );

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      const campaign = getters["getCampaign"](campaignId);

      if (campaign === null) {
        return new ActionResponse(false, null, "CAMPAIGN_NOT_FOUND");
      }

      campaign.status = status;

      commit("setCampaign", campaign);

      if (response.payload === null) {
        return new ActionResponse(true, null);
      }

      if (response.payload.payment) {
        const payment = Payment.fromDto(response.payload.payment);

        payment.campaignId = campaignId;

        commit("Payment/setPayment", payment, { root: true });
      }

      return new ActionResponse(true, null);
    },
    async loadCampaigns({ commit, rootGetters }) {
      const response = await HttpRequest.makeRequest("campaign/list");

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      /**
       * @type {Array<CampaignDto>}
       */
      const payload = response.payload;

      payload.forEach((campaignDto) => {
        if (campaignDto.rewardPool) {
          const contract = Contract.fromDto(campaignDto.rewardPool);
          const fee = Fee.fromDto(campaignDto.rewardPool.fee);

          fee.contract = contract.id;

          commit("Contract/setContract", contract, { root: true });
          commit("Fee/setFee", fee, { root: true });
        }

        if (campaignDto.network) {
          commit("Network/setNetwork", Network.fromDto(campaignDto.network), {
            root: true,
          });
        }

        if (campaignDto.product) {
          commit("Product/setProduct", Product.fromDto(campaignDto.product), {
            root: true,
          });
        }

        campaignDto.categories.forEach((categoryDto) => {
          commit("Category/setCategory", Category.fromDto(categoryDto), {
            root: true,
          });
        });

        if (campaignDto.payment !== null) {
          const payment = Payment.fromDto(campaignDto.payment);
          const fee = Fee.fromDto(campaignDto.payment.fee);

          payment.campaignId = campaignDto.id;
          fee.payment = payment.id;

          commit("Payment/setPayment", payment, { root: true });
          commit("Fee/setFee", fee, { root: true });
        }

        rootGetters["RewardedActivity/getByCampaign"](campaignDto.id).forEach(
          ({ id }) => {
            commit("RewardedActivity/removeRewardedActivity", id, {
              root: true,
            });
          }
        );
        campaignDto.actions.forEach((rewardedActivityDto) => {
          const rewardedActivity =
            RewardedActivity.fromDto(rewardedActivityDto);

          rewardedActivity.campaign = campaignDto.id;

          commit(
            "Activity/setAction",
            Action.fromDto(rewardedActivityDto.productActivityAction),
            { root: true }
          );

          commit("RewardedActivity/setRewardedActivity", rewardedActivity, {
            root: true,
          });
        });

        commit("setCampaign", Campaign.fromDto(campaignDto));
      });

      return new ActionResponse(false, null, response.errors);
    },
    /**
     * @param getters
     * @param rootGetters
     * @param commit
     * @param {string} campaignId
     * @returns {Promise<ActionResponse>}
     */
    async storeCampaign({ getters, rootGetters, commit }, campaignId) {
      const campaign = getters["getCampaign"](campaignId);

      if (campaign === null) {
        return new ActionResponse(false, null, ["CAMPAIGN_NOT_FOUND"]);
      }

      const campaignDto = campaign.toDto() || null;

      campaignDto.actions = rootGetters["RewardedActivity/getByCampaign"](
        campaignId
      ).map((rewardedActivity) => rewardedActivity.toDto());

      const endpoint =
        campaign.getId() !== null
          ? `campaign/${campaign.id}/update`
          : "campaign/create";

      const response = await HttpRequest.makeRequest(endpoint, campaignDto);

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      if (response.payload !== campaignId) {
        campaign.id = response.payload;

        commit("removeCampaign", campaignId);
        commit("setCampaign", campaign);

        rootGetters["RewardedActivity/getByCampaign"](campaignId).forEach(
          (rewardedActivity) => {
            rewardedActivity.campaign = campaign.id;

            commit("RewardedActivity/setRewardedActivity", rewardedActivity, {
              root: true,
            });
          }
        );
      }

      return new ActionResponse(true, campaign.id);
    },
  },
};
