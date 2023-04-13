import Model from "@/state/models/Model";

export default class Activity extends Model {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  hash;

  /**
   * @type {string}
   */
  product;

  /**
   * @type {Array<String>}
   */
  actions = [];
}
