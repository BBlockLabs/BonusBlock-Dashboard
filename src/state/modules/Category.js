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
            return;
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
};
