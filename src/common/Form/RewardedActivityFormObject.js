import formObject from "@/common/Form/FormObject.js";
import ActivityAction from "@/common/ActivityAction.js";

export default class RewardedActivityFormObject extends formObject {
  /**
   * @type {string | null}
   */
  activity = null;
  /**
   * @type {string | null}
   */
  action = null;
  /**
   * @type {string}
   */
  minimumTransactionLimit = "0";
  /**
   * @type {number}
   */
  minimumTransactionCount = 0;

  /**
   * @type {ActivityType|null}
   */
  type = null;

  /**
   * @type {ActivityAction|null}
   */
  activityAction = ActivityAction.SWAP;

  /**
   * @param {RewardedActivity} rewardedActivity
   */
  setRewardedActivityValues(rewardedActivity) {
    rewardedActivity.activity = this.activity;
    rewardedActivity.action = this.action;
    rewardedActivity.minimumTransactionLimit = BigInt(
      this.minimumTransactionLimit
    );
    rewardedActivity.minimumTransactionCount = this.minimumTransactionCount;
    rewardedActivity.type = this.type;
    rewardedActivity.activityAction = this.activityAction;
  }

  /**
   * @param {RewardedActivity} rewardedActivity
   */
  setValuesFromRewardedActivity(rewardedActivity) {
    this.activity = rewardedActivity.activity;
    this.action = rewardedActivity.action;
    this.minimumTransactionLimit =
      rewardedActivity.minimumTransactionLimit.toString();
    this.minimumTransactionCount = rewardedActivity.minimumTransactionCount;
    this.type = rewardedActivity.type;
    this.activityAction = rewardedActivity.activityAction;
  }
}
