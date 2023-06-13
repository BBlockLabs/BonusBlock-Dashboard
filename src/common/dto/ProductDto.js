export class ProductDto {
  /**
   * @type {string}
   */
  id = "";
  /**
   * @type {string}
   */
  name = "";
  /**
   * @type {Array<CategoryDto> | undefined}
   */
  categories;
  /**
   * @type {Array<NetworkDto> | undefined}
   */
  networks;
  /**
   * @type {Array<String> | undefined}
   */
  actions;
}
