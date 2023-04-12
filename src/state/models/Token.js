import Model from "@/state/models/Model";
import moment from "moment";

export default class Token extends Model {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  network;
}
