import Model from "@/state/models/Model";
import RewardedActivityDto from "@/common/dto/RewardedActivityDto.js";
import ActivityType from "@/common/ActivityType.js";
import ActivityAction from "@/common/ActivityAction.js";

export default class RewardedActivity extends Model {
  /**
   * @type {string|null}
   */
  activity = null;

  /**
   * @type {string|null}
   */
  action = null;

  /**
   * @type {BigInt}
   */
  minimumTransactionLimit = 0n;

  /**
   * @type {number}
   */
  minimumTransactionCount = 0;

  /**
   * @type {string|null}
   */
  campaign = null;

  /**
   * @type {ActivityType|null}
   */
  type;

  /**
   * @type {ActivityAction|null}
   */
  activityAction;

  /**
   * @param {RewardedActivityDto} dto
   * @return {RewardedActivity}
   */
  static fromDto(dto) {
    const rewardedActivity = new RewardedActivity();

    rewardedActivity.minimumTransactionLimit = BigInt(dto.minTrxLimit);
    rewardedActivity.minimumTransactionCount = dto.minTrxAmount;
    rewardedActivity.activity = dto.productActivity.id;
    rewardedActivity.action = dto.productActivityAction?.id || null;

    rewardedActivity.type =
      Object.values(ActivityType).find(
        (type) => type.getName() === dto.actionType
      ) || null;

    rewardedActivity.activityAction =
      Object.values(ActivityAction).find(
        (type) => type.getName() === dto.action
      ) || null;

    rewardedActivity.vault = dto.vault;
    rewardedActivity.minimumDepositLimit = dto.minimumDepositLimit;
    rewardedActivity.depositAmount = dto.depositAmount;
    rewardedActivity.newVaultsOnly = dto.newVaultsOnly;
    rewardedActivity.vaultCount = dto.vaultCount;
    rewardedActivity.holdingAmount = dto.holdingAmount;
    rewardedActivity.holdingPeriod = dto.holdingPeriod;
    rewardedActivity.useFiltering = dto.useFiltering;
    rewardedActivity.filteringType = dto.filteringType;

    return rewardedActivity;
  }

  /**
   * @returns {RewardedActivityDto}
   */
  toDto() {
    const dto = new RewardedActivityDto();

    dto.minTrxLimit = this.minimumTransactionLimit.toString();
    dto.minTrxAmount = this.minimumTransactionCount;
    dto.productActivity = this.activity;
    dto.productActivityAction = this.action;
    dto.actionType = this.type?.getName() || null;
    dto.action = this.activityAction?.getName() || null;

    dto.vault = this.vault;
    dto.minimumDepositLimit = this.minimumDepositLimit;
    dto.depositAmount = this.depositAmount;
    dto.newVaultsOnly = this.newVaultsOnly;
    dto.vaultCount = this.vaultCount;
    dto.holdingAmount = this.holdingAmount;
    dto.holdingPeriod = this.holdingPeriod;
    dto.useFiltering = this.useFiltering;
    dto.filteringType = this.filteringType;

    return dto;
  }
}
