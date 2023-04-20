import ActionResponse from "@/common/ActionResponse";
import Network from "@/state/models/Network.js";
import { HttpRequest } from "@/common/HttpRequest.js";
import CategoriesNetworksResponse from "@/common/Http/CategoriesNetworksResponse.js";
import Category from "@/state/models/Category.js";

export class NetworkState {
  /**
   * @type {Map<String, Network>}
   */
  networks = new Map();
}

export default {
  namespaced: true,
  state: new NetworkState(),
  getters: {
    /**
     * @param state
     * @returns {function(string): Campaign | null}
     */
    getNetwork: (state) => (networkId) => {
      if (!state.networks.has(networkId)) {
        return null;
      }

      return state.networks.get(networkId);
    },
    /**
     * @param {NetworkState} state
     * @returns {function({query: string | undefined}): Network[]}
     */
    queryNetworks:
      (state) =>
      ({ query }) => {
        const networks = [];

        state.networks.forEach((network) => {
          if (!query) {
            networks.push(network);

            return;
          }

          if (network.name.toLowerCase().includes(query)) {
            networks.push(network);
          }
        });

        return networks;
      },
  },
  mutations: {
    /**
     * @param {NetworkState} state
     * @param {Network} network
     */
    setNetwork(state, network) {
      state.networks.set(network.id, network);
    },
  },
  actions: {
    async preloadNetworks({ commit }) {
      const response = await HttpRequest.makeRequest("get/categories-networks");

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      /**
       * @type {CategoriesNetworksResponse}
       */
      const payload = Object.assign(
        new CategoriesNetworksResponse(),
        response.payload
      );

      payload.networks.forEach((network) => {
        commit("setNetwork", Network.fromDto(network));
      });

      payload.categories.forEach((category) => {
        commit("Category/setCategory", Category.fromDto(category), {
          root: true,
        });
      });

      return new ActionResponse(true, null);
    },
  },
};
