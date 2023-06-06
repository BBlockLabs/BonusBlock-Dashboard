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
  },
  getters: {
    /**
     * @param {object} state
     * @return {Boolean}
     */
    isLoggedIn(state) {
      return state.user !== null;
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
  },
  actions: {
    /**
     * @param {function(String, any, any? )} commit
     * @param {{username: String, password: String}} loginData
     * @return {Promise<ActionResponse>}
     */
    async login({ commit }, loginData) {
      let response;
      try {
        response = await HttpRequest.makeRequest("auth/login", loginData);
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      const user = new User(response.payload.account);
      user.loginMethod = User.LOGIN_METHOD_PASSWORD;

      commit("setUser", user);
      if (response.payload.project && response.payload.project.title !== null) {
        commit("Project/setProject", response.payload.project, { root: true });
      }

      return new ActionResponse(true, user);
    },
    /**
     * @param {function(String, any)} context
     * @param {String} nonce
     * @return {Promise<*|boolean>}
     */
    async getTicket(context, nonce) {
      let response;
      try {
        response = await HttpRequest.makeRequest("auth/get-auth-ticket", {
          nonce: nonce,
        });
      } catch (e) {
        return false;
      }

      return response.payload;
    },
    /**
     * @param {function(String, any)} dispatch
     * @param {function(String, any, any? )} commit
     * @return {Promise<ActionResponse>}
     */
    async keplrLogin({ dispatch, commit }) {
      if (!window.keplr) {
        return new ActionResponse(
          false,
          "Keplr extension not reachable. Enable or install it first and reload the page.",
          "error"
        );
      }

      const keplr = window.keplr;
      const chainData = JSON.parse(
        import.meta.env.VITE_BONUSBLOCK_KEPLR_CONFIG
      );

      try {
        await keplr.experimentalSuggestChain(chainData);
        await keplr.enable(chainData.chainId);
      } catch (e) {
        console.error(e);
        return new ActionResponse(
          false,
          "Could not authorize against network",
          "error"
        );
      }

      const offlineSigner = await keplr.getOfflineSignerOnlyAmino(
        chainData.chainId
      );

      const accounts = await offlineSigner.getAccounts();

      if (accounts.length === 0) {
        return new ActionResponse(
          false,
          "Could not authorize against network",
          "error"
        );
      }

      const nonce = crypto.randomUUID();
      const ticket = await dispatch("getTicket", nonce);

      let signResponse;
      try {
        signResponse = await window.keplr.signAmino(
          chainData.chainId,
          accounts[0].address,
          new KeplrLoginSignDoc(
            chainData.chainId,
            chainData.currencies[0].coinMinimalDenom,
            ticket
          ),
          new LoginSignOptions()
        );
      } catch (e) {
        console.error(e);
        return new ActionResponse(false, e.toString(), "error");
      }

      const authData = {
        walletName: "keplr",
        signedObject: JSON.stringify(signResponse),
        nonce: nonce,
      };
      let response;
      try {
        response = await HttpRequest.makeRequest("auth/wallet", authData);
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      const user = new User(response.payload.account);
      user.loginMethod = User.LOGIN_METHOD_KEPLR;

      commit("setUser", user);
      if (response.payload.project && response.payload.project.title !== null) {
        commit("Project/setProject", response.payload.project, { root: true });
      }

      return new ActionResponse(true, user);
    },
    /**
     * @param {function(String, any)} dispatch
     * @param {function(String, any, any? )}commit
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
      let response;
      try {
        response = await HttpRequest.makeRequest("auth/wallet", authData);
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      const user = new User(response.payload.account);
      user.loginMethod = User.LOGIN_METHOD_METAMASK;

      commit("setUser", user);
      if (response.payload.project && response.payload.project.title !== null) {
        commit("Project/setProject", response.payload.project, { root: true });
      }

      return new ActionResponse(true, user);
    },
    /**
     * @param {function(String, any)} commit
     * @param {{username: String, password: String}} registrationData
     * @return {Promise<ActionResponse>}
     */
    async register({ commit }, registrationData) {
      let response;
      try {
        response = await HttpRequest.makeRequest(
            "auth/register",
            registrationData
        );
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      const user = new User(response.payload.account);
      user.loginMethod = User.LOGIN_METHOD_PASSWORD;

      commit("setUser", user);

      return new ActionResponse(true, user);
    },
    /**
     * @param {function(String, any, any? )} commit
     * @return {Promise<ActionResponse>}
     */
    async logout({ commit }) {
      let response;
      try {
        response = await HttpRequest.makeRequest("auth/logout");
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      commit("setUser", null);
      commit("Project/setProject", null, { root: true });
      commit("Campaign/clearCampaigns", null, { root: true });

      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpire");

      HttpRequest.setSession(null, null);

      return new ActionResponse(true, null);
    },
    /**
     * @param {function(String, any, any?)} commit
     * @param {any} state
     * @return {null}
     */
    async checkLocalStorageForSession({ commit, state }) {
      const token = localStorage.getItem("token");
      const tokenExpire = localStorage.getItem("tokenExpire");

      if (token == null || tokenExpire == null) {
        return;
      }

      const expireMoment = moment(tokenExpire);

      if (expireMoment.isBefore(moment())) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpire");

        return;
      }

      if (state.user !== null) {
        return;
      }

      HttpRequest.setSession(token, expireMoment);

      let response;
      try {
        response = await HttpRequest.makeRequest("get-status");
      } catch (e) {
        return;
      }

      const user = new User(response.payload.account);

      user.loginMethod = User.LOGIN_METHOD_PASSWORD;

      commit("setUser", user);

      if (response.payload.project && response.payload.project.title !== null) {
        commit("Project/setProject", response.payload.project, { root: true });
      }
    },
  },
};
