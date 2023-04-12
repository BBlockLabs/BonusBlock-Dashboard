import moment from "moment";

export class Model {
  /**
   * @type {string}
   */
  id = "";

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
}

export default Model;
