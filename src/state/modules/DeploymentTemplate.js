import deploymentTemplateMock from "@/state/mock/deployment_templates.json";
import DeploymentTemplate from "@/state/models/DeploymentTemplate";
import ActionResponse from "@/common/ActionResponse";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

export class DeploymentTemplateState {
  /**
   * @type {DeploymentTemplate[]}
   */
  deploymentTemplates = [];
}

export default {
  namespaced: true,
  state: new DeploymentTemplateState(),
  getters: {
    /**
     * @param {DeploymentTemplateState} state
     * @return {function(String): DeploymentTemplate|null}
     */
    findById: (state) => (id) => {
      return (
        state.deploymentTemplates.find(
          (deploymentTemplate) => deploymentTemplate.id === id
        ) || null
      );
    },
  },
  mutations: {
    /**
     * @param {DeploymentTemplateState} state
     * @param {DeploymentTemplate} deploymentTemplateInstance
     */
    addDeploymentTemplate(state, deploymentTemplateInstance) {
      const existingDeploymentTemplate = state.deploymentTemplates.find(
        (stateDeploymentTemplate) =>
          stateDeploymentTemplate.id === deploymentTemplateInstance.id
      );

      if (existingDeploymentTemplate) {
        Object.assign(existingDeploymentTemplate, deploymentTemplateInstance);
      } else {
        state.deploymentTemplates.push(deploymentTemplateInstance);
      }
    },
  },
  actions: {
    async loadAllDeploymentTemplates({ commit }) {
      const deploymentTemplates = deploymentTemplateMock.map(
        (deploymentTemplateData) =>
          new DeploymentTemplate(deploymentTemplateData)
      );

      await sleep(500);

      deploymentTemplates.forEach((deploymentTemplateInstance) =>
        commit("addDeploymentTemplate", deploymentTemplateInstance)
      );

      return new ActionResponse(true, deploymentTemplates);
    },
    async loadDeploymentTemplateById({ commit }, deploymentTemplateId) {
      const deploymentTemplateData =
        deploymentTemplateMock.find(
          (deploymentTemplateData) =>
            deploymentTemplateData.id === deploymentTemplateId
        ) || null;

      if (deploymentTemplateData === null) {
        return new ActionResponse(false, null, [
          "DEPLOYMENT_TEMPLATE_NOT_FOUND",
        ]);
      }

      const deploymentTemplate = new DeploymentTemplate(deploymentTemplateData);

      await sleep(500);

      commit("addDeploymentTemplate", deploymentTemplateData);

      return new ActionResponse(true, deploymentTemplate);
    },
  },
};
