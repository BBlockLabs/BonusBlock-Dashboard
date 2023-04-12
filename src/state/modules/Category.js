import ActionResponse from "@/common/ActionResponse";
import categoriesMock from "@/state/mock/category.json";
import Category from "@/state/models/Category.js";
import moment from "moment";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

export class CategoryState {
  /**
   * @type {Category[]}
   */
  categories = [];
}

export default {
  namespaced: true,
  state: new CategoryState(),
  getters: {
    /**
     * @param {CategoryState} state
     * @returns {function({query: string | undefined}): Category[]}
     */
    queryCategories: (state) => ({query}) => {
      let categories = state.categories;

      if (query) {
        query = query.toLowerCase();

        categories = categories.filter(category => category.name.toLowerCase().includes(query));
      }

      return categories;
    },
  },
  mutations: {
    /**
     * @param {CategoryState} state
     * @param {Category} category
     */
    addCategory(state, category) {
      const stateCategory = state.categories.find(stateCategory => stateCategory.id === category.id);

      if (stateCategory) {
        return;
      }

      state.categories.push(category);
    },
  },
  actions: {
    /**
     * @param {CategoryState} state
     * @param commit
     * @param getters
     * @param {string | undefined} query
     * @returns {Promise<ActionResponse>}
     */
    async queryCategories({state, commit, getters}, {query}) {
      const currentCategoryList = getters.queryCategories(query);

      if (currentCategoryList.length >= 10) {
        return new ActionResponse(true, currentCategoryList);
      }

      await sleep(500);

      if (query === 'fail') {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      const apiCategories = categoriesMock
        .filter((mockCategory) => !query || mockCategory.name.toLowerCase().includes(query.toLowerCase()))
        .map((mockCategory) => {
          const category = new Category();

          category.id = mockCategory.id;
          category.name = mockCategory.name;
          category.version = mockCategory.version;
          category.createdOn = moment(mockCategory.createdOn);
          category.modifiedOn = moment(mockCategory.modifiedOn);

          return category;
        });

      apiCategories.forEach(category => {
        commit('addCategory', category)
      });

      return new ActionResponse(true, apiCategories);
    },
  },
};
