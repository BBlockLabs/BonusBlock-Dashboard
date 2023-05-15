export default class ActivityDto {
  /**
   * @type {string}
   */
  id = "";
  /**
   * @type {string}
   */
  address = "";
  /**
   * @type {string}
   */
  name = "";
  /**
   * @type {Array<ActionDto>}
   */
  actions = [];

  /**
   * @type {"TYPE_DEX" | "TYPE_POOL" | "TYPE_ROUTER"}
   */
  type = "TYPE_DEX";
}
