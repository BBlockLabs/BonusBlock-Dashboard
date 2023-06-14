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
   * @type {string|null}
   */
  minimumDepositLimit = "0";
  /**
   * @type {string|null}
   */
  depositAmount = "0";
  /**
   * @type {boolean}
   */
  newVaultsOnly = false;
  /**
   * @type {string|null}
   */
  vaultCount = "1";
  /**
   * @type {string|null}
   */
  holdingAmount = "0";
  /**
   * @type {string|null}
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
      rewardedActivity.minimumDepositLimit = this.minimumDepositLimit ? BigInt(this.minimumDepositLimit) : null;
      rewardedActivity.depositAmount = this.depositAmount ? BigInt(this.depositAmount) : null;
      rewardedActivity.newVaultsOnly = this.newVaultsOnly;
      rewardedActivity.vaultCount = this.vaultCount ? parseInt(this.vaultCount) : null;
      rewardedActivity.holdingAmount = this.holdingAmount ? BigInt(this.holdingAmount) : null;
      rewardedActivity.holdingPeriod = this.holdingPeriod ? parseInt(this.holdingPeriod) : null;
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
