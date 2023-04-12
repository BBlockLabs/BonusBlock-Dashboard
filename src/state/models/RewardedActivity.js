import Model from "@/state/models/Model";
import moment from "moment";

export default class RewardedActivity extends Model {
  /**
   * @type {string}
   */
  productId;

  /**
   * @type {string}
   */
  activity;

  /**
   * @type {string}
   */
  action;

  /**
   * @type {number}
   */
  minimumTransactionLimit = 0;
}
