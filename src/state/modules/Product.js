import ActionResponse from "@/common/ActionResponse";
import Product from "@/state/models/Product.js";
import { HttpRequest } from "@/common/HttpRequest.js";

export class ProductState {
  /**
   * @type {Map<String, Product>}
   */
  products = new Map();
}

export default {
  namespaced: true,
  state: new ProductState(),
  getters: {
    /**
     * @param state
     * @returns {function(string): Campaign | null}
     */
    getProduct: (state) => (productId) => {
      if (!state.products.has(productId)) {
        return null;
      }

      return state.products.get(productId);
    },
    /**
     * @param {ProductState} state
     * @returns {function(query: ProductFilters): Product[]}
     */
    queryProducts: (state) => (query) => {
      const products = [];

      state.products.forEach((product) => {
        if (
          query.categoriesIds.length > 0 &&
          !product.categories.find((categoryId) =>
            query.categoriesIds.includes(categoryId)
          )
        ) {
          return;
        }

        if (
          query.networksIds.length > 0 &&
          !product.networks.find((networkId) =>
            query.networksIds.includes(networkId)
          )
        ) {
          return;
        }

        products.push(product);
      });

      return products;
    },
  },
  mutations: {
    /**
     * @param {ProductState} state
     * @param {Product} product
     */
    setProduct(state, product) {
      state.products.set(product.id, product);
    },
  },
  actions: {
    /**
     * @param commit
     * @param getters
     * @param {ProductFilters} query
     * @returns {Promise<ActionResponse>}
     */
    async queryProducts({ commit, getters }, query) {
      let response;
      try {
        response = await HttpRequest.makeRequest("get/products", query);
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      /**
       * @type {Array<ProductDto>}
       */
      const payload = response.payload;

      payload.forEach((productDto) => {
        commit("setProduct", Product.fromDto(productDto));
      });

      return new ActionResponse(true, getters["queryProducts"](query));
    },
  },
};
