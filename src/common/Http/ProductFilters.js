export default class ProductFilters {
  /**
   * @type {Array<string>}
   */
  categoriesIds = [];
  /**
   * @type {Array<string>}
   */
  networksIds = [];

  /**
   * @param {Array<string>} categoriesIds
   * @param {Array<string>} networksIds
   */
  constructor(categoriesIds = [], networksIds = []) {
    this.categoriesIds = categoriesIds;
    this.networksIds = networksIds;
  }
}
