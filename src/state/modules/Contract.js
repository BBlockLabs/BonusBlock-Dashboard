import ActionResponse from "@/common/ActionResponse";
import Contract from "@/state/models/Contract.js";
import { HttpRequest } from "@/common/HttpRequest.js";
import Fee from "@/state/models/Fee.js";

export class ContractState {
  /**
   * @type {Map<string, Contract>}
   */
  contracts = new Map();
}

export default {
  namespaced: true,
  state: new ContractState(),
  getters: {
    /**
     * @param state
     * @returns {function(string): Contract | null}
     */
    getContract: (state) => (contractId) => {
      if (!state.contracts.has(contractId)) {
        return null;
      }

      return state.contracts.get(contractId);
    },
    /**
     * @param {ContractState} state
     * @returns {function(filterString: string): Array<Contract>}
     */
    queryContracts: (state) => (filterString) => {
      const cotnracts = [];

      state.contracts.forEach((contract) => {
        if (filterString && !contract.address.includes(filterString)) {
          return;
        }

        cotnracts.push(contract);
      });

      return cotnracts;
    },
  },
  mutations: {
    setContract(state, contract) {
      state.contracts.set(contract.id, contract);
    },
  },
  actions: {
    /**
     * @param commit
     * @param getters
     * @returns {Promise<ActionResponse>}
     */
    async preloadContracts({ commit }) {
      const response = await HttpRequest.makeRequest("get/reward-pools");

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      /**
       * @type {Array<ContractDto>}
       */
      const payload = response.payload;

      payload.forEach((contractDto) => {
        const contract = Contract.fromDto(contractDto);

        const fee = Fee.fromDto(contractDto.fee);

        fee.contract = contract.id;

        commit("setContract", contract);
        commit("Fee/setFee", fee, { root: true });
      });

      return new ActionResponse(true, null);
    },
  },
};
