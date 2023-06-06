import ActionResponse from "@/common/ActionResponse";
import { HttpRequest } from "@/common/HttpRequest";
import ConversionRate from "@/state/models/ConversionRate";
import CachedRequest from "@/common/CachedRequest";

export class ConversionRateState {
  /**
   * @type {Map<string, ConversionRate>}
   */
  rates = new Map();
  minRewardPoolAmount = 500;

  constructor() {
    const rate = new ConversionRate();

    rate.from = "USD";
    rate.to = "USD";
    rate.rate = 1;
    rate.id = "USD";

    this.rates.set("USD-USD", rate);
  }
}

export default {
  namespaced: true,
  state: new ConversionRateState(),
  getters: {
    findPair: (state) => (denomFrom, denomTo) => {
      const from = denomFrom.toUpperCase();
      const to = denomTo.toUpperCase();
      if (!state.rates.has(from + "-" + to)) {
        return null;
      }
      return state.rates.get(from + "-" + to);
    },
    getMinRewardPoolAmount: (state) => () => {
      return state.minRewardPoolAmount;
    },
  },
  mutations: {
    /**
     * @param {ConversionRateState} state
     * @param {ConversionRate} rate
     */
    setRate(state, params) {
      state.rates.set(params.key, params.value);
    },
    /**
     * @param {ConversionRateState} state
     * @param {string} rateId
     */
    removeConversionRate(state, rateId) {
      if (!state.rates.has(rateId)) {
        return;
      }

      state.rates.delete(rateId);
    },
    /**
     * @param {ConversionRateState} state
     * @param {number} amount
     */
    setMinRewardPoolAmount(state, amount) {
      state.minRewardPoolAmount = amount;
    },
  },
  actions: {
    /**
     * @param commit
     * @param {String} denom
     * @return {Promise<ActionResponse>}
     */
    loadConversionRate({ commit }, denom) {
      const conversionRatePromise = CachedRequest.query("loadConversionRate/" + denom, () => HttpRequest.makeRequest(
          `ticker-in-usd/${denom.toUpperCase()}`,
          null,
          "v1/rate"
      ), 1, "minutes").then((response) => {
        if (response.payload === null) {
          throw new Error("Missing rate");
        }
        const rate = ConversionRate.fromDto(response.payload);
        commit("setRate", {
          key: rate.from.toUpperCase() + "-" + rate.to.toUpperCase(),
          value: rate
        });
        return rate;
      }).catch((e) => {
        commit("setRate", {
          key: denom.toUpperCase() + "-" + "USD",
          value: false
        });
        return Promise.reject(e)
      });

      const minAmountPromise = CachedRequest.query("loadConversionRate/min-reward-pool-amount", () => HttpRequest.makeRequest(
          "min-reward-pool-amount",
          null,
          "v1/rate"
      ), 1, "minutes").then((response) => {
        commit("setMinRewardPoolAmount", response.payload);
      });

      return Promise.all([conversionRatePromise, minAmountPromise]).then((ret) => {
        new ActionResponse(true, ret[0]);
      }).catch(() => {
        new ActionResponse(false, null);
      });
    },
  },
};
