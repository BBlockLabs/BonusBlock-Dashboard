import Model from "@/state/models/Model";

export default class Product extends Model {
  /**
   * @type {string}
   */
  id = "";
  /**
   * @type {string}
   */
  name = "";
  /**
   * @type {Array<string>}
   */
  categories = [];
  /**
   * @type {Array<string>}
   */
  networks = [];

  /**
   * @param {ProductDto} dto
   * @return {Product}
   */
  static fromDto(dto) {
    const product = new Product();

    product.id = dto.id;
    product.name = dto.name;
    product.categories = dto.categories?.map((category) => category.id) || [];
    product.networks = dto.networks?.map((network) => network.id) || [];

    return product;
  }
}
