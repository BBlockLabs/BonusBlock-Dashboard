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
   * @type {Map<String, Category>}
   */
  categories = new Map();
}

export default {
  namespaced: true,
  state: new CategoryState(),
  getters: {
    /**
     * @param state
     * @returns {function(string): Campaign | null}
     */
    getCategory: (state) => (categoryId) => {
      if (!state.categories.has(categoryId)) {
        return null;
      }

      return state.categories.get(categoryId);
    },
    /**
     * @param {CategoryState} state
     * @returns {function({query: string | undefined}): Category[]}
     */
    queryCategories:
      (state) =>
      ({ query }) => {
        const categories = [];

        state.categories.forEach((category) => {
          if (!query) {
            categories.push(category);
          }

          if (category.name.toLowerCase().includes(query)) {
            categories.push(category);
          }
        });

        return categories;
      },
  },
  mutations: {
    /**
     * @param {CategoryState} state
     * @param {Category} category
     */
    setCategory(state, category) {
      state.categories.set(category.id, category);
    },
  },
  actions: {
    /**
     * @param commit
     * @param getters
     * @param {string | undefined} query
     * @returns {Promise<ActionResponse>}
     */
    async queryCategories({ commit, getters }, { query }) {
      const currentCategoryList = getters.queryCategories(query);

      if (currentCategoryList.length >= 10) {
        return new ActionResponse(true, currentCategoryList);
      }

      await sleep(500);

      if (query === "fail") {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      const apiCategories = categoriesMock
        .filter(
          (mockCategory) =>
            !query ||
            mockCategory.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((mockCategory) => {
          const category = new Category();

          category.id = mockCategory.id;
          category.name = mockCategory.name;
          category.version = mockCategory.version;
          category.createdOn = moment(mockCategory.createdOn);
          category.modifiedOn = moment(mockCategory.modifiedOn);

          return category;
        });

      apiCategories.forEach((category) => {
        commit("setCategory", category);
      });

      return new ActionResponse(true, apiCategories);
    },
  },
};
