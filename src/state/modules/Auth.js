import ActionResponse from "@/common/ActionResponse";
import User from "@/state/models/User";
import userMock from "@/state/mock/users.json";
import detectEthereumProvider from "@metamask/detect-provider";
import { MetamaskClient } from "@/common/MetamaskClient.js";
import KeplrLoginSignDoc, {
  LoginSignOptions,
} from "@/common/KeplrLoginSignDoc.js";

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
    },
  },
  actions: {
    /**
     * @param {function(String, any)} commit
     * @param {{username: String, password: String}} loginData
     * @return {Promise<ActionResponse>}
     */
    async login({ commit }, loginData) {
      console.log(loginData);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          body: JSON.stringify(loginData),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
      const jsonData = await response.json();

      if (!response.ok) {
        return new ActionResponse(false, jsonData.errors);
      }

      if (!jsonData.payload || !jsonData.payload.account) {
        return new ActionResponse(false, null);
      }

      const user = new User(jsonData.payload.account);
      user.loginMethod = User.LOGIN_METHOD_PASSWORD;

      commit("setUser", user);

      return new ActionResponse(true, user);
    },
    async getTicket(context, nonce) {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/get-auth-ticket`,
        {
          body: JSON.stringify({ nonce: nonce }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
      const jsonData = await response.json();

      if (!jsonData.payload) {
        return false;
      }

      return jsonData.payload;
    },
    /**
     * @param {function(String, any)} dispatch
     * @param commit
     * @return {Promise<ActionResponse>}
     */
    async keplrLogin({ dispatch, commit }) {
      if (!window.keplr) {
        return new ActionResponse(
          false,
          "Keplr extension not reachable. Enable or install it first and reload the page."
        );
      }

      const keplr = window.keplr;

      try {
        await keplr.enable("pulsar-2");
      } catch (e) {
        return new ActionResponse(false, `Could not authorize against network`);
      }

      const offlineSigner = await keplr.getOfflineSignerOnlyAmino("pulsar-2");

      const accounts = await offlineSigner.getAccounts();

      if (accounts.length === 0) {
        return new ActionResponse(false, `Could not authorize against network`);
      }

      const nonce = crypto.randomUUID();
      const ticket = await dispatch("getTicket", nonce);

      let signResponse;
      try {
        signResponse = await window.keplr.signAmino(
          "pulsar-2",
          accounts[0].address,
          new KeplrLoginSignDoc("pulsar-2", "SCRT", ticket),
          new LoginSignOptions()
        );
      } catch (e) {
        if (e.message === "Request rejected") {
        } else {
          console.error(e);
        }
      }

      console.log(signResponse);

      const authData = {
        walletName: "keplr",
        signedObject: JSON.stringify(signResponse),
        nonce: nonce,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/wallet`,
        {
          body: JSON.stringify(authData),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
      const jsonData = await response.json();

      if (!response.ok) {
        return new ActionResponse(false, jsonData.errors);
      }

      if (!jsonData.payload || !jsonData.payload.account) {
        return new ActionResponse(false, null);
      }

      const user = new User(jsonData.payload.account);
      user.loginMethod = User.LOGIN_METHOD_PASSWORD;

      commit("setUser", user);

      return new ActionResponse(true, user);
    },
    /**
     * @param {function(String, any)} dispatch
     * @param commit
     * @return {Promise<ActionResponse>}
     */
    async metaMaskLogin({ dispatch, commit }) {
      const provider = await detectEthereumProvider({
        mustBeMetaMask: true,
        silent: true,
      });

      const accounts = await MetamaskClient.requestAccounts(provider);

      const nonce = crypto.randomUUID();
      const ticket = await dispatch("getTicket", nonce);

      const signedMessage = await MetamaskClient.signMessage(provider, [
        ticket,
        accounts[0],
      ]);

      const authData = {
        walletName: "metamask",
        signedObject: signedMessage,
        nonce: nonce,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/wallet`,
        {
          body: JSON.stringify(authData),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
      const jsonData = await response.json();

      if (!response.ok) {
        return new ActionResponse(false, jsonData.errors);
      }

      if (!jsonData.payload || !jsonData.payload.account) {
        return new ActionResponse(false, null);
      }

      const user = new User(jsonData.payload.account);
      user.loginMethod = User.LOGIN_METHOD_PASSWORD;

      commit("setUser", user);

      return new ActionResponse(true, user);
    },
    /**
     * @param {function(String, any)} dispatch
     * @param {Number} ssoClient
     * @return {Promise<ActionResponse>}
     */
    async ssoLogin({ dispatch }, ssoClient) {
      const userData = userMock.find((user) => user.id === `user-${ssoClient}`);

      return dispatch("loginUser", userData);
    },
    /**
     * @param {function(String, any)} commit
     * @param {{username: String, password: String}} registrationData
     * @return {Promise<ActionResponse>}
     */
    async register({ commit }, registrationData) {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          body: JSON.stringify(registrationData),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
      const jsonData = await response.json();

      if (!response.ok) {
        return new ActionResponse(false, jsonData.errors);
      }

      if (!jsonData.payload || !jsonData.payload.account) {
        return new ActionResponse(false, null);
      }

      const user = new User(jsonData.payload.account);
      user.loginMethod = User.LOGIN_METHOD_PASSWORD;

      commit("setUser", user);

      return new ActionResponse(true, user);
    },
  },
};
