import serverMock from '@/state/mock/servers.json';
import organizationsMock from '@/state/mock/organizations.json';
import Server from "@/state/models/Server";
import Organization from "@/state/models/Organization";
import ActionResponse from "@/common/ActionResponse";

const sleep = async (milliseconds) => {
  return new Promise(r => {
    window.setTimeout(r, milliseconds);
  });
};

export class ServerState {
  /**
   * @type {Server[]}
   */
  servers = [];
}

export default {
  namespaced: true,
  state: new ServerState(),
  getters: {
    /**
     * @param {ServerState} state
     * @return {function(String): Server|null}
     */
    findById: (state) => (id) => {
      return state.servers.find(server => server.id === id) || null;
    },
  },
  mutations: {
    /**
     * @param {ServerState} state
     * @param {Server} server
     */
    setServer(state, server) {
      const existingServer = state.servers.find(stateServer => stateServer.id === server.id);

      if (existingServer) {
        Object.assign(existingServer, server);
      } else {
        state.servers.push(server);
      }
    },
  },
  actions: {
    async loadAllServers({ commit }) {
      const organizations = organizationsMock.map(organizationData => new Organization(organizationData));
      const servers = serverMock.map(serverData => new Server(serverData));
      servers.map(serversData => serversData.organization = organizations.find(organizationData => organizationData.id === serversData.organizationId));

      await sleep(500);

      servers.forEach(server => commit('setServer', server));

      return new ActionResponse(true, servers);
    },
    async loadServersByOrganization({commit}, organizationId) {
      const organizations = organizationsMock.map(organizationData => new Organization(organizationData));
      let servers = serverMock.filter(serverData => serverData.organizationId === organizationId).map(serverData => new Server(serverData));

      if (servers.length === 0) {
        return new ActionResponse(false, null, ['SERVERS_NOT_FOUND']);
      }

      servers.map(serverData => serverData.organization = organizations.find(organizationData => organizationData.id === serverData.organizationId));

      await sleep(500);

      servers.forEach(serverInstance => commit('setServer', serverInstance));

      return new ActionResponse(true, servers);
    },
    async loadServerById({commit}, serverId) {
      const serverData = serverMock.find(serverData => serverData.id === serverId) || null;

      if (serverData === null) {
        return new ActionResponse(false, null, ['SERVER_NOT_FOUND']);
      }

      const server = new Server(serverData);

      let organization = organizationsMock.find(organizationData => organizationData.id === server.organizationId);
      if(organization) {
        organization = new Organization(organization);
        server.organization = organization;
      }

      await sleep(500);

      commit('setServer', serverData);

      return new ActionResponse(true, server);
    },
  }
};
