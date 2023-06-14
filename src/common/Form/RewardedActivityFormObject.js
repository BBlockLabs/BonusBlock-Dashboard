import formObject from "@/common/Form/FormObject.js";
import ActivityAction from "@/common/ActivityAction.js";
import RewardedActivityActionFormObject from "@/common/Form/RewardedActivityActionFormObject.js";
import moment from "moment";

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
   * @type {ContractType|null}
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
   * @type {string}
   */
  minimumDepositLimit = "0";
  /**
   * @type {string}
   */
  depositAmount = "0";
  /**
   * @type {boolean}
   */
  newVaultsOnly = false;
  /**
   * @type {string}
   */
  vaultCount = "1";
  /**
   * @type {string}
   */
  holdingAmount = "0";
  /**
   * @type {string}
   */
  holdingPeriod = "1";
  /**
   * @type {boolean}
   */
  useFiltering = false;
  /**
   * @type {string}
   */
  filteringType = "";
  /**
   * @type {Date|null}
   */
  preDate = null;
  /**
   * @type {Date|null}
   */
  postDate = null;

  /**
   * @param {RewardedActivity[]} rewardedActivities
   */
  setRewardedActivityValues(rewardedActivities) {
    rewardedActivities.forEach((rewardedActivity, idx) => {
      rewardedActivity.activity = this.activity;
      rewardedActivity.type = this.type;
      rewardedActivity.activityAction = this.activityAction;

      rewardedActivity.vault = this.vault;
      rewardedActivity.minimumDepositLimit = BigInt(this.minimumDepositLimit);
      rewardedActivity.depositAmount = BigInt(this.depositAmount);
      rewardedActivity.newVaultsOnly = this.newVaultsOnly;
      rewardedActivity.vaultCount = parseInt(this.vaultCount);
      rewardedActivity.holdingAmount = BigInt(this.holdingAmount);
      rewardedActivity.holdingPeriod = parseInt(this.holdingPeriod);
      rewardedActivity.useFiltering = this.useFiltering;
      rewardedActivity.filteringType = this.filteringType;
      rewardedActivity.preDate = this.preDate ? moment(this.preDate) : null;
      rewardedActivity.postDate = this.postDate ? moment(this.postDate) : null;

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

      this.vault = rewardedActivity.vault;
      this.minimumDepositLimit = rewardedActivity.minimumDepositLimit?.toString();
      this.depositAmount = rewardedActivity.depositAmount?.toString();
      this.newVaultsOnly = rewardedActivity.newVaultsOnly;
      this.vaultCount = rewardedActivity.vaultCount?.toString();
      this.holdingAmount = rewardedActivity.holdingAmount?.toString();
      this.holdingPeriod = rewardedActivity.holdingPeriod?.toString();
      this.useFiltering = rewardedActivity.useFiltering;
      this.filteringType = rewardedActivity.filteringType;
      this.preDate = rewardedActivity.preDate ? rewardedActivity.preDate.toDate() : null;
      this.postDate = rewardedActivity.postDate ? rewardedActivity.postDate.toDate() : null;

      if (rewardedActivity.action) {
        const action = new RewardedActivityActionFormObject();

        action.setValuesFromRewardedActivity(rewardedActivity);
        action.reset();

        this.actions.push(action);
      }
    }
  }
}
