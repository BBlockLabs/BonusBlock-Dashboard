import ActionResponse from "@/common/ActionResponse";
import User from "@/state/models/User";
import userMock from "@/state/mock/users.json";

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
