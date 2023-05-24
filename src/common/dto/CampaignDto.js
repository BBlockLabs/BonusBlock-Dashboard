export default class CampaignDto {
  /**
   * @type {string | undefined}
   */
  id;
  /**
   * @type {string | undefined}
   */
  campaignId;
  /**
   * @type {"DRAFT"|"confirmed"|"payed"|"running"|"ended"|"cancelled"|"deleted" | undefined}
   */
  status;
  /**
   * @type {string}
   */
  title = "";
  /**
   * @type {string}
   */
  periodFrom = "";
  /**
   * @type {string}
   */
  periodTill = "";
  /**
   * @type {number}
   */
  rateDaily = 0;
  /**
   * @type {number}
   */
  rateWeekly = 0;
  /**
   * @type {string}
   */
  maxUserReward = "0";
  /**
   * @type {string}
   */
  minUserReward = "0";
  /**
   * @type {string}
   */
  rewardPoolAmount = "0";
  /**
   * @type {number}
   */
  expectedROI = 0;
  /**
   * @type {Boolean}
   */
  weeklyEqDistribution = false;
  /**
   * @type {Boolean}
   */
  qualityAudience = false;
  /**
   * @type {NetworkDto | null}
   */
  network = null;
  /**
   * @type {ProductDto | null}
   */
  product = null;
  /**
   * @type {ContractDto | null}
   */
  rewardPool = null;
  /**
   * @type {PaymentDto | null}
   */
  payment = null;
  /**
   * @type {Array<string>}
   */
  tags = [];
  /**
   * @type {Array<RewardedActivityDto>}
   */
  activities = [];
  /**
   * @type {number}
   */
  weightFrequency = 0;
  /**
   * @type {number}
   */
  weightActivity = 0;
}
