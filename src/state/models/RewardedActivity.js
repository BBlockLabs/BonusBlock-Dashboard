import Model from "@/state/models/Model";

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
