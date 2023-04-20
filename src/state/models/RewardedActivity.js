import Model from "@/state/models/Model";
import moment from "moment";
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
   * @type {number}
   */
  minumumTransactionLimit = 0;

  /**
   * @type {number}
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
   * @type {number}
   */
  minimumTransactionLimit = 0;

  /**
   * @type {string}
   */
  campaign = null;

  /**
   * @param {RewardedActivityDto} rewardedActivityDto
   * @return {RewardedActivity}
   */
  static fromDto(rewardedActivityDto) {
    const rewardedActivity = new RewardedActivity();

    rewardedActivity.id = rewardedActivityDto.id;
    rewardedActivity.version = parseInt(rewardedActivityDto.version);
    rewardedActivity.createdOn = moment(rewardedActivityDto.createdOn);
    rewardedActivity.modifiedOn = moment(rewardedActivityDto.modifiedOn);
    rewardedActivity.activity = rewardedActivityDto.activity;
    rewardedActivity.action = rewardedActivityDto.action;
    rewardedActivity.minimumTransactionLimit = parseInt(
      rewardedActivityDto.minimumTransactionLimit
    );

    return rewardedActivity;
  }

  /**
   * @returns {RewardedActivityDto}
   */
  toDto() {
    const dto = new RewardedActivityDto();

    dto.id = this.getId();
    dto.version = this.version.toString();
    dto.createdOn = this.createdOn.toISOString();
    dto.modifiedOn = this.modifiedOn.toISOString();
    dto.activity = this.activity;
    dto.action = this.action;
    dto.minimumTransactionLimit = this.minimumTransactionLimit.toString();

    return dto;
  }
}
