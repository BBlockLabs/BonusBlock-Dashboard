import ActionResponse from "@/common/ActionResponse";
import networksMock from "@/state/mock/network.json";
import Network from "@/state/models/Network.js";
import moment from "moment";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

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
    /**
     * @param commit
     * @param getters
     * @param {string | undefined} query
     * @returns {Promise<ActionResponse>}
     */
    async queryNetworks({ commit, getters }, { query }) {
      const currentNetworkList = getters.queryNetworks(query);

      if (currentNetworkList.length >= 10) {
        return new ActionResponse(true, currentNetworkList);
      }

      await sleep(500);

      if (query === "fail") {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      const apiNetworks = networksMock
        .filter(
          (mockNetwork) =>
            !query ||
            mockNetwork.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((mockNetwork) => {
          const network = new Network();

          network.id = mockNetwork.id;
          network.name = mockNetwork.name;
          network.version = mockNetwork.version;
          network.createdOn = moment(mockNetwork.createdOn);
          network.modifiedOn = moment(mockNetwork.modifiedOn);

          return network;
        });

      apiNetworks.forEach((network) => {
        commit("setNetwork", network);
      });

      return new ActionResponse(true, apiNetworks);
    },
  },
};
