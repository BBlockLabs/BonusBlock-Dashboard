import Model from "@/state/models/Model";
import RewardedActivityDto from "@/common/dto/RewardedActivityDto.js";

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
   * @type {BigInt}
   */
  minimumTransactionLimit = 0;

  /**
   * @type {BigInt}
   */
  additionalRewardTransactionLimit = 0;

  /**
   * @type {number}
   */
  minimumTransactionCount = 0;

  /**
   * @type {number}
   */
  additionalRewardTransactionCount = 0;

  /**
   * @type {string}
   */
  campaign = null;

  /**
   * @param {RewardedActivityDto} dto
   * @return {RewardedActivity}
   */
  static fromDto(dto) {
    const rewardedActivity = new RewardedActivity();

    rewardedActivity.minimumTransactionLimit = BigInt(dto.minTrxLimit);
    rewardedActivity.additionalRewardTransactionLimit = BigInt(dto.addTrxLimit);
    rewardedActivity.minimumTransactionCount = dto.minTrxAmount;
    rewardedActivity.additionalRewardTransactionCount = dto.addTrxAmount;
    rewardedActivity.action =
      dto.productActivityAction?.id || dto.productActivityAction;

    return rewardedActivity;
  }

  /**
   * @returns {RewardedActivityDto}
   */
  toDto() {
    const dto = new RewardedActivityDto();

    dto.minTrxLimit = this.minimumTransactionLimit.toString();
    dto.addTrxLimit = this.additionalRewardTransactionLimit.toString();
    dto.minTrxAmount = this.minimumTransactionCount;
    dto.addTrxAmount = this.additionalRewardTransactionCount;
    dto.productActivityAction = this.action;

    return dto;
  }
}
