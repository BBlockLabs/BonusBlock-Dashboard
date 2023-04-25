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
   * @type {string}
   */
  additionalRewardTransactionLimit = "";
  /**
   * @type {string}
   */
  minimumTransactionCount = "";
  /**
   * @type {string}
   */
  additionalRewardTransactionCount = "";

  /**
   * @param {RewardedActivity} rewardedActivity
   */
  setRewardedActivityValues(rewardedActivity) {
    rewardedActivity.activity = this.activity;
    rewardedActivity.action = this.action;

    rewardedActivity.minimumTransactionLimit = parseInt(
      this.minimumTransactionLimit
    );
    rewardedActivity.additionalRewardTransactionLimit = parseInt(
      this.additionalRewardTransactionLimit
    );
    rewardedActivity.minimumTransactionCount = parseInt(
      this.minimumTransactionCount
    );
    rewardedActivity.additionalRewardTransactionCount = parseInt(
      this.additionalRewardTransactionCount
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
    this.additionalRewardTransactionLimit =
      rewardedActivity.additionalRewardTransactionLimit.toString();
    this.minimumTransactionCount =
      rewardedActivity.minimumTransactionCount.toString();
    this.additionalRewardTransactionCount =
      rewardedActivity.additionalRewardTransactionCount.toString();
  }
}
