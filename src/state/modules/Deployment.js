import Deployment from '@/state/models/Deployment';

const sleep = async (milliseconds) => {
  return new Promise(r => {
    window.setTimeout(r, milliseconds);
  });
};

export default {
  namespaced: true,
  state: {
    /**
     * @type Deployment
     */
    newDeployment: null,
  },
  getters: {
    /**
     * @param {object} state
     * @return {string}
     */
    getSampleYamlTesting(state) {
      return 'doe: \"a deer, a female deer\"\n ray: \"a drop of golden sun\"\n pi: 3.14159\n xmas: true\n french-hens: 3\n calling-birds:\n   - huey\n   - dewey\n   - louie\n   - fred\n xmas-fifth-day:\n   calling-birds: four\n   french-hens: 3\n   golden-rings: 5\n   partridges:\n     count: 1\n     location: \"a pear tree\"\n   turtle-doves: two';
    },
    /**
     * @param {object} state
     * @return {Boolean}
     */
    isCreateDeployment(state) {
      return state.newDeployment !== null;
    },
    /**
     * @param {object} state
     * @return {import('@/state/models/Deployment').Deployment}
     */
    getNewDeployment(state) {
      return state.newDeployment;
    }
  },
  mutations: {
    /**
     * @param {object} state
     */
    createDeployment(state) {
      state.newDeployment = new Deployment();
    },
    /**
     * @param {object} state
     * @param {String} yaml
     */
    setYaml(state, yaml) {
      if(state.newDeployment === null) {
        this.createDeployment(state);
      }
      state.newDeployment.yaml = yaml;
    },
    /**
     * @param {object} state
     * @param {String} title
     */
    setTitle(state, title) {
      if(state.newDeployment === null) {
        this.createDeployment(state);
      }
      state.newDeployment.title = title;
    },
    /**
     * @param {object} state
     * @param {Array} packages
     */
    setPackages(state, packages) {
      if(state.newDeployment === null) {
        this.createDeployment(state);
      }
      state.newDeployment.packages = packages;
    }
  },
  actions: {
    async commitDeployment({commit, state}) {
      state.newDeployment = null;

      await sleep(1500);


    }
  },
};
