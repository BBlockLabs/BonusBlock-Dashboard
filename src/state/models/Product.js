import Model from "@/state/models/Model";

export default class Product extends Model {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  networkId;

  /**
   * @type {Array<String>}
   */
  categories = [];
}
