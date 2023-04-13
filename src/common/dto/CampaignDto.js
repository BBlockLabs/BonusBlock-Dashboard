import moment from "moment";

export default class CampaignDto {
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
   * @type {Number}
   */
  rewardPoolTokenCount = 0;
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
   * @type {Array<RewardedActivityDto>}
   */
  rewardedActivities = [];

  /**
   * @type {string | null}
   */
  network = null;

  /**
   * @type {string | null}
   */
  product = null;
}
