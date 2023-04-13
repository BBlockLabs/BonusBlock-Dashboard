export default class CampaignDto {
  /**
   * @type {string}
   */
  id = "";
  /**
   * @type {string}
   */
  version = "";
  /**
   * @type {string}
   */
  createdOn = "";
  /**
   * @type {string}
   */
  modifiedOn = "";
  /**
   * @type {string}
   */
  name = "";
  /**
   * @type {string}
   */
  timeFrameFrom = "";
  /**
   * @type {string}
   */
  timeFrameTill = "";
  /**
   * @type {string}
   */
  rewardPoolContract = "";
  /**
   * @type {string}
   */
  rewardPoolTokenCount = "0";
  /**
   * @type {string}
   */
  frequencyRatioDaily = "0";
  /**
   * @type {string}
   */
  frequencyRatioWeekly = "0";
  /**
   * @type {string}
   */
  frequencyRatioMonthly = "0";
  /**
   * @type {string}
   */
  expectedReturnOfInvestment = "0";
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
