import ActionResponse from "@/common/ActionResponse";
import Contract from "@/state/models/Contract.js";
import { HttpRequest } from "@/common/HttpRequest.js";
import Fee from "@/state/models/Fee.js";

export class ContractState {
  /**
   * @type {Map<string, Contract>}
   */
  contracts = new Map();

  constructor() {
    const usd = new Contract();

    usd.denom = "$";
    usd.decimalSpaces = 2;
    usd.title = "Dollars";
    usd.id = "USD";
    usd.currencyName = "$";

    this.contracts.set("USD", usd);
  }
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

      filterString = filterString.toLowerCase();
      state.contracts.forEach((contract) => {
        if (contract.id === "USD") {
          return;
        }

        if (
          filterString &&
          !contract.title.toLowerCase().includes(filterString)
        ) {
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
      let response;
      try {
        response = await HttpRequest.makeRequest("get/reward-pools");
      } catch (e) {
        return new ActionResponse(false, null, e);
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
