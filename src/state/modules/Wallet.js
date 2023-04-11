export default {
  namespaced: true,
  state: {
    wallets: [],
  },
  getters: {
    /**
     * @return {Wallet[]}
     */
    authUserWallets(state, getters, rootState, rootGetters) {
      if (!rootGetters["Auth/isLoggedIn"]) {
        return [];
      }

      return state.wallets.filter(
        (wallet) => (wallet.userId = rootState.Auth.user.id)
      );
    },
  },
  mutations: {
    /**
     * @param {object} state
     * @param {Wallet} wallet
     */
    addWallet(state, wallet) {
      state.wallets.push(wallet);
    },
  },
  actions: {},
};
