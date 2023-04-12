import Model from "@/state/models/Model";
import moment from "moment";

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
  rewardPoolContract = ''

  /**
   * @type {Number}
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
  status = 'draft';

  normalizeFrequencyRatios() {
    const ratioSum = this.frequencyRatioDaily
      + this.frequencyRatioWeekly
      + this.frequencyRatioMonthly;

    if (ratioSum === 0) {
      return;
    }

    this.frequencyRatioDaily = this.frequencyRatioDaily / ratioSum;
    this.frequencyRatioWeekly = this.frequencyRatioWeekly / ratioSum;
    this.frequencyRatioMonthly = this.frequencyRatioMonthly / ratioSum;
  }
}
