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
      Object.values(ActivityType).find((type) => type.getName() === dto.actionType) ||
      null;

    rewardedActivity.activityAction =
      Object.values(ActivityAction).find((type) => type.getName() === dto.action) ||
      null;

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

    return dto;
  }
}
