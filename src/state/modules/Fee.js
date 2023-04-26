export class FeeState {
  /**
   * @type {Map<String, Fee>}
   */
  fees = new Map();
}

export default {
  namespaced: true,
  state: new FeeState(),
  getters: {
    /**
     * @param {FeeState} state
     * @returns {function(string): Fee | null}
     */
    getFee: (state) => (feeId) => {
      if (!state.fees.has(feeId)) {
        return null;
      }

      return state.fees.get(feeId);
    },
    getByContract: (state) => (contractId) => {
      const fees = [];

      state.fees.forEach((fee) => {
        if (fee.contract === contractId) {
          fees.push(fee);
        }
      });

      return fees;
    },
  },
  mutations: {
    /**
     * @param {FeeState} state
     * @param {Fee} fee
     */
    setFee(state, fee) {
      state.fees.set(fee.id, fee);
    },
  },
};
