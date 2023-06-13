import formObject from "@/common/Form/FormObject.js";
import ActivityAction from "@/common/ActivityAction.js";
import RewardedActivityActionFormObject from "@/common/Form/RewardedActivityActionFormObject.js";

export default class RewardedActivityFormObject extends formObject {
  /**
   * @type {string | null}
   */
  activity = null;
  /**
   * @type {RewardedActivityActionFormObject[]}
   */
  actions = [];
  /**
   * @type {string}
   */
  minimumTransactionLimit = "0";

  /**
   * @type {ActivityType|null}
   */
  type = null;

  /**
   * @type {ActivityAction|null}
   */
  activityAction = ActivityAction.SWAP;

  /**
   * @type {boolean}
   */
  advanced = false;

  /**
   * @type {string}
   */
  vault = "";
  /**
   * @type {number}
   */
  minimumDepositLimit = 0;
  /**
   * @type {number}
   */
  depositAmount = 0;
  /**
   * @type {boolean}
   */
  newVaultsOnly = false;
  /**
   * @type {number}
   */
  vaultCount = 1;
  /**
   * @type {number}
   */
  holdingAmount = 0;
  /**
   * @type {number}
   */
  holdingPeriod = 1;
  /**
   * @type {boolean}
   */
  useFiltering = false;
  /**
   * @type {string}
   */
  filteringType = "";

  /**
   * @param {RewardedActivity[]} rewardedActivities
   */
  setRewardedActivityValues(rewardedActivities) {
    rewardedActivities.forEach((rewardedActivity, idx) => {
      rewardedActivity.activity = this.activity;
      rewardedActivity.type = this.type;
      rewardedActivity.activityAction = this.activityAction;

      if (this.actions[idx] !== undefined) {
        this.actions[idx].setRewardedActivityValues(rewardedActivity);
      } else {
        rewardedActivity.minimumTransactionLimit =
          this.minimumTransactionLimit !== null
            ? BigInt(this.minimumTransactionLimit)
            : BigInt(0);
      }
    });
  }

  /**
   * @param {RewardedActivity[]} rewardedActivities
   */
  setValuesFromRewardedActivity(rewardedActivities) {
    this.actions = [];

    for (const rewardedActivity of rewardedActivities) {
      this.activity = rewardedActivity.activity;
      this.type = rewardedActivity.type;
      this.activityAction = rewardedActivity.activityAction;

      if (rewardedActivity.action) {
        const action = new RewardedActivityActionFormObject();

        action.setValuesFromRewardedActivity(rewardedActivity);
        action.reset();

        this.actions.push(action);
      }
    }
  }
}
