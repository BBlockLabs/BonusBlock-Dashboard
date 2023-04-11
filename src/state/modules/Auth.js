import ActionResponse from "@/common/ActionResponse";
import User from '@/state/models/User';
import Wallet from '@/state/models/Wallet';
import userMock from '@/state/mock/users.json';
import walletMock from '@/state/mock/wallets.json';

const sleep = async (milliseconds) => {
  return new Promise(r => {
    window.setTimeout(r, milliseconds);
  });
};

export default {
  namespaced: true,
  state: {
    user: null,
    newUser: false,
  },
  getters: {
    /**
     * @param {object} state
     * @return {Boolean}
     */
    isLoggedIn(state) {
      return state.user !== null;
    },
    /**
     * @param {object} state
     * @return {Boolean}
     */
    isNew(state) {
      return state.user && state.newUser === true;
    },
  },
  mutations: {
    /**
     * @param {object} state
     * @param {User} user
     */
    setUser(state, user) {
      state.user = user;
    },
    /**
     * @param {object} state
     * @param {import('@/state/models/Deployment').Deployment} deployment
     */
    addDeployment(state, deployment) {
      state.user.deployments.push(deployment);
    }
  },
  actions: {
    /**
     * @param {function(String, any)} dispatch
     * @param {{username: String, password: String}} loginData
     * @return {Promise<ActionResponse>}
     */
    async login({ dispatch }, loginData) {
      const userData = userMock.find((user) => user.username ===  loginData.username && user.password === loginData.password);

      return dispatch('loginUser', userData);
    },
    /**
     * @param {function(String, any)} dispatch
     * @param {Number} ssoClient
     * @return {Promise<ActionResponse>}
     */
    async ssoLogin({ dispatch }, ssoClient) {
      const userData = userMock.find((user) => user.id === `user-${ssoClient}`);

      return dispatch('loginUser', userData);
    },
    /**
     * @param {function(String, any)} commit
     * @param {{username: String, password: String}} registrationData
     * @return {Promise<object>}
     */
    async register({ commit }, registrationData) {
      const user = new User({
        id: crypto.randomUUID(),
        username: registrationData.username,
        loginMethod: User.LOGIN_METHOD_PASSWORD,
      });

      const wallet = new Wallet({
        id: crypto.randomUUID(),
        userId: user.id,
        address: 'alter1p92n6tg2eldx9k4eh8plsnu37zvpgxvm7qr7v7',
        balance: 1500,
      });

      await sleep(1000);

      commit('setUser', user);
      commit('WalletModule/addWallet', wallet, {root: true});

      return new ActionResponse(true, user);
    },
    /**
     * @param {function(String, any)} commit
     * @param {Object} userData
     * @return {Promise<ActionResponse>}
     */
    async loginUser({commit}, userData) {
      if (!userData) {
        await sleep(500);

        return new ActionResponse(false, null);
      }

      const user = new User(userData);

      const userWallets = walletMock
        .filter(wallet => wallet.userId === user.id)
        .map(walletData => new Wallet(walletData));

      await sleep(250);

      commit('setUser', user);
      userWallets.forEach(wallet => commit('WalletModule/addWallet', wallet, {root: true}));

      return new ActionResponse(true, user);
    }
  },
};
