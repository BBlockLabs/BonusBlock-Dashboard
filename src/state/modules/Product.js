import ActionResponse from "@/common/ActionResponse";
import productsMock from "@/state/mock/product.json";
import Product from "@/state/models/Product.js";
import moment from "moment";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

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
     * @returns {function({query: string | undefined}): Product[]}
     */
    queryProducts:
      (state) =>
      ({ query }) => {
        const products = [];

        state.products.forEach((product) => {
          if (!query) {
            products.push(product);
            return;
          }

          if (product.name.toLowerCase().includes(query)) {
            products.push(product);
          }
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
     * @param {string | undefined} query
     * @param {string | undefined} network
     * @param {Array<string> | undefined} categories
     * @returns {Promise<ActionResponse>}
     */
    async queryProducts({ commit, getters }, { query, network, categories }) {
      const currentProductList = getters.queryProducts(query);

      if (currentProductList.length >= 10) {
        return new ActionResponse(true, currentProductList);
      }

      await sleep(500);

      if (query === "fail") {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      const apiProducts = productsMock
        .filter(
          (mockProduct) =>
            !query ||
            mockProduct.name.toLowerCase().includes(query.toLowerCase())
        )
        .filter((mockProduct) => !network || mockProduct.network === network)
        .filter(
          (mockProduct) =>
            !categories ||
            categories.length === 0 ||
            mockProduct.categories.find((cat) => categories.includes(cat))
        )
        .map((mockProduct) => {
          const product = new Product();

          product.id = mockProduct.id;
          product.name = mockProduct.name;
          product.network = mockProduct.network;
          product.categories = mockProduct.categories;
          product.version = mockProduct.version;
          product.createdOn = moment(mockProduct.createdOn);
          product.modifiedOn = moment(mockProduct.modifiedOn);

          return product;
        });

      apiProducts.forEach((product) => {
        commit("setProduct", product);
      });

      return new ActionResponse(true, apiProducts);
    },
  },
};
