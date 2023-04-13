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
   * @type {"draft"|"confirmed"|"payed"|"running"|"ended"|"cancelled"|"deleted"}
   */
  status = "draft";

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

    campaign.id = campaignDto.id;

    campaign.version = parseInt(campaignDto.version);
    campaign.createdOn = moment(campaignDto.createdOn);
    campaign.modifiedOn = moment(campaignDto.modifiedOn);
    campaign.name = campaignDto.name;
    campaign.timeFrameFrom = moment(campaignDto.timeFrameFrom).toDate();
    campaign.timeFrameTill = moment(campaignDto.timeFrameTill).toDate();
    campaign.rewardPoolContract = campaignDto.rewardPoolContract;
    campaign.rewardPoolTokenCount = BigInt(campaignDto.rewardPoolTokenCount);
    campaign.frequencyRatioDaily = parseFloat(campaignDto.frequencyRatioDaily);
    campaign.frequencyRatioWeekly = parseFloat(
      campaignDto.frequencyRatioWeekly
    );
    campaign.frequencyRatioMonthly = parseFloat(
      campaignDto.frequencyRatioMonthly
    );
    campaign.expectedReturnOfInvestment = parseInt(
      campaignDto.expectedReturnOfInvestment
    );
    campaign.weeklyEqualDistribution = campaignDto.weeklyEqualDistribution;
    campaign.qualityAudience = campaignDto.qualityAudience;
    campaign.status = campaignDto.status;
    campaign.categories = campaignDto.categories;
    campaign.network = campaignDto.network;
    campaign.product = campaignDto.product;

    return campaign;
  }

  /**
   * @returns {CampaignDto}
   */
  toDto() {
    const dto = new CampaignDto();

    dto.id = this.getId();
    dto.version = this.version.toString();
    dto.createdOn = this.createdOn.toISOString();
    dto.modifiedOn = this.modifiedOn.toISOString();
    dto.name = this.name;
    dto.timeFrameFrom = this.timeFrameFrom.toISOString();
    dto.timeFrameTill = this.timeFrameTill.toISOString();
    dto.rewardPoolContract = this.rewardPoolContract.toString();
    dto.rewardPoolTokenCount = this.rewardPoolTokenCount.toString();
    dto.frequencyRatioDaily = this.frequencyRatioDaily.toString();
    dto.frequencyRatioWeekly = this.frequencyRatioWeekly.toString();
    dto.frequencyRatioMonthly = this.frequencyRatioMonthly.toString();
    dto.expectedReturnOfInvestment = this.expectedReturnOfInvestment.toString();
    dto.weeklyEqualDistribution = this.weeklyEqualDistribution;
    dto.qualityAudience = this.qualityAudience;
    dto.status = this.status;
    dto.categories = this.categories;
    dto.network = this.network;
    dto.product = this.product;

    return dto;
  }
}
