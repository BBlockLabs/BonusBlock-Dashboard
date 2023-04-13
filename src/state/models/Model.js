import moment from "moment";

export class Model {
  static get TEMPORARY_PREFIX() {
    return "tmp_";
  }
  /**
   * @type {string}
   */
  id = `${Model.TEMPORARY_PREFIX}${crypto.randomUUID()}`;

  /**
   * @type {number}
   */
  version = 0;

  /**
   * @type {moment.Moment}
   */
  createdOn = moment();

  /**
   * @type {moment.Moment}
   */
  modifiedOn = moment();

  /**
   * @returns {string|null}
   */
  getId() {
    return !this.id.includes(Model.TEMPORARY_PREFIX) ? this.id : null;
  }
}

export default Model;
