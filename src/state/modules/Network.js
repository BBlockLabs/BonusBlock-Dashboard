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
   * @type {Network[]}
   */
  networks = [];
}

export default {
  namespaced: true,
  state: new NetworkState(),
  getters: {
    /**
     * @param {NetworkState} state
     * @returns {function({query: string | undefined}): Network[]}
     */
    queryNetworks:
      (state) =>
      ({ query }) => {
        let networks = state.networks;

        if (query) {
          query = query.toLowerCase();

          networks = networks.filter((network) =>
            network.name.toLowerCase().includes(query)
          );
        }

        return networks;
      },
  },
  mutations: {
    /**
     * @param {NetworkState} state
     * @param {Network} network
     */
    addNetwork(state, network) {
      const stateNetwork = state.networks.find(
        (stateNetwork) => stateNetwork.id === network.id
      );

      if (stateNetwork) {
        return;
      }

      state.networks.push(network);
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
        commit("addNetwork", network);
      });

      return new ActionResponse(true, apiNetworks);
    },
  },
};
