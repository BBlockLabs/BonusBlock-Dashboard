import ActionResponse from "@/common/ActionResponse";
import Package from '@/state/models/Package';
import PackageFilter from "@/common/PackageFilter";
import Server from "@/state/models/Server";
import packageMock from '@/state/mock/packages.json';
import serverMock from '@/state/mock/servers.json';
import packageFiltersMock from "@/state/mock/package_filters.json";

const sleep = async (milliseconds) => {
  return new Promise(r => {
    window.setTimeout(r, milliseconds);
  });
};

export class PackageState {
  /**
   * @type {Package[]}
   */
  packages = [];

  filterOptions = packageFiltersMock;
}

export default {
  namespaced: true,
  state: new PackageState(),
  getters: {
    /**
     * @param {PackageState} state
     * @return {function(String): Package|null}
     */
    findById: (state) => (id) => {
      return state.packages.find(packageInstance => packageInstance.id === id) || null;
    },
    /**
     * @param {PackageState} state
     * @param {any} getters
     * @param {any} rootState
     * @param {any} rootGetters
     * @return {(function(filter: PackageFilter))| Package[]}
     */
    filteredPackages: (state, getters, rootState, rootGetters) => (filters) => {
      return state.packages.filter((packageInstance) => {
        if (filters.endorsement !== null) {

          if (
            filters.endorsement === PackageFilter.ENDORSEMENT_RECOMMENDED
            && packageInstance.server.totalLeases <= 200
          ) {
            return false;
          }

          if (
            filters.endorsement === PackageFilter.ENDORSEMENT_OTHER
            && packageInstance.server.totalLeases > 200
          ) {
            return false;
          }
        }

        // filters
        if (
          filters.prices.length > 0
          && (
            filters.priceUHost[0] > packageInstance.priceUHost
            || filters.priceUHost[1] < packageInstance.priceUHost
          )
        ) {
          return false;
        }

        if (filters.region.length > 0 && filters.region.includes(packageInstance.server.location.country) === false) {
          return false;
        }

        if (filters.features.length > 0 && filters.features.filter(value => packageInstance.features.includes(value))?.length === 0) {
          return false;
        }

        if (filters.cpuName !== '' && packageInstance.server.cpuName.toLowerCase().indexOf(filters.cpuName) === -1) {
          return false;
        }

        if (
          filters.cpuCount.length > 0
          && (
            filters.cpuCount[0] > packageInstance.cpuCount
            || filters.cpuCount[1] < packageInstance.cpuCount
          )
        ) {
          return false;
        }

        if (
          filters.cpuCores.length > 0
          && (
            filters.cpuCores[0] > packageInstance.cpuCoreCount
            || filters.cpuCores[1] < packageInstance.cpuCoreCount
          )
        ) {
          return false;
        }

        if (
          filters.cpuSpeed.length > 0
          && (
            filters.cpuSpeed[0] > packageInstance.cpuGHz
            || filters.cpuSpeed[1] < packageInstance.cpuGHz
          )
        ) {
          return false;
        }

        if (
          filters.ramAmount.length > 0
          && (
            filters.ramBytes[0] > packageInstance.ramBytes
            || filters.ramBytes[1] < packageInstance.ramBytes
          )
        ) {
          return false;
        }

        if (
          filters.storageAmount.length > 0
          && (
            filters.storageBytes[0] > packageInstance.storageBytes
            || filters.storageBytes[1] < packageInstance.storageBytes
          )
        ) {
          return false;
        }

        if (filters.storageType.length > 0 && filters.storageType.filter(value => packageInstance.server.storageDriveType.includes(value))?.length === 0) {
          return false;
        }

        return true;
      });
    }
  },
  mutations: {
    /**
     * @param {PackageState} state
     * @param {Package} packageInstance
     */
    addPackage(state, packageInstance) {
      state.packages.push(packageInstance);
    }
  },
  actions: {
    /**
     * @param {function(String, any)} commit
     * @return {Promise<ActionResponse>}
     */
    async loadAllPackages({ commit }) {
      const servers = serverMock.map(serverData => new Server(serverData));
      const packages = packageMock.map(packageData => new Package(packageData));
      packages.map(packageData => packageData.server = servers.find(serverData => serverData.id === packageData.serverId));

      await sleep(500);

      packages.forEach(packageInstance => commit('addPackage', packageInstance));

      return new ActionResponse(true, packages);
    },
    async loadPackagesByServerId({ commit }, serverId) {
      const servers = serverMock.map(serverData => new Server(serverData));
      const packages = packageMock.filter(packageData => packageData.serverId === serverId).map(packageData => new Package(packageData));

      if (packages.length === 0) {
        return new ActionResponse(false, null, ['PACKAGES_NOT_FOUND']);
      }

      packages.map(packageData => packageData.server = servers.find(serverData => serverData.id === packageData.serverId));

      await sleep(500);

      packages.forEach(packageInstance => commit('addPackage', packageInstance));

      return new ActionResponse(true, packages);
    },
  },
};
