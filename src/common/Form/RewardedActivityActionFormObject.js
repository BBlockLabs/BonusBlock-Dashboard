import formObject from "@/common/Form/FormObject.js";

export default class RewardedActivityActionFormObject extends formObject {
  /**
   * @type {string}
   */
  id;

  /**
   * @type {string | null}
   */
  minimumTransactionLimit = null;

  /**
   * @type {string | null}
   */
  minimumTransactionCount = null;

  /**
   * @param {RewardedActivity} rewardedActivity
   */
  setRewardedActivityValues(rewardedActivity) {
    rewardedActivity.action = this.id;
    rewardedActivity.minimumTransactionLimit = this.minimumTransactionLimit !== null
      ? BigInt(
        this.minimumTransactionLimit
      )
      : BigInt(0);
    rewardedActivity.minimumTransactionCount = this.minimumTransactionCount;
  }

  /**
   * @param {RewardedActivity} rewardedActivity
   */
  setValuesFromRewardedActivity(rewardedActivity) {
    this.id = rewardedActivity.action;

    if (rewardedActivity.minimumTransactionLimit === 0n) {
      this.minimumTransactionLimit = null;
    } else {
      this.minimumTransactionLimit =
        rewardedActivity.minimumTransactionLimit.toString();
    }

    if (rewardedActivity.minimumTransactionCount === 0) {
      this.minimumTransactionCount = null;
    } else {
      this.minimumTransactionCount = rewardedActivity.minimumTransactionCount;
    }
  }
}
