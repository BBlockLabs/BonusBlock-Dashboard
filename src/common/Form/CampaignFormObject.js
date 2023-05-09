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
  timeFrame = [moment().toDate(), moment().toDate()];
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
   * @param {Campaign} campaign
   */
  setCampaignValues(campaign) {
    campaign.name = this.name;
    campaign.frequencyRatioDaily = parseFloat(this.frequencyRatioDaily);
    campaign.frequencyRatioWeekly = parseFloat(this.frequencyRatioWeekly);
    campaign.frequencyRatioMonthly = parseFloat(this.frequencyRatioMonthly);

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
  }

  /**
   * @param {Campaign} campaign
   */
  setValuesFromCampaign(campaign) {
    this.name = campaign.name;
    this.frequencyRatioDaily = campaign.frequencyRatioDaily;
    this.frequencyRatioWeekly = campaign.frequencyRatioWeekly;
    this.frequencyRatioMonthly = campaign.frequencyRatioMonthly;
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
  }
}
