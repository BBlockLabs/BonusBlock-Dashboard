import moment from "moment";
import formObject from "@/common/Form/FormObject.js";

export default class CampaignFormObject extends formObject {
  /**
   * @type {string}
   */
  name = "";
  /**
   * @type {number}
   */
  frequencyRatio = 50;
  /**
   * @type {string}
   */
  minimumPerUserAward = "0";
  /**
   * @type {string}
   */
  maximumPerUserAward = "0";
  /**
   * @type {string}
   */
  rewardPoolContract = "";
  /**
   * @type {string}
   */
  rewardPoolTokenCount = "";
  /**
   * @type {[Date, Date]}
   */
  timeFrame = [
    moment().add(1, "hour").toDate(),
    moment().add(1, "hour").add(7, "days").add(1, "minute").toDate(),
  ];
  /**
   * @type {string}
   */
  expectedReturnOfInvestment = "";
  /**
   * @type {boolean}
   */
  weeklyEqualDistribution = false;
  /**
   * @type {boolean}
   */
  qualityAudience = false;
  /**
   * @type {Array<String>}
   */
  categories = [];
  /**
   * @type {string | null}
   */
  network = null;
  /**
   * @type {string | null}
   */
  product = null;
  /**
   * @type {number}
   */
  weightRatio = 50;

  /**
   * @type {boolean}
   */
  advanced = false;

  /**
   * @param {Campaign} campaign
   */
  setCampaignValues(campaign) {
    campaign.name = this.name;

    campaign.frequencyRatioWeekly = this.frequencyRatio;
    campaign.frequencyRatioDaily = 100 - this.frequencyRatio;

    if (this.minimumPerUserAward) {
      campaign.minimumPerUserAward = BigInt(this.minimumPerUserAward);
    }

    if (this.maximumPerUserAward) {
      campaign.maximumPerUserAward = BigInt(this.maximumPerUserAward);
    }

    campaign.rewardPoolContract = this.rewardPoolContract;
    campaign.rewardPoolTokenCount = BigInt(this.rewardPoolTokenCount);
    campaign.timeFrameFrom = this.timeFrame[0];
    campaign.timeFrameTill = this.timeFrame[1];
    campaign.expectedReturnOfInvestment = parseInt(
      this.expectedReturnOfInvestment
    );
    campaign.weeklyEqualDistribution = this.weeklyEqualDistribution;
    campaign.qualityAudience = this.qualityAudience;
    campaign.categories = this.categories;
    campaign.network = this.network;
    campaign.product = this.product;
    campaign.weightActivity = this.weightRatio;
    campaign.weightFrequency = 100 - this.weightRatio;
  }

  /**
   * @param {Campaign} campaign
   */
  setValuesFromCampaign(campaign) {
    this.name = campaign.name;
    this.frequencyRatio = campaign.frequencyRatioWeekly;
    this.minimumPerUserAward = campaign.minimumPerUserAward?.toString() || "";
    this.maximumPerUserAward = campaign.maximumPerUserAward?.toString() || "";
    this.rewardPoolContract = campaign.rewardPoolContract;
    this.rewardPoolTokenCount = campaign.rewardPoolTokenCount.toString();
    this.timeFrame[0] = campaign.timeFrameFrom;
    this.timeFrame[1] = campaign.timeFrameTill;
    this.expectedReturnOfInvestment =
      campaign.expectedReturnOfInvestment.toString();
    this.weeklyEqualDistribution = campaign.weeklyEqualDistribution;
    this.qualityAudience = campaign.qualityAudience;
    this.categories = campaign.categories;
    this.network = campaign.network;
    this.product = campaign.product;
    this.weightRatio = campaign.weightActivity;
  }
}
