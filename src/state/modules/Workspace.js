import ActionResponse from "@/common/ActionResponse";
import Workspace from '@/state/models/Workspace';

const sleep = async (milliseconds) => {
  return new Promise(r => {
    window.setTimeout(r, milliseconds);
  });
};

export default {
  namespaced: true,
  state: {
    workspaces: [],
  },
  getters: {},
  mutations: {
    /**
     * @param {object} state
     * @param {Workspace} workspace
     */
    addWorkspace(state, workspace) {
      state.workspaces.push(workspace);
    },
  },
  actions: {
    /**
     * @param {function(String, any)} commit
     * @param {{icon: Blob, name: String}} workspaceData
     * @return {Promise<object>}
     */
    async createWorkspace({ commit }, workspaceData) {
      const workspace = new Workspace({
        id: crypto.randomUUID(),
        icon: workspaceData.icon,
        name: workspaceData.name,
      });

      await sleep(500);

      commit('addWorkspace', workspace);

      return new ActionResponse(true, workspace);
    },
  },
};
