import Model from "@/state/models/Model";
import moment from "moment";
import CampaignDto from "@/common/dto/CampaignDto.js";

export default class Campaign extends Model {
  /**
   * @type {string}
   */
  name = "";

  /**
   * @type {Date}
   */
  timeFrameFrom = moment().toDate();

  /**
   * @type {Date}
   */
  timeFrameTill = moment().toDate();

  /**
   * @type {string}
   */
  rewardPoolContract = "";

  /**
   * @type {bigint | string}
   */
  rewardPoolTokenCount = "";
  /**
   * @type {number}
   */
  frequencyRatioDaily = 0;

  /**
   * @type {number}
   */
  frequencyRatioWeekly = 0;

  /**
   * @type {number}
   */
  frequencyRatioMonthly = 0;

  /**
   * @type {bigint | string}
   */
  minimumPerUserAward = "";

  /**
   * @type {bigint | string}
   */
  maximumPerUserAward = "";

  /**
   * @type {number}
   */
  expectedReturnOfInvestment = 0;

  /**
   * @type {boolean}
   */
  weeklyEqualDistribution = false;

  /**
   * @type {boolean}
   */
  qualityAudience = false;

  /**
   * @type {"DRAFT"|"CONFIRMED"|"PAYED"|"RUNNING"|"ENDED"|"CANCELLED"|"DELETED"}
   */
  status = "DRAFT";

  /**
   * @type {Array<String>}
   */
  categories = [];

  /**
   * @type {string | null}
   */
  network;

  /**
   * @type {string | null}
   */
  product;

  /**
   * @param {CampaignDto} campaignDto
   * @return {Campaign}
   */
  static fromDto(campaignDto) {
    const campaign = new Campaign();

    if (campaignDto.id !== undefined) {
      campaign.id = campaignDto.id;
    }

    if (campaignDto.status !== undefined) {
      campaign.status = campaignDto.status;
    }

    campaign.name = campaignDto.title;
    campaign.timeFrameFrom = moment(campaignDto.periodFrom).toDate();
    campaign.timeFrameTill = moment(campaignDto.periodTill).toDate();
    campaign.frequencyRatioDaily = campaignDto.rateDaily;
    campaign.frequencyRatioWeekly = campaignDto.rateWeekly;
    campaign.frequencyRatioMonthly = campaignDto.rateMonthly;
    campaign.maximumPerUserAward = campaignDto.maxUserReward
      ? BigInt(campaignDto.maxUserReward)
      : null;
    campaign.minimumPerUserAward = campaignDto.minUserReward
      ? BigInt(campaignDto.minUserReward)
      : null;
    campaign.status = campaignDto.status;
    campaign.categories = campaignDto.categories.map(({ id }) => id);
    campaign.rewardPoolContract = campaignDto.rewardPool?.id || null;
    campaign.network = campaignDto.network?.id || null;
    campaign.product = campaignDto.product?.id || null;
    campaign.weeklyEqualDistribution = campaignDto.weeklyEqDistribution;
    campaign.qualityAudience = campaignDto.qualityAudience;
    campaign.rewardPoolTokenCount = BigInt(campaignDto.rewardPoolAmount || 0);
    campaign.expectedReturnOfInvestment = campaignDto.expectedROI;

    return campaign;
  }

  /**
   * @returns {CampaignDto}
   */
  toDto() {
    const dto = new CampaignDto();

    dto.campaignId = this.getId() || undefined;
    dto.title = this.name;
    dto.periodFrom = this.timeFrameFrom.toISOString();
    dto.periodTill = this.timeFrameTill.toISOString();
    dto.rateDaily = this.frequencyRatioDaily;
    dto.rateWeekly = this.frequencyRatioWeekly;
    dto.rateMonthly = this.frequencyRatioMonthly;
    dto.minUserReward = this.minimumPerUserAward?.toString() || "0";
    dto.maxUserReward = this.maximumPerUserAward?.toString() || "0";
    dto.categories = this.categories;
    dto.weeklyEqDistribution = this.weeklyEqualDistribution;
    dto.qualityAudience = this.qualityAudience;
    dto.rewardPoolAmount = this.rewardPoolTokenCount.toString();
    dto.expectedROI = this.expectedReturnOfInvestment;
    dto.rewardPool = this.rewardPoolContract;
    dto.network = this.network;
    dto.product = this.product;

    return dto;
  }
}
