import ActionResponse from "@/common/ActionResponse";
import { HttpRequest } from "@/common/HttpRequest.js";
import ConversionRate from "@/state/models/ConversionRate.js";

export class ConversionRateState {
  /**
   * @type {Map<string, ConversionRate>}
   */
  rates = new Map();

  constructor() {
    const rate = new ConversionRate();

    rate.from = "USD";
    rate.to = "USD";
    rate.rate = 1;
    rate.id = "USD";

    this.rates.set("USD", rate);
  }
}

export default {
  namespaced: true,
  state: new ConversionRateState(),
  getters: {
    /**
     * @param state
     * @returns {function(string): ConversionRate | null}
     */
    getRate: (state) => (rateId) => {
      if (!state.rates.has(rateId)) {
        return null;
      }

      return state.rates.get(rateId);
    },
    findPair: (state) => (denomFrom, denomTo) => {
      const from = denomFrom.toUpperCase();
      const to = denomTo.toUpperCase();

      for (const rate of state.rates.values()) {
        if (rate.from.toUpperCase() === from && rate.to.toUpperCase() === to) {
          return rate;
        }
      }

      return null;
    },
  },
  mutations: {
    /**
     * @param {ConversionRateState} state
     * @param {ConversionRate} rate
     */
    setRate(state, rate) {
      state.rates.set(rate.id, rate);
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
  },
  actions: {
    /**
     * @param commit
     * @param {String} denom
     * @return {Promise<ActionResponse>}
     */
    async loadConversionRate({ commit }, denom) {
      const response = await HttpRequest.makeRequest(
        `ticker-in-usd/${denom.toUpperCase()}`,
        null,
        "v1/rate"
      );

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      /**
       * @type {ConversionRateDto|null}
       */
      const payload = response.payload;

      if (payload === null) {
        return new ActionResponse(false, denom, "RATE_NOT_FOUND");
      }

      const rate = ConversionRate.fromDto(payload);

      commit("setRate", rate);

      return new ActionResponse(true, rate.id);
    },
  },
};
