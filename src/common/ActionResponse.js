export default class ActionResponse {
  /**
   * @type {boolean}
   */
  success = true;

  /**
   * @type {object|null}
   */
  data = null;

  /**
   * @type {object|null}
   */
  errors = null;

  /**
   * @param {boolean} success
   * @param {object|null} data
   * @param {object|null} errors
   */
  constructor(success, data, errors = null) {
    this.success = success;
    this.data = data;
    this.errors = errors;
  }
}
