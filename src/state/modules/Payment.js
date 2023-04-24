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
};
