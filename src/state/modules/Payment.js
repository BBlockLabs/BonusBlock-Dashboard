import { HttpRequest } from "@/common/HttpRequest.js";
import ActionResponse from "@/common/ActionResponse.js";

export class PaymentState {
  /**
   * @type {Map<String, Payment>}
   */
  payments = new Map();
}

export default {
  namespaced: true,
  state: new PaymentState(),
  getters: {
    /**
     * @param {PaymentState} state
     * @returns {function(string): Payment | null}
     */
    getPayment: (state) => (paymentId) => {
      if (!state.payments.has(paymentId)) {
        return null;
      }

      return state.payments.get(paymentId);
    },
    /**
     * @param {PaymentState} state
     * @return {function(string): Payment[]}
     */
    getByCampaign: (state) => (campaignId) => {
      const payments = [];

      for (const payment of state.payments.values()) {
        if (payment.campaignId === campaignId) {
          payments.push(payment);
        }
      }

      return payments;
    },
  },
  mutations: {
    /**
     * @param {PaymentState} state
     * @param {Payment} payment
     */
    setPayment(state, payment) {
      state.payments.set(payment.id, payment);
    },
    /**
     * @param {PaymentState} state
     * @param {string} paymentId
     */
    removePayment(state, paymentId) {
      state.payments.remove(paymentId);
    },
  },
  actions: {
    /**
     * @param getters
     * @param commit
     * @param {string} campaignId
     * @param {string} paymentId
     * @return {Promise<ActionResponse>}
     */
    async getPaymentInfo({ getters, commit }, { campaignId, paymentId }) {
      const payment = getters["getPayment"](paymentId);

      if (!payment) {
        return new ActionResponse(false, null, "PAYMENT_NOT_FOUND");
      }

      let response;
      try {
        response = await HttpRequest.makeRequest(
            `campaign/${campaignId}/payment-info`
        );
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      /**
       * @type {PaymentDto}
       */
      const payload = response.payload;

      payment.status = payload.status;

      commit("setPayment", payment);

      return new ActionResponse(true, null);
    },
  },
};
