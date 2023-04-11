import organizationMock from '@/state/mock/organizations.json';
import serverMock from '@/state/mock/servers.json';
import Organization from "@/state/models/Organization";
import ActionResponse from "@/common/ActionResponse";

const sleep = async (milliseconds) => {
  return new Promise(r => {
    window.setTimeout(r, milliseconds);
  });
};

export class OrganizationState {
  /**
   * @type {Organization[]}
   */
  organizations = [];
}

export default {
  namespaced: true,
  state: new OrganizationState(),
  getters: {
    /**
     * @param {OrganizationState} state
     * @return {function(String): Organization|null}
     */
    findById: (state) => (id) => {
      return state.organizations.find(organization => organization.id === id) || null;
    },
  },
  mutations: {
    /**
     * @param {OrganizationState} state
     * @param {Organization} organizationInstance
     */
    addOrganization(state, organizationInstance) {
      const existingOrganization = state.organizations.find(stateOrganization => stateOrganization.id === organizationInstance.id);

      if (existingOrganization) {
        Object.assign(existingOrganization, organizationInstance);
      } else {
        state.organizations.push(organizationInstance);
      }
    }
  },
  actions: {
    async loadAllOrganizations({commit}) {
      const organizations = organizationMock.map(organizationData => new Organization(organizationData));
      // better way?
      organizations.map(organizationData => organizationData.serversCount = serverMock.filter(server => server.organizationId === organizationData.id)?.length);

      await sleep(500);

      organizations.forEach(organizationInstance => commit('addOrganization', organizationInstance));

      return new ActionResponse(true, organizations);
    },
    async loadOrganizationById({commit}, organizationId) {
      const organizationData = organizationMock.find(organizationData => organizationData.id === organizationId) || null;

      if (organizationData === null) {
        return new ActionResponse(false, null, ['ORGANIZATION_NOT_FOUND']);
      }

      organizationData.serversCount = serverMock.filter(server => server.organizationId === organizationId)?.length;
      const organization = new Organization(organizationData);

      await sleep(500);

      commit('addOrganization', organizationData);

      return new ActionResponse(true, organization);
    },
  }
};
