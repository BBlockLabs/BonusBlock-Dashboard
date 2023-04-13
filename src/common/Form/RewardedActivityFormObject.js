import formObject from "@/common/Form/FormObject.js";

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
  minimumTransactionLimit = "";

  /**
   * @param {RewardedActivity} rewardedActivity
   */
  setRewardedActivityValues(rewardedActivity) {
    rewardedActivity.activity = this.activity;
    rewardedActivity.action = this.action;
    rewardedActivity.minimumTransactionLimit = parseInt(
      this.minimumTransactionLimit
    );
  }

  /**
   * @param {RewardedActivity} rewardedActivity
   */
  setValuesFromRewardedActivity(rewardedActivity) {
    this.activity = rewardedActivity.activity;
    this.action = rewardedActivity.action;
    this.minimumTransactionLimit =
      rewardedActivity.minimumTransactionLimit.toString();
  }
}
