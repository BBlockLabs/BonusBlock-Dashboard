import ActionResponse from "@/common/ActionResponse";
import tokensMock from "@/state/mock/tokens.json";
import Token from "@/state/models/Token.js";
import moment from "moment";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

export class TokenState {
  /**
   * @type {Token[]}
   */
  tokens = [];
}

export default {
  namespaced: true,
  state: new TokenState(),
  getters: {
    /**
     * @param {TokenState} state
     * @returns {function({query: string | undefined, network: string | undefined}): Token[]}
     */
    queryTokens: (state) => ({query, network}) => {
      let tokens = state.tokens;

      if (query) {
        query = query.toLowerCase();

        tokens = tokens.filter(token => token.name.toLowerCase().includes(query));
      }

      if (network) {
        tokens = tokens.filter(token => token.network === network);
      }

      return tokens;
    },
  },
  mutations: {
    /**
     * @param {TokenState} state
     * @param {Token} token
     */
    addToken(state, token) {
      const stateToken = state.tokens.find(stateToken => stateToken.id === token.id);

      if (stateToken) {
        return;
      }

      state.tokens.push(token);
    },
  },
  actions: {
    /**
     * @param {TokenState} state
     * @param commit
     * @param getters
     * @param {string | undefined} query
     * @param {string | undefined} network
     * @returns {Promise<ActionResponse>}
     */
    async queryTokens({state, commit, getters}, {query, network}) {
      const currentTokenList = getters.queryTokens(query);

      if (currentTokenList.length >= 10) {
        return new ActionResponse(true, currentTokenList);
      }

      await sleep(500);

      if (query === 'fail') {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      const apiTokens = tokensMock
        .filter((mockToken) => !query || mockToken.name.toLowerCase().includes(query.toLowerCase()))
        .filter((mockToken) => !network || mockToken.network === network)
        .map((mockToken) => {
          const token = new Token();

          token.id = mockToken.id;
          token.name = mockToken.name;
          token.network = mockToken.network;
          token.version = mockToken.version;
          token.createdOn = moment(mockToken.createdOn);
          token.modifiedOn = moment(mockToken.modifiedOn);

          return token;
        });

      apiTokens.forEach(token => {
        commit('addToken', token)
      });

      return new ActionResponse(true, apiTokens);
    },
  },
};
