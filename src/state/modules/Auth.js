import ActionResponse from "@/common/ActionResponse";
import User from "@/state/models/User";
import detectEthereumProvider from "@metamask/detect-provider";
import { MetamaskClient } from "@/common/MetamaskClient.js";
import KeplrLoginSignDoc, {
  LoginSignOptions,
} from "@/common/KeplrLoginSignDoc.js";
import { HttpRequest } from "@/common/HttpRequest.js";
import moment from "moment";

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
     * @param dispatch
     * @param {function(String, any)} commit
     * @param {{username: String, password: String}} loginData
     * @return {Promise<ActionResponse>}
     */
    async login({ commit }, loginData) {
      const response = await HttpRequest.makeRequest("auth/login", loginData);

      if (response.error) {
        return new ActionResponse(false, response.error);
      }

      const user = new User(response.payload.account);
      user.loginMethod = User.LOGIN_METHOD_PASSWORD;

      commit("setUser", user);

      return new ActionResponse(true, user);
    },
    async getTicket(context, nonce) {
      const response = await HttpRequest.makeRequest("auth/get-auth-ticket", {
        nonce: nonce,
      });

      if (response.error) {
        return false;
      }

      return response.payload;
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
        return new ActionResponse(false, "Could not authorize against network");
      }

      const offlineSigner = await keplr.getOfflineSignerOnlyAmino("pulsar-2");

      const accounts = await offlineSigner.getAccounts();

      if (accounts.length === 0) {
        return new ActionResponse(false, "Could not authorize against network");
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
        console.error(e);
        return new ActionResponse(false, e.toString());
      }

      const authData = {
        walletName: "keplr",
        signedObject: JSON.stringify(signResponse),
        nonce: nonce,
      };
      const response = await HttpRequest.makeRequest("auth/wallet", authData);

      if (response.error) {
        return new ActionResponse(false, response.errors);
      }

      const user = new User(response.payload.account);
      user.loginMethod = User.LOGIN_METHOD_KEPLR;

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
      const response = await HttpRequest.makeRequest("auth/wallet", authData);

      if (response.error) {
        return new ActionResponse(false, response.errors);
      }

      const user = new User(response.payload.account);
      user.loginMethod = User.LOGIN_METHOD_METAMASK;

      commit("setUser", user);

      return new ActionResponse(true, user);
    },
    /**
     * @param {function(String, any)} commit
     * @param {{username: String, password: String}} registrationData
     * @return {Promise<ActionResponse>}
     */
    async register({ commit }, registrationData) {
      const response = await HttpRequest.makeRequest(
        "auth/register",
        registrationData
      );

      if (response.error) {
        return new ActionResponse(false, response.errors);
      }

      const user = new User(response.payload.account);
      user.loginMethod = User.LOGIN_METHOD_PASSWORD;

      commit("setUser", user);

      return new ActionResponse(true, user);
    },
    /**
     * @param {function(String, any)} commit
     * @return {Promise<ActionResponse>}
     */
    async logout({ commit }) {
      const response = await HttpRequest.makeRequest("auth/logout");

      if (response.error) {
        return new ActionResponse(false, response.errors);
      }

      commit("setUser", null);

      await localStorage.removeItem("token");
      await localStorage.removeItem("tokenExpire");

      return new ActionResponse(true, null);
    },
    /**
     * @param {function(String, any)} commit
     * @return {null}
     */
    async checkLocalStorageForSession({ commit }) {
      const token = localStorage.getItem("token");
      const tokenExpire = localStorage.getItem("tokenExpire");

      if (token == null || tokenExpire == null) {
        return;
      }

      const expireMoment = moment(tokenExpire);
      if (!expireMoment.isBefore(moment())) {
        HttpRequest.setSession(token, expireMoment);
        const response = await HttpRequest.makeRequest("get-status");

        if (response.error) {
          return;
        }

        const user = new User(response.payload.account);
        user.loginMethod = User.LOGIN_METHOD_PASSWORD;

        commit("setUser", user);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpire");
      }
    },
  },
};
