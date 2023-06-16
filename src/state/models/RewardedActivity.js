import Model from "@/state/models/Model";
import RewardedActivityDto from "@/common/dto/RewardedActivityDto.js";
import ContractType from "@/common/ContractType.js";
import ActivityAction from "@/common/ActivityAction.js";
import moment from "moment";

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
   * @type {ContractType|null}
   */
  type;

  /**
   * @type {ActivityAction|null}
   */
  activityAction;

  /**
   * @type {string}
   */
  vault = "";
  /**
   * @type {BigInt}
   */
  minimumDepositLimit = 0n;
  /**
   * @type {BigInt}
   */
  depositAmount = 0n;
  /**
   * @type {boolean}
   */
  newVaultsOnly = false;
  /**
   * @type {number}
   */
  vaultCount = 1;
  /**
   * @type {BigInt}
   */
  holdingAmount = 0n;
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
   * @type {Moment|null}
   */
  preDate = null;
  /**
   * @type {Moment|null}
   */
  postDate = null;

  /**
   * @param {RewardedActivityDto} dto
   * @return {RewardedActivity}
   */
  static fromDto(dto) {
    const rewardedActivity = new RewardedActivity();

    rewardedActivity.minimumTransactionLimit = dto.minTrxLimit !== null
      ? BigInt(dto.minTrxLimit)
      : 0n;
    rewardedActivity.minimumTransactionCount = dto.minTrxAmount !== null
      ? parseInt(dto.minTrxAmount)
      : 0;
    rewardedActivity.activity = dto.productActivity?.id || null;
    rewardedActivity.action = dto.productActivityAction?.id || null;

    rewardedActivity.type =
      Object.values(ContractType).find(
        (type) => type.getName() === dto.actionType
      ) || null;

    rewardedActivity.activityAction =
      Object.values(ActivityAction).find(
        (type) => type.getName() === dto.action
      ) || null;

    rewardedActivity.vault = dto.vault?.id || null;
    rewardedActivity.minimumDepositLimit = dto.minimumDepositLimit ? BigInt(dto.minimumDepositLimit) : null;
    rewardedActivity.depositAmount = dto.depositAmount ? BigInt(dto.depositAmount) : null;
    rewardedActivity.newVaultsOnly = dto.newVaultsOnly;
    rewardedActivity.vaultCount = dto.vaultCount;
    rewardedActivity.holdingAmount = dto.holdingAmount ? BigInt(dto.holdingAmount) : null;
    rewardedActivity.holdingPeriod = dto.holdingPeriod;
    rewardedActivity.preDate = dto.preDate ? moment(dto.preDate) : null;
    rewardedActivity.postDate = dto.postDate ? moment(dto.postDate) : null;
    rewardedActivity.useFiltering = !!(rewardedActivity.preDate || rewardedActivity.postDate);
    rewardedActivity.filteringType = rewardedActivity.postDate ? "postDate" : "preDate";

    return rewardedActivity;
  }

  /**
   * @returns {RewardedActivityDto}
   */
  toDto() {
    const dto = new RewardedActivityDto();

    dto.minTrxLimit = this.minimumTransactionLimit?.toString();
    dto.minTrxAmount = this.minimumTransactionCount?.toString();
    dto.productActivity = this.activity;
    dto.productActivityAction = this.action;
    dto.actionType = this.type?.getName() || null;
    dto.action = this.activityAction?.getName() || null;

    dto.vault = this.vault;
    dto.minimumDepositLimit = this.minimumDepositLimit?.toString();
    dto.depositAmount = this.depositAmount?.toString();
    dto.newVaultsOnly = this.newVaultsOnly;
    dto.vaultCount = this.vaultCount;
    dto.holdingAmount = this.holdingAmount?.toString();
    dto.holdingPeriod = this.holdingPeriod;
    dto.preDate = (this.useFiltering && this.filteringType === "preDate" && this.preDate) ? this.preDate.utc().format() : null;
    dto.postDate = (this.useFiltering && this.filteringType === "postDate" && this.postDate) ? this.postDate.utc().format() : null;

    return dto;
  }
}
