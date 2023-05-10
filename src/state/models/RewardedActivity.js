import Model from "@/state/models/Model";
import RewardedActivityDto from "@/common/dto/RewardedActivityDto.js";

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
   * @param {RewardedActivityDto} dto
   * @return {RewardedActivity}
   */
  static fromDto(dto) {
    const rewardedActivity = new RewardedActivity();

    rewardedActivity.minimumTransactionLimit = BigInt(dto.minTrxLimit);
    rewardedActivity.minimumTransactionCount = dto.minTrxAmount;
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
    dto.minTrxAmount = this.minimumTransactionCount;
    dto.productActivityAction = this.action;

    return dto;
  }
}
