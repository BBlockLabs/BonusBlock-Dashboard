import Model from "@/state/models/Model";

export default class RewardedActivity extends Model {
  /**
   * @type {string}
   */
  activity = null;

  /**
   * @type {string}
   */
  action = null;

  /**
   * @type {number}
   */
  minimumTransactionLimit = 0;
}
