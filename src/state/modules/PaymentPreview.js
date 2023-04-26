import { HttpRequest } from "@/common/HttpRequest.js";
import PaymentPreview from "@/state/models/PaymentPreview.js";
import ActionResponse from "@/common/ActionResponse.js";

export class PaymentPreviewState {
  /**
   * @type {Map<String, PaymentPreview>}
   */
  paymentPreviews = new Map();
}

export default {
  namespaced: true,
  state: new PaymentPreviewState(),
  getters: {
    /**
     * @param {PaymentPreviewState} state
     * @returns {function(string): PaymentPreview | null}
     */
    getPaymentPreview: (state) => (paymentPreviewId) => {
      if (!state.paymentPreviews.has(paymentPreviewId)) {
        return null;
      }

      return state.paymentPreviews.get(paymentPreviewId);
    },
  },
  mutations: {
    /**
     * @param {PaymentPreviewState} state
     * @param {PaymentPreview} paymentPreview
     */
    setPaymentPreview(state, paymentPreview) {
      state.paymentPreviews.set(paymentPreview.id, paymentPreview);
    },
  },
  actions: {
    async loadCampaignPaymentPreview({ commit }, campaignId) {
      const response = await HttpRequest.makeRequest(
        `campaign/${campaignId}/payment-preview`
      );

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      /**
       * @type {PaymentPreviewDto}
       */
      const payload = response.payload;

      const paymentPreview = PaymentPreview.fromDto(payload);

      paymentPreview.id = campaignId;

      commit("setPaymentPreview", paymentPreview);

      return new ActionResponse(true, null);
    },
  },
};
