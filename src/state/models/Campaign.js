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
   * @type {bigint}
   */
  rewardPoolTokenCount = 0;
  /**
   * @type {number}
   */
  frequencyRatioDaily = 1;

  /**
   * @type {number}
   */
  frequencyRatioWeekly = 2 / 3;

  /**
   * @type {bigint | null}
   */
  minimumPerUserAward = null;

  /**
   * @type {bigint | null}
   */
  maximumPerUserAward = null;

  /**
   * @type {number}
   */
  frequencyRatioMonthly = 1 / 3;

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

  normalizeFrequencyRatios() {
    const ratioSum =
      this.frequencyRatioDaily +
      this.frequencyRatioWeekly +
      this.frequencyRatioMonthly;

    if (ratioSum === 0) {
      return;
    }

    this.frequencyRatioDaily = this.frequencyRatioDaily / ratioSum;
    this.frequencyRatioWeekly = this.frequencyRatioWeekly / ratioSum;
    this.frequencyRatioMonthly = this.frequencyRatioMonthly / ratioSum;
  }

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
    campaign.frequencyRatioDaily = campaignDto.rateDaily / 100;
    campaign.frequencyRatioWeekly = campaignDto.rateWeekly / 100;
    campaign.frequencyRatioMonthly = campaignDto.rateMonthly / 100;
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
    dto.rateDaily = Math.round(this.frequencyRatioDaily * 100);
    dto.rateWeekly = Math.round(this.frequencyRatioWeekly * 100);
    dto.rateMonthly = Math.round(this.frequencyRatioMonthly * 100);
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
